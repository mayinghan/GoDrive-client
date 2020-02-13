'use strict';
import { message } from 'antd';

const SIZE = 2 * 1024 * 1024;

const STATUS = {
	wait: 'wait',
	pause: 'pause',
	uploading: 'uploading'
};

class FileUploader {
	constructor(username, file) {
		console.log(file.name);
		this.username = username;
		this.chunks = null;
		this.file = file;
		this.status = null;
		this.hash = null;
		this.worker = null;
		this.uploadPercentage = 0;

		this.uploadId = username + '-' + new Date().getTime() + '-' + file.name;
	}

	async upload() {
		console.log(this.uploadId);
		if (!this.file) {
			console.log('No file detected');
			return;
		}
		this.status = STATUS.uploading;
		const fileChunkList = this._createChunks(this.file);
		this.hash = await this._calculateHash(fileChunkList);

		// const { shouldUpload, uploadedList } = await this._verifyUpload(
		// 	this.file.name,
		// 	this.hash
		// );

		// if (!shouldUpload) {
		// 	console.log('instant upload success');
		// 	message.success('instant upload successfully');
		// 	this.status = STATUS.wait;
		// 	return;
		// }

		const uploadedList = [];
		this.chunks = fileChunkList.map(({ file }, index) => ({
			fileHash: this.hash,
			index,
			chunkId: this.hash + '_' + index,
			chunk: file,
			size: file.size,
			percentage: uploadedList.includes(index) ? 100 : 0
		}));

		await this._uploadChunks(uploadedList);
	}

	async _uploadChunks(uploadedList) {
		const list = this.chunks
			.filter(c => uploadedList.indexOf(c.hash) == -1)
			.map(({ chunk, chunkId, index }, i) => {
				const form = new FormData();
				form.append('chunk', chunk);
				form.append('uploadId', this.uploadId);
				form.append('chunkId', chunkId);
				form.append('filename', this.file.name);
				form.append('filehash', this.hash);
				return { form, index };
			});
		// send requests with concurrency control
		console.log(list);
		try {
			await this._sendRequest(list, 4);

			if (list.length + uploadedList.length === this.chunks.length) {
				// inform the server to merge files
				//await this._sendMergeRequest(this.username, this.filename);
			}
		} catch (err) {
			console.error(err.stack);
		}
	}

	_createChunks(file, size = SIZE) {
		const chunks = [];
		let cur = 0;
		while (cur < file.size) {
			chunks.push({ file: file.slice(cur, cur + size) });
			cur += size;
		}

		return chunks;
	}

	request({ url, data, headers = {}, onProgress = e => e }) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();
			xhr.upload.onprogress = onProgress;
			xhr.open('post', url);
			Object.keys(headers).forEach(k => xhr.setRequestHeader(k, headers[k]));
			xhr.send(data);
			xhr.onload = e => {
				resolve({ data: e.target.response });
			};
		});
	}

	// calculate hash
	_calculateHash(fileChunkList) {
		return new Promise((resolve, reject) => {
			this.worker = new Worker('/hash.js');
			this.worker.postMessage({ fileChunkList });
			this.worker.onmessage = e => {
				const { percentage, hash } = e.data;
				if (hash) {
					resolve(hash);
				}
			};
		});
	}

	// send request with max concurrency (4 by default)
	async _sendRequest(requestList, max = 4) {
		return new Promise((resolve, reject) => {
			const len = requestList.length;
			let idx = 0;
			let counter = 0;
			const start = async () => {
				// if there is a request and there is an available channel
				while (idx < len && max > 0) {
					max--; //this request take one channel
					console.log(idx, ' starts');
					const form = requestList[idx].form;
					// use to retry failed requests in the future
					const chunkIdx = requestList[idx].index;
					idx++;
					console.log(form);
					this.request({
						url: '/api/file/uploadchunk',
						data: form,
						header: {
							'content-type': 'multipart/form-data'
						},
						onProgress: this._createProgressHandler(this.chunks[chunkIdx])
					})
						.then(res => {
							console.log(res.data);
							max++; //release the channel
							counter++;
							if (counter === len) {
								// finish
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
	}

	// notify the server to merge files
	async _sendMergeRequest() {
		await this.request({
			url: '/api/file/merge',
			headers: { 'content-type': 'application/json' },
			data: JSON.stringify({ uploadId: this.uploadId })
		});
	}

	// check if file is already uploaded based on hash
	async _verifyUpload(filename, filehash) {
		const { data } = await this.request({
			url: '/api/file/verify',
			headers: {
				'content-type': 'application/json'
			},
			data: JSON.stringify({
				filename,
				filehash
			})
		});

		return JSON.parse(data);
	}

	// save the progress of handling each chunk
	_createProgressHandler(item) {
		return e => {
			item.percentage = parseInt(String((e.loaded / e.total) * 100));
		};
	}
}

export default FileUploader;
