import React from 'react';
import { message } from 'antd';
import browserCookie from 'browser-cookies';
import axios from 'axios';
import { connect } from 'react-redux';
import { loadData, noUser } from '#/redux/user.redux';
import { withRouter } from 'react-router-dom';

const withAuthCheking = WrappedComponent => {
	@withRouter
	@connect(state=>state, {loadData, noUser})
	class AuthCheking extends React.Component {
		constructor() {
			super();
			axios
				.get('/api/user/info')
				.then(res => {
					if (res.status === 200) {
						if (res.data.code === 0) {
							console.log(res.data.data);
							this.setState({ loading: false });
						} else {
							this.props.noUser();
							if (res.data.code === 2) {
								// token expires
								message.warning(res.data.msg);
								browserCookie.erase('token');
							}
							const publicPath = ['/login', '/register'];
							if (publicPath.indexOf(this.props.location.pathname) === -1) {
								console.log(this.props.history.location);
								console.log('going to login');
								this.props.history.push('/login');
							}

							this.setState({ loading: false });
						}
					} else {
						this.setState({ loading: false });
					}
				})
				.catch(err => {
					console.log(err);
					this.setState({ loading: false });
				});
		}
			
		render() {
			return <WrappedComponent></WrappedComponent>;
		}
	}
	
	return AuthCheking;
};

export default withAuthCheking;