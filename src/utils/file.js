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
		this.username = username;
		this.chunks = null;
		this.file = file;
		this.status = null;
		this.hash = null;
		this.worker = null;
		this.uploadPercentage = 0;
	}

	async handleUpload() {
		if (!this.file) {
			console.log('No file detected');
			return;
		}
		this.status = STATUS.uploading;
		const fileChunkList = this.createChunks(this.file);
		this.hash = await this.calculateHash(fileChunkList);

		const { shouldUpload, uploadedList } = await this.verifyUpload(
			this.file.name,
			this.hash
		);

		if (!shouldUpload) {
			console.log('instant upload success');
			message.success('instant upload successfully');
			this.status = STATUS.wait;
			return;
		}

		this.chunks = fileChunkList.map(({ file }, index) => ({
			fileHash: this.hash,
			index,
			hash: this.hash + '_' + index,
			chunk: file,
			size: file.size,
			percentage: uploadedList.includes(index) ? 100 : 0
		}));

		await this.uploadChunks(uploadedList);
	}

	async uploadChunks(uploadedList) {
		const list = this.chunks
			.filter(c => uploadedList.indexOf(c.hash) == -1)
			.map(({ chunk, hash, index }, i) => {
				const form = new FormData();
				form.append('chunk', chunk);
				form.append('hash', hash);
				form.append('filename', this.file.name);
				form.append('filehash', this.hash);
				return { form, index };
			});
		// send requests with concurrency control
		try {
			await this.sendRequest(list, 4);

			if (list.length + uploadedList.length === chunks.length) {
				// inform the server to merge files
				await this.sendMergeRequest(username, filename);
			}
		} catch (err) {
			console.error(err.stack);
		}
	}

	createChunks(file, size = SIZE) {
		const chunks = [];
		let cur = 0;
		while (cur < file.size) {
			chunks.push({ file: file.slice(cur, cur + size) });
			cur += size;
		}

		return chunks;
	}

	request({ url, data, headers = {}, onProgress = e => e }) {
		return new Promise(res => {
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
	calculateHash(fileChunkList) {
		return new Promise((resolve, reject) => {
			this.worker = new Worker('./hash.js');
			worker.postMessage({ fileChunkList });
			worker.onmessage = e => {
				const { percentage, hash } = e.data;
				if (hash) {
					resolve(hash);
				}
			};
		});
	}

	// send request with max concurrency (4 by default)
	async sendRequest(requestList, max = 4) {
		return new Promise((resolve, reject) => {
			const len = requestList.length;
			let idx = 0;
			let counter = 0;
			const start = async () => {
				// if there is a request and there is an available channel
				while (idx < len && max > 0) {
					max--; //this request take one channel
					console.log(idx, ' starts');
					const form = requestList.form;
					// use to retry failed requests in the future
					const chunkIdx = requestList.index;
					idx++;
					this.request({
						url: '/api/file/uploadchunk',
						data: form,
						onProgress: createProgressHandler(this.chunks[chunkIdx])
					})
						.then(() => {
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
	async sendMergeRequest() {
		const uploadId = this.username + new Date().getTime() + this.file.name;
		await this.request({
			url: '/api/file/merge',
			headers: { 'content-type': 'application/json' },
			data: JSON.stringify({ uploadId: uploadId })
		});
	}

	// check if file is already uploaded based on hash
	async verifyUpload(filename, filehash) {
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
	createProgressHandler(item) {
		return e => {
			item.percentage = parseInt(String((e.loaded / e.total) * 100));
		};
	}
}

export default FileUploader;
