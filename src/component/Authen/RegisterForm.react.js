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

export const RegisterForm = () => {
	const [form] = Form.useForm();

	const onSubmit = v => {
		// handle submit
		console.log(v);
	};

	const onFailed = ({ errorFields }) => {
		form.scrollToField(errorFields[0].name);
	};

	const confirmPassword = ({ getFieldValue }) => {
		return {
			validator(rule, value) {
				console.log(getFieldValue('password'));
				if (!value || getFieldValue('password') === value) {
					return Promise.resolve();
				}
				return Promise.reject(
					'The two passwords that you entered do not match!'
				);
			}
		};
	};

	return (
		<Form
			{...layout}
			form={form}
			name='register'
			onFinish={onSubmit}
			onFinishFailed={onFailed}
		>
			<Item
				label='Username'
				name='username'
				rules={[{ required: true, message: 'Please input your username' }]}
			>
				<Input />
			</Item>
			<Item
				label='E-mail'
				name='email'
				rules={[
					{ required: true, message: 'Please input your E-mail' },
					{
						type: 'email',
						message: 'Input format is invalid! Please use an email address'
					}
				]}
			>
				<Input />
			</Item>
			<Item
				label='Password'
				name='password'
				rules={[{ required: true, message: 'Please input your password' }]}
				hasFeedback
			>
				<Input.Password />
			</Item>
			<Item
				name='confirm'
				label='Confirm Password'
				dependencies={['password']}
				rules={[
					{
						required: true,
						message: 'Please confirm your password'
					},
					confirmPassword(form)
				]}
				hasFeedback
			>
				<Input.Password />
			</Item>

			<Item {...tailFormItemLayout}>
				<Button type='primary' htmlType='submit'>
					Register
				</Button>
			</Item>
		</Form>
	);
};
