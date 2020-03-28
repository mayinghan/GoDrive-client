import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Row, Col, Tooltip } from 'antd';
import { getFileList, deleteFile } from '#/redux/file.redux';
import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Column } = Table;

export const FileList = () => {
	// hooks
	const [deleteModalVsb, setDeleteModalVsb] = useState(false); // set the delete modal visibility
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const fileState = useSelector(s => s.file);

	useEffect(() => {
		dispatch(getFileList()).then(() => {
			setLoading(false);
		});
		
	}, [dispatch]);

	const deleteHandler = (filehash, filename) => {
		console.log('deleting file ', filename);
		dispatch(deleteFile(filehash, filename));
	};
	
	return (
		<React.Fragment>
			{/* table items are in fileState.myFiles */}
			{/* {console.log(fileState.myFiles)} */}
			<Table 
				dataSource={fileState.myFiles}
				loading={loading}>
				<Column
					title='FileName'
					dataIndex='filename'
					key='filename'
				/>
				<Column
					title='Download'
					render={(text, record) =>{
						return (
							<Tooltip title="Download">
								<Button shape="round" icon={<CloudDownloadOutlined />} />
							</Tooltip>
						);
					}}
				></Column>
				<Column
					title='Delete'
					render={(text, record) =>{
						return (
							<Tooltip title="Delete">
								<Button shape="round" onClick={()=>deleteHandler(record.key, record.filename)} icon={<DeleteOutlined />} />
							</Tooltip>
						);
					}}
				></Column>
			</Table>
		</React.Fragment>
	);
};
