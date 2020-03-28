import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
import { deleteFile } from '#/redux/file.redux';

export const DeleteFile = ({ visible, hash, filename, changeVsb}) => {
	const dispatch = useDispatch();
	const onOk = () => {
		console.log('ok');
		dispatch(deleteFile(hash, filename)).then(() => {
			console.log('deleted');
		});
		changeVsb(false);

	};
	const onCancel = () => {
		changeVsb(false);
	};

	return (
		<div>
			{hash ? (
				<Modal
					visible={visible}
					title='Deleting Files'
					onOk={onOk}
					onCancel={onCancel}
				>
					<p><WarningTwoTone /> Are you sure you want to delete this file?</p>
				</Modal>
			) : null}
		</div>
	);
};