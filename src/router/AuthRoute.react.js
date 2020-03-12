import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { loadData, noUser } from '../redux/user.redux';
import { connect } from 'react-redux';
import NavBar from '../component/NavBar/NavBar.react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.react';
import browserCookie from 'browser-cookies';
import { Login } from '../container/Authen/Login.react';
import { Register } from '../container/Authen/Register.react';
import { FileUpload } from '../container/FileContainer/FileUpload.react';
import { Home } from '../container/Home/Home.react';
import { message } from 'antd';

function NoMatch() {
	return <h2>404 Not Found</h2>;
}

const navListRouting = (navList, isAuth) => {
	const routers = [];
	navList.forEach(op => {
		if (op.text === 'GoDrive') {
			routers.push(
				<Route
					exact
					key={op.text}
					path={op.path}
					component={op.component}
				></Route>
			);
		} else if (op.text !== 'Sign out') {
			if (op.auth) {
				routers.push(
					<PrivateRoute
						key={op.text}
						path={op.path}
						component={op.component}
						isAuth={isAuth}
					></PrivateRoute>
				);
			} else {
				routers.push(
					<Route key={op.text} path={op.path} component={op.component}></Route>
				);
			}
		}
	});

	routers.push(<Route key='404' component={NoMatch}></Route>);
	return routers;
};

@withRouter
@connect(state => state, { loadData, noUser })
class AuthRoute extends React.Component {
	constructor(props) {
		super(props);
		console.log('checking if logged');

		this.state = {
			loading: true
		};

		axios
			.get('/api/user/info')
			.then(res => {
				if (res.status === 200) {
					if (res.data.code === 0) {
						console.log(res.data.data);
						this.props.loadData(res.data.data);
						this.setState({ loading: false });
					} else {
						this.props.noUser();
						if (res.data.code === 2) {
							// token expires
							message.warning(res.data.msg);
							browserCookie.erase('token');
						}
						const publicPath = ['/', '/login', '/register'];
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
		const isAuth = this.props.user.isAuth;
		const rightNavbarClass = 'navbar-right';
		const leftNavbarClass = 'navbar-left';
		// console.log(this.state.loading);
		const navList = [
			{
				path: '/',
				text: 'GoDrive',
				component: Home,
				className: 'navbar-title',
				auth: false,
				hide: false
			},
			{
				path: '/upload',
				text: 'Upload',
				component: FileUpload,
				auth: true,
				hide: !isAuth || this.state.loading
			},
			{
				path: '/register',
				text: 'Register',
				component: Register,
				className: rightNavbarClass,
				auth: false,
				hide: isAuth || this.state.loading
			},

			{
				path: '/login',
				text: 'Login',
				component: Login,
				className: rightNavbarClass,
				auth: false,
				hide: isAuth || this.state.loading
			},
			{
				path: '/list',
				text: 'List',
				//component: List,
				className: leftNavbarClass,
				auth: true,
				hide: !isAuth || this.state.loading
			},
			{
				text: 'Sign out',
				hide: !isAuth || this.state.loading,
				auth: true,
				className: rightNavbarClass
			}
		];

		return (
			<div>
				<NavBar data={navList}></NavBar>
				<Switch>{navListRouting(navList, isAuth)}</Switch>
			</div>
		);
	}
}

export default AuthRoute;
