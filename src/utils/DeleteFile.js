import React from 'react';
import { Modal } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

export const DeleteFile = ({ visible, reqId, changeVsb}) => {
	const onOk = () => {
		console.log('ok');
		changeVsb(false);
	};
	const onCancel = () => {
		changeVsb(false);
	};

	return (
		<div>
			{reqId ? (
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