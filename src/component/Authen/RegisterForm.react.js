import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Row, Col, Tooltip, message } from 'antd';
import Axios from 'axios';
import { register } from '../../redux/user.redux';
import { Redirect } from 'react-router-dom';

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

const EMAIL_COOL_DOWN = 100;

export const RegisterForm = () => {
	const [form] = Form.useForm();
	const [validEmail, setValidEmail] = useState(false);
	const [buttonLoading, setButtonLoading] = useState({
		loading: false,
		time: EMAIL_COOL_DOWN
	});

	useEffect(() => {
		let interval;
		// start counting down
		if (buttonLoading.loading) {
			interval = setInterval(() => {
				setButtonLoading(pre => {
					if (pre.time <= 0) {
						clearInterval(interval);
						return { loading: false, time: EMAIL_COOL_DOWN };
					} else {
						return { ...buttonLoading, time: pre.time - 1 };
					}
				});
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [buttonLoading, buttonLoading.loading]);

	// 注册redux state
	const userState = useSelector(state => state.user);
	// 注册 dispatch行为
	const dispatch = useDispatch();

	const onSubmit = v => {
		// handle submit
		dispatch(register(v));
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
		const email = form.getFieldValue('email').toLowerCase();
		// start button count donw 90s
		setButtonLoading({ ...buttonLoading, loading: true });
		Axios.get(`/api/user/verify?email=${email}`)
			.then(res => {
				if (res.status === 200) {
					console.log('send code successfully');
					message.success('Sent code successfully, please check your email!');
				}
			})
			.catch(err => {
				message.error(err.response.data.msg);
				setButtonLoading({ ...buttonLoading, loading: false });
			});
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
		<div>
			{userState.redirectTo ? (
				<Redirect to={userState.redirectTo}></Redirect>
			) : null}
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
							{validEmail ? (
								<Tooltip title='Click to get the verification code in your email'>
									<Button
										disabled={!validEmail || buttonLoading.loading}
										onClick={sendEmail}
									>
										{buttonLoading.loading
											? buttonLoading.time + 's'
											: 'Get Code'}
									</Button>
								</Tooltip>
							) : (
								<Tooltip title='Enter a valid email address and get a verification code'>
									<Button disabled={!validEmail} onClick={sendEmail}>
										Get Code
									</Button>
								</Tooltip>
							)}
						</Col>
					</Row>
				</Item>
				<Item {...tailFormItemLayout}>
					<Button type='primary' htmlType='submit'>
						Register
					</Button>
				</Item>
			</Form>
		</div>
	);
};
