import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FileUploader from '../../utils/fileUploader';

const { Dragger } = Upload;

// const props = {
// 	name: 'file',
// 	multiple: false,
// 	withCredentials: true,
// 	action: '/api/file/upload',
// 	onChange(info) {
// 		const { status, response } = info.file;
// 		if (status !== 'uploading') {
// 			console.log(info.file, info.fileList);
// 		}
// 		if (status === 'done') {
// 			console.log(response)
// 			message.success(`${info.file.name} file uploaded successfully.`);
// 		} else if (status === 'error') {
// 			message.error(`${info.file.name} file upload failed.`);
// 		}
// 	}
// };

export const FileUpload = () => {
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);
	const user = useSelector(state => state.user);

	const handleUpload = () => {
		fileList.forEach(f => {
			const fu = new FileUploader(user.username, f);
			fu.upload();
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
			setFileList([...fileList, file]);
			return false;
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
			<Button type='primary' onClick={handleUpload}>
				Upload
			</Button>
		</div>
	);
};
