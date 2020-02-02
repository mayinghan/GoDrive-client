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
    
    const compareToFirstPassword = (rule, value) => {
        if (value && value !== this.current.getFieldValue('pwd')) {
          return Promise.reject('Two passwords that you enter is inconsistent!');
        } else {
          return Promise.resolve();
        }
      };
    
    return (
		<Form
			{...layout}
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
				name='emial'
				rules={[{ required: true, message: 'Please input your E-mail' }]}
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
              label="Confirm Password"
              dependencies={['pwd']}
              rules={[
                {
                  required: true,
                  message: ''
                },
                {
                  validator: compareToFirstPassword
                }
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
