import React from 'react';
import { Typography } from 'antd';
import { RegisterForm } from '../../component/Authen/RegisterForm.react';

const { Paragraph } = Typography;

export const Register = () => {
	return (
		<div>
			<Paragraph className='title-middle'>
				<h3>Register to GoDrive</h3>
			</Paragraph>
			<Paragraph>
				<RegisterForm></RegisterForm>
			</Paragraph>
		</div>
	);
};
