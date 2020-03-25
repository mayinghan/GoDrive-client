import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Row, Col } from 'antd';
import { getFileList } from '#/redux/file.redux';

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
	
	return (
		<React.Fragment>
			<div>List</div>
			{/* table items are in fileState.myFiles */}
			{console.log(fileState.myFiles)}
			<Table loading={loading}>

			</Table>
		</React.Fragment>
	);
};
