import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../redux/user.redux';
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

export const LoginForm = () => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const userState = useSelector(s => s.user);

	const onSubmit = v => {
		// handle submit
		dispatch(login(v));
		console.log(v);
	};

	const onFailed = ({ errorFields }) => {
		form.scrollToField(errorFields[0].name);
	};

	return (
		<div>
			{userState.redirectTo ? (
				<Redirect to={userState.redirectTo}></Redirect>
			) : null}
			<Form
				{...layout}
				name='login'
				form={form}
				onFinish={onSubmit}
				onFinishFailed={onFailed}
			>
				<Item
					label='Username/Email'
					name='input'
					rules={[
						{ required: true, message: 'Please input your username or email!' }
					]}
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
		</div>
	);
};
