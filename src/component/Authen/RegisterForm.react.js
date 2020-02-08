import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Tooltip } from 'antd';
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
	const [validEmail, setValidEmail] = useState(false);

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
				if (!value || getFieldValue('password') === value) {
					return Promise.resolve();
				}
				return Promise.reject(
					'The two passwords that you entered do not match!'
				);
			}
		};
	};

	const emailValidator = (rule, value) => {
		if (!value || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/.test(value)) {
			return Promise.resolve();
		}
		return Promise.reject('Please enter a valid email address!');
	};

	const sendEmail = () => {
		const email = form.getFieldValue('email');
		console.log(email);
	};

	const handleEmailInput = e => {
		const email = e.target.value;
		if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/.test(email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
		}
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
					{ validator: emailValidator }
				]}
			>
				<Input onChange={e => handleEmailInput(e)} />
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
			<Item label='Code' rules={[{ required: true }]}>
				<Row gutter={8}>
					<Col span={16}>
						<Item
							name='code'
							noStyle
							rules={[
								{
									required: true,
									message: 'Please input the email verification code you got!'
								}
							]}
						>
							<Input />
						</Item>
					</Col>
					<Col span={6}>
						<Tooltip
							visible={!validEmail}
							title='Enter a valid email address and get a verification code'
						>
							<Button disabled={!validEmail} onClick={sendEmail}>
								Get Code
							</Button>
						</Tooltip>
					</Col>
				</Row>
			</Item>
			<Item {...tailFormItemLayout}>
				<Button type='primary' htmlType='submit'>
					Register
				</Button>
			</Item>
		</Form>
	);
};
