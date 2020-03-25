import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Row, Col } from 'antd';
import { getFileList } from '#/redux/file.redux';

const { Column } = Table;

export const FileList = () => {
	const fontStyle = { fontSize: 16 };
	const gutter = [0, 5];

	// hooks
	const [deleteModal, setDeleteModal] = useState({
		visible: false,
	});
	const [fileList, setFileList] = useState([]);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const fileState = useSelector(s => s.file);

	useEffect(() => {
		dispatch(getFileList());
	}, [dispatch]);
	
	return (
		<React.Fragment>
			<div>List</div>
		</React.Fragment>
	);
};