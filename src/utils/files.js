import axios from 'axios';

const utils = {
	verifyUpload: function(filename, filehash, chunkLength) {
		console.log('filename %s', filename);
		// post body: filehash, filename, uploadId, chunkLength
		axios
			.post('/api/file/checkIntegrity', {
				filename,
				filehash,
				chunkLength
			})
			.then(res => {
				console.log(res.data);
			});
	}
};

export default utils;
