'use strict';
const axios = require('axios');

const SIZE = 2 * 1024 * 1024;

const requestUpload = (url, formdata) => {
	return axios.post(url, formdata);
};

// send request with max concurrency (4 by default)
const sendRequest = async (requestList, max = 4) => {
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
				requestUpload('/api/file/uploadchunk',form).then(() => {
					max++; //release the channel
					counter++;
					if (counter === len) {
						// finish
						resolve();
					} else {
						// continue
						start();
					}
				}).catch(err => {
					reject(err);
				});
			}
		};
		start();
	});
};

// notify the server to merge files
const sendMergeRequest = async (username, filename) => {
	const uploadId = username + new Date().getTime() + filename;
	await requestUpload('/api/file/merge', {uploadId: uploadId})
}

// create file chunks
module.exports = createChunks = (file, size = SIZE) => {
	const chunks = [];
	let cur = 0;
	while (cur < file.size) {
		chunks.push({ file: file.slice(cur, cur + size) });
		cur += size;
	}

	return chunks;
};

/** upload chunks
 *	@param {Array} chunks file chunks
 *  @param {Array} uploadedList chunks which already uploaded
 */
module.exports = uploadChunks = (username, filename, filehash, chunks, uploadedList) => {
	const list = this.chunks
		.filter(c => uploadedList.indexOf(c.hash) == -1)
		.map(({ chunk, hash, index }, i) => {
			const form = new FormData();
			form.append('chunk', chunk);
			form.append('hash', hash);
			form.append('filename', filename);
			form.append('filehash', filehash);
			return { form, index };
		});

	// send requests with concurrency control
	try {
		await sendRequest(list, 4);

		if(list.length + uploadedList.length === chunks.length) {
			// inform the server to merge files
			await sendMergeRequest(username, filename);
		}
	} catch(err) {
		console.error(err.stack)
	}
};
