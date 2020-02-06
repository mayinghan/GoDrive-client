import React, { useState } from 'react';
import axios from 'axios';
import { Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const CHUNK_SIZE = 2 * 1024 * 1024;

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

	const createFileChunk = (file, size = CHUNK_SIZE) => {
		const chunks = [];
		let cur = 0;
		console.log(file.size);
		while (cur < file.size) {
			chunks.push({ file: file.slice(cur, cur + size) });
			cur += size;
		}
		return chunks;
	};

	const handleUpload = () => {
		const chunksList = fileList.map(f => createFileChunk(f));
		console.log(chunksList);
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
			console.log(fileList);
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
