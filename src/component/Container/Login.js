import ReactDOM from 'react-dom';
import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';


const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};
const tailLayout = {
	wrapperCol: {
		offset: 8,
		span: 16,
	},
};

class Login extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		const onFinish = values => {
			console.log('Success:', values);
		};

		const onFinishFailed = errorInfo => {
			console.log('Failed:', errorInfo);
		};

		return (
			<React.Fragment>
				{/* {currItem ? ( */}
				<div>
					<Form
						{...layout}
						name="basic"
						initialValues={{
							remember: true,
						}}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
					>
						<Form.Item
							label="Username"
							name="username"
							rules={[
								{
									required: true,
									message: 'Please input your username!',
								},
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[
								{
									required: true,
									message: 'Please input your password!',
								},
							]}
						>
							<Input.Password />
						</Form.Item>

						<Form.Item {...tailLayout} name="remember" valuePropName="checked">
							<Checkbox>Remember me</Checkbox>
						</Form.Item>

						<Form.Item {...tailLayout}>
							<Button type="primary" htmlType="submit">
          Submit
							</Button>
						</Form.Item>
					</Form>
				</div>
				{/* ) : null} */}
			</React.Fragment>
		);
	}

}

export default Login;