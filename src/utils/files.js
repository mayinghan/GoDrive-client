import axios from 'axios';
import message from 'antd';

const utils = {
	verifyUpload: function(uploadId, filename, filehash, chunkLength) {
		console.log('filename %s', filename);
		// post body: filehash, filename, uploadId, chunkLength
		axios
			.post('/api/file/checkIntegrity', {
				filename,
				filehash,
				uploadId,
				chunkLength
			})
			.then(res => {
				console.log(res.data);
			});
	}
};

export default utils;
