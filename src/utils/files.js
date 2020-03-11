import axios from 'axios';
import { message } from 'antd';

const utils = {
	// check the integrity after uploading to the server
	verifyUpload: function(filename, filehash, chunkLength) {
		console.log('filename %s', filename);
		// post body: filehash, filename, uploadId, chunkLength
		return axios
			.post('/api/file/checkIntegrity', {
				filename,
				filehash,
				chunkLength
			});
	}
};

export default utils;
