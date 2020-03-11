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
	}
};

export default utils;
