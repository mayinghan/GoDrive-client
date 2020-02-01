import React from 'react';
import { Typography } from 'antd';
import { LoginForm } from '../../component/Authen/LoginForm.react';

const { Paragraph } = Typography;

export const Login = () => {
	return (
		<div>
			<Paragraph className='title-middle'>
				<h3>Log in to GoDrive</h3>
			</Paragraph>
			<Paragraph>
				<LoginForm></LoginForm>
			</Paragraph>
		</div>
	);
};
