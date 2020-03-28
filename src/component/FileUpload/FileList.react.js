import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tooltip } from 'antd';
import { getFileList } from '#/redux/file.redux';
import { DeleteFile } from '#/component/FileUpload/DeleteFile.react';
import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Column } = Table;

export const FileList = () => {
	// hooks
	const [deleteModalVsb, setDeleteModalVsb] = useState(false); // set the delete modal visibility
	const [loading, setLoading] = useState(true);
	const [chosenObj, setChosenObj] = useState({}); // using the file's hash and name as the chosen object info
	// const [deleteFile, setDeleteFile] = useState({
	// 	visible: false
	// });
	const dispatch = useDispatch();
	const fileState = useSelector(s => s.file);

	useEffect(() => {
		dispatch(getFileList()).then(() => {
			setLoading(false);
		});
		
	}, [dispatch]);
	
	const deletefile = e => {
		console.log(e);
		setDeleteModalVsb(true);
		setChosenObj({filename: e.filename, key: e.key});
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
								<Button shape="round" icon={<DeleteOutlined />} onClick={() => deletefile(record)}/>
							</Tooltip>
						);
					}}
				></Column>
			</Table>
			<DeleteFile
				visible={deleteModalVsb}
				hash={chosenObj.key}
				filename={chosenObj.filename}
				changeVsb={vsb => setDeleteModalVsb(vsb)}
			></DeleteFile>
		</React.Fragment>
	);
};
