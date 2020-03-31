import axios from 'axios';

const utils = {
	// check the integrity after uploading to the server
	verifyUpload: function(filename, filehash, chunkLength, filesize) {
		console.log('filename %s', filename);
		console.log('filesize ', filesize);
		// post body: filehash, filename, uploadId, chunkLength
		return axios
			.post('/api/file/checkIntegrity', {
				filename,
				filehash,
				chunkLength,
				filesize
			});
	},
	// check if file can be instant uploaded
	instantUpload: function(filehash) {
		console.log('filehash: %s', filehash);
		return axios.get(`/api/file/instantupload?filehash=${filehash}`).then(res => {
			if(res.data.code === 0) {
				console.log(res.data.msg);
				return res.data.data.shouldUpload;
			}
		});
	},

	// get uploaded chunks
	getUploaded: function(filename, filehash) {
		console.log('filehash %s', filehash);
		return axios.get(`/api/file/prevChunks?filehash=${filehash}&filename=${filename}`).then(res => {
			console.log(res.data.msg);
			console.log(res.data);
			if(res.data.code === 0) {
				console.log(res.data.data);
			}
			return res.data.data.uploadedList;
		});
	},

	// get download url
	downloadURL: function(filehash) {
		return axios.get(`/api/file/url?filehash=${filehash}`);
	}
};

export default utils;
