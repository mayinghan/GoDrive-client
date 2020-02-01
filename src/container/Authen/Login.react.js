import { Form, Input, Button } from 'antd';

const layout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrappedCol: {
		xs: { span: 24 },
		sm: { span: 16 }
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

const LoginForm = () => {
	const [form] = Form.useForm();

	const onSubmit = v => {
		// handle submit
		console.log(v);
	};

	const onFailed = ({ errorFields }) => {
		form.scrollToField(errorFields[0].name);
	};
};
