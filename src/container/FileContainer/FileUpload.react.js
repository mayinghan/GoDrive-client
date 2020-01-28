import React from 'react';
import axios from 'axios';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

// const uploadFunc = file => {
// 	const fileForm = new FormData();
// 	fileForm.append('file', file);
// 	return axios
// 		.post('/api/file/upload', fileForm)
// 		.then(res => {
// 			if (res.status === 200) {
// 				console.log(res.data);
// 			}
// 		})
// 		.catch(console.error);
// };

const props = {
	name: 'file',
	multiple: false,
	action: '/api/file/upload',
	onChange(info) {
		const { status } = info.file;
		if (status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
};

export const FileUpload = () => {
	return (
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
	);
};
