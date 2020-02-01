import React from 'react';
import { Form, Input, Button } from 'antd';

const { Item } = Form;

const layout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 10 }
	}
};

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 16,
			offset: 8
		}
	}
};

export const LoginForm = () => {
	const [form] = Form.useForm();

	const onSubmit = v => {
		// handle submit
		console.log(v);
	};

	const onFailed = ({ errorFields }) => {
		form.scrollToField(errorFields[0].name);
	};

	return (
		<Form
			{...layout}
			name='login'
			onFinish={onSubmit}
			onFinishFailed={onFailed}
		>
			<Item
				label='Username'
				name='username'
				rules={[{ required: true, message: 'Please input your username!' }]}
			>
				<Input />
			</Item>
			<Item
				label='Password'
				name='password'
				rules={[{ required: true, message: 'Please input your password' }]}
			>
				<Input.Password></Input.Password>
			</Item>
			<Item {...tailFormItemLayout}>
				<Button type='primary' htmlType='submit'>
					Log in
				</Button>
			</Item>
		</Form>
	);
};
