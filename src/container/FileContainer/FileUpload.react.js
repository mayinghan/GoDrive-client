import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, Progress, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { checkAuth } from '../../redux/user.redux';

const { Dragger } = Upload;

const SIZE = 2 * 1024 * 1024;
let chunks = [];
const createChunks = (file, size = SIZE) => {
	const chunks = [];
	let cur = 0;
	while (cur < file.size) {
		chunks.push({ file: file.slice(cur, cur + size) });
		cur += size;
	}

	return chunks;
};

export const FileUpload = () => {
	const [fileList, setFileList] = useState([]);
	//	const [uploading, setUploading] = useState(false);
	const [rawChunkList, setRawChunkList] = useState([]);
	const [hash, setHash] = useState(0);
	const [hashPct, setHashPct] = useState(0.0);
	const [percentage, setPercentage] = useState(0.0);
	const [total, setTotal] = useState(0.0);

	const user = useSelector(state => state.user);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!fileList[0]) setPercentage(0);
		else {
			// console.log(total);
			// console.log(fileList[0].size);
			// console.log(((total * 100) / fileList[0].size).toFixed(2));
			setPercentage(((total * 100) / fileList[0].size).toFixed(2));
		}
	}, [total]);

	const createProgressHandler = item => {
		return e => {
			item.percentage = parseInt(String((e.loaded / e.total) * 100));
			setTotal(total + e.loaded);
		};
	};

	const handleUpload = () => {
		const uploadedList = [];
		const uploadId =
			user.username + '-' + new Date().getTime() + '-' + fileList[0].name;
		const parts = rawChunkList.map(({ file }, index) => ({
			fileHash: hash,
			index,
			chunkId: hash + '_' + index,
			chunk: file,
			size: file.size,
			percentage: uploadedList.includes(index) ? 100 : 0
		}));

		chunks = parts;
		const reqList = parts
			.filter(c => uploadedList.indexOf(c.hash) === -1)
			.map(({ chunk, chunkId, index }, i) => {
				const form = new FormData();
				form.append('chunk', chunk);
				form.append('uploadId', uploadId);
				form.append('chunkId', chunkId);
				form.append('filename', fileList[0].name);
				form.append('filehash', hash);
				return { form, index };
			});

		sendRequests(parts, reqList, 4);
	};

	const sendRequests = (parts, requestList, max = 4) => {
		return new Promise((resolve, reject) => {
			const len = requestList.length;
			let idx = 0;
			let counter = 0;
			const start = async () => {
				// if there is a request and there is an available channel
				while (idx < len && max > 0) {
					max--; //this request take one channel
					// console.log(idx, ' starts');
					const form = requestList[idx].form;
					// use to retry failed requests in the future
					const chunkIdx = requestList[idx].index;
					idx++;
					request({
						url: '/api/file/uploadchunk',
						data: form,
						header: {
							'content-type': 'multipart/form-data'
						},
						onProgress: createProgressHandler(chunks[chunkIdx])
					})
						.then(res => {
							// console.log(res.data);
							max++; //release the channel
							counter++;
							if (counter === len) {
								// finish
								message.success('Upload done!');
								resolve();
							} else {
								// continue
								start();
							}
						})
						.catch(err => {
							reject(err);
						});
				}
			};
			start();
		});
	};

	const request = ({ url, data, headers = {}, onProgress = e => e }) => {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
			// xhr.upload.onprogress = onProgress;

			xhr.upload.addEventListener('progress', e => {
				setTotal(prev => prev + e.loaded);
			});
			xhr.open('post', url);
			Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
			xhr.send(data);
			xhr.onload = e => {
				resolve({ data: e.target.response });
			};
		});
	};

	const calculateHash = fileChunkList => {
		return new Promise((resolve, reject) => {
			const worker = new Worker('/hash.js');
			worker.postMessage({ fileChunkList });
			worker.onmessage = e => {
				const { percentage, hash } = e.data;
				setHashPct(percentage.toFixed(2));
				if (hash) {
					resolve(hash);
				}
			};
		});
	};
	const props = {
		onRemove: file => {
			const idx = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(idx, 1);
			setFileList(newFileList);
		},
		beforeUpload: file => {
			// check auth
			dispatch(checkAuth());
			setHashPct(0.0);
			setPercentage(0.0);
			setTotal(0);
			return new Promise(async (res, rej) => {
				console.log(file.size);
				// get chunks
				const fileChunkList = createChunks(file);
				// calculate hash
				message.loading(`Processing file`, 0);
				const hash = await calculateHash(fileChunkList);
				setHash(hash);
				message.destroy();
				message.success('Processing done! Ready to upload', 2);
				console.log(hash);

				setRawChunkList(fileChunkList);

				setFileList([file]);
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
			Preprocess<Progress type='dashboard' percent={hashPct}></Progress>
			Upload
			<Progress type='dashboard' percent={percentage}></Progress>
		</div>
	);
};
