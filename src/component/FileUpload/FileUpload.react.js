import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, Progress, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { checkAuth } from '#/redux/user.redux';
import fileutils from '#/utils/files';

const { Dragger } = Upload;
const THRESHOLD = 10 * 1024 * 1024;
const SIZE = 6 * 1024 * 1024;
let pause = false;
let uploadingList = [];

export const FileUpload = () => {
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [rawChunkList, setRawChunkList] = useState([]);
	const [hash, setHash] = useState(0);
	const [hashPct, setHashPct] = useState(0.0);
	const [percentage, setPercentage] = useState(0.0);
	const [isLarge, setIsLarge] = useState(false);
	const [pausing, setPausing] = useState(false);
	const user = useSelector(state => state.user);
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (!fileList[0]) setPercentage(0);
	// 	else {
	// 		let currUploadPct = parseInt(((total * 100) / fileList[0].size).toFixed(2));
	// 		if (currUploadPct == 100) {
	// 			// not done, waiting for integrity checking
	// 			currUploadPct = 99;
	// 		}
	// 		setPercentage(currUploadPct);
	// 	}
	// }, [total, fileList]);

	const handleUpload = async () => {
		console.log('start uploading');
		setUploading(true);
		if (fileList[0].size <= THRESHOLD) {
			// small file, directly upload
			const form = new FormData();
			form.append('file', fileList[0]);
			form.append('filehash', hash);
			request({
				url: '/api/file/upload',
				data: form,
				header: {
					'content-type': 'multipart/form-data'
				}
			}).then(res => {
				const responseData = JSON.parse(res.data);
				if(responseData.code === 0) {
					uploadDone();
				} else {
					console.log(responseData);
					message.error('Upload failed, please upload again');
				}
				setFileList([]);
			});
		} else {
			const uploadedList = await fileutils.getUploaded(fileList[0].name, hash);
			let tempPct = parseInt(uploadedList.length * 100 / rawChunkList.length);
			if(tempPct === 100) {
				tempPct = 99;
			}
			setPercentage(prev => {
				if(prev <= tempPct) {
					return tempPct;
				} else {
					return prev;
				}
			});
			const uploadId =
				user.username + '-' + hash + '-' + fileList[0].name;
			const parts = rawChunkList.map(({ file }, index) => ({
				fileHash: hash,
				index,
				chunkId: hash + '_' + index,
				chunk: file,
				size: file.size,
				percentage: uploadedList.includes(index) ? 100 : 0
			}));

			// filter out chunks that have already been uploaded
			// set the global var chunks. This is used to track the upload percentage
			const reqList = parts
				.filter(c => uploadedList.indexOf(c.index) === -1)
				.map(({ chunk, chunkId, index }) => {
					const form = new FormData();
					form.append('chunk', chunk);
					form.append('index', index);
					form.append('uploadId', uploadId);
					form.append('chunkId', chunkId);
					form.append('filename', fileList[0].name);
					form.append('filehash', hash);
					return { form, index };
				});

			sendRequests(uploadedList, reqList, 4);
		}
	};

	const sendRequests = (uploadedList=[], requestList, max = 4) => {
		return new Promise((resolve, reject) => {
			const totalLen = requestList.length + uploadedList.length;
			const len = requestList.length;
			let idx = 0;
			let counter = uploadedList.length;
			let allXhrList = [];
			requestList.forEach(() => {
				allXhrList.push(makeXhr({
					header: {
						'content-type': 'multipart/form-data'
					}}
				));
			});

			const start = async () => {
				if(!allXhrList.length) {
					fileutils.verifyUpload(fileList[0].name, hash, rawChunkList.length, fileList[0].size).then(() => {
						uploadDone();
						resolve();
					}).catch(err => {
						console.log(err.response.data);
						message.error(err.response.data.msg);
						reject(err);
					});
				}
				while(idx < len && max > 0) {
					max--;
					uploadingList.push(allXhrList[idx]);
					allXhrList[idx].open('post','/api/file/uploadchunk');
					allXhrList[idx].send(requestList[idx].form);
					allXhrList[idx].onload = e => {
						const xhrIdx = uploadingList.findIndex(i => i === allXhrList[idx]);
						uploadingList.splice(xhrIdx, 1);
						max++;
						counter++;
						let p = parseInt(counter * 100 / totalLen);
						if(p === 100) {
							p = 99;
						}
						setPercentage(prev => {
							if(prev <= p) {
								return p;
							} else {
								return prev;
							}
						});
						if (counter === totalLen) {
							// finish
							setUploading(false);
							console.log(e.target.response);
							
							fileutils.verifyUpload(fileList[0].name, hash, rawChunkList.length, fileList[0].size).then(() => {
								uploadDone();
								resolve();
							}).catch(err => {
								console.log(err.response.data);
								message.error(err.response.data.msg);
								reject(err);
							});
						} else {
							// continue
							// console.log(isPaused());
							if(!isPaused()) {
								start();
							} else {
								uploadingList.forEach(r => r.abort());
							}
						}
					};
					idx++;
				}
			};
			start();
		});
	};

	const isPaused = () => {
		return pause;
	};

	const request = ({ url, data, headers = {} }) => {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
			// xhr.upload.onprogress = onProgress;
			xhr.open('post', url);
			Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
			xhr.send(data);

			xhr.onload = e => {
				if(uploadingList) {
					const xhrIndx = uploadingList.findIndex(item => item === xhr);
					uploadingList.splice(xhrIndx, 1);
				}
				resolve({ data: e.target.response });
			};
			uploadingList?.push(xhr);
		});
	};

	const makeXhr = ({ headers={}}) => {
		const xhr = new XMLHttpRequest();
		Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
		return xhr;
	};

	const handlePause = () => {
		console.log('Paused');
		pause = true;
		setPausing(true);
		uploadingList.forEach(xhr => 
		{
			console.log(xhr);
			xhr?.abort();
		});
	};

	const handleResume = () => {
		console.log('resuming');
		pause = false;
		setPausing(false);
		handleUpload();
	};

	// calculate the hash of the file incrementally
	const calculateHashIncrmtl = fileChunkList => {
		return new Promise(resolve => {
			const worker = new Worker('/hashIncrem.js');
			worker.postMessage({ fileChunkList });
			worker.onmessage = e => {
				const { ptg, wholehash } = e.data;
				setHashPct(ptg.toFixed(2));
				if (wholehash) {
					resolve(wholehash);
				}
			};
		});
	};

	// calculate the hash as a whole
	const calculateHashWhole = file => {
		return new Promise(res => {
			const worker = new Worker('/hashWhole.js');
			worker.postMessage({ file });
			worker.onmessage = e => {
				const { ptg, wholehash } = e.data;
				setHashPct(ptg.toFixed(2));
				if (wholehash) {
					res(wholehash);
				}
			};
		});
	};

	const uploadDone = () => {
		message.success('File upload successfully');
		setPercentage(100);
		setFileList([]);
		setIsLarge(false);
		setUploading(false);
	};

	const createChunks = (file, size = SIZE) => {
		const c = [];
		let cur = 0;
		while (cur < file.size) {
			c.push({ file: file.slice(cur, cur + size) });
			cur += size;
		}
		return c;
	};

	const props = {
		onRemove: file => {
			const idx = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(idx, 1);
			setFileList(newFileList);
		},
		beforeUpload: async file => {
			// check auth
			dispatch(checkAuth());
			// init
			setHashPct(0.0);
			setPercentage(0.0);
			setPausing(false);
			pause = false;
			uploadingList = [];
			let filehash = '';
			// console.log(file.size);
			if (file.size <= THRESHOLD) {
				console.log('small file detected!');
				filehash = await calculateHashWhole(file);
				setHash(filehash);
				console.log(filehash);
			} else {
				console.log('large file detected');
				setIsLarge(true);
				// get chunks
				const fileChunkList = createChunks(file);
				message.loading('Processing file', 0);
				filehash = await calculateHashIncrmtl(fileChunkList);
				console.log(filehash);
				setHash(filehash);
				message.destroy();
				setRawChunkList(fileChunkList);
			}
			setFileList([file]);
			const shouldUpload = await fileutils.instantUpload(filehash);
			console.log('should upload? ', shouldUpload);
			// if the file can be instant uploaded
			if(!shouldUpload) {
				return new Promise((_, rej)=> {
					uploadDone();
					rej();
				});
			}
			return new Promise(res => {
				res();
			});
		},
		customRequest: () => {
			handleUpload();
		},
		fileList
	};

	return (
		<div>
			<Dragger {...props}>
				<p className='ant-upload-drag-icon'>
					<InboxOutlined />
				</p>
				<p className='ant-upload-text'>
					Click or drag file to this area to upload
				</p>
				<p className='ant-upload-hint'>
					Support for a single upload. Strictly prohibit from uploading company
					data or other band files
				</p>
			</Dragger>
			{isLarge ? <div>
				{!pausing ? 
					<Button disabled={!uploading} onClick={handlePause} type='primary' size='large' className='button-cls'>Pause</Button>
					: <Button disabled={!uploading} onClick={handleResume} type='primary' size='large' className='button-cls'>Resume</Button>
				}
				<Button disabled={!uploading} type='danger' size='large' className='button-cls'>Cancel</Button></div>: null}
			
			<br></br>
			Preprocess<Progress type='line' percent={hashPct}></Progress>
			Upload
			<Progress type='line' percent={percentage}></Progress>
		</div>
	);
};
