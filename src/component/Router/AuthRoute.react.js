import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { loadData } from '../../redux/user.redux';
import { connect } from 'react-redux';
import NavBar from '../NavBar/NavBar.react';
import { Route, Switch } from 'react-router-dom';
import { Login } from '../../container/Authen/Login.react';
import { Register } from '../../container/Authen/Register.react';
import { FileUpload } from '../../container/FileContainer/FileUpload.react';

function Home() {
	return <h2 style={{ textAlign: 'center' }}>GoDrive Homepage</h2>;
}

function NoMatch() {
	return <h2>404 Not Found</h2>;
}

const navListRouting = navList => {
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
		} else if (op.text === 'My Files') {
			const sublist = op.subItem;
			sublist.forEach(it => {
				routers.push(
					<Route key={it.text} path={it.path} component={it.component}></Route>
				);
			});
		} else if (op.text === 'usercenter') {
			op.subItem.forEach(it => {
				if (it.text !== 'Sign out') {
					console.log(it.path);
					routers.push(
						<Route
							key={it.text}
							path={it.path}
							component={it.component}
						></Route>
					);
				}
			});
		} else {
			routers.push(
				<Route key={op.text} path={op.path} component={op.component}></Route>
			);
		}
	});

	routers.push(<Route key='home' component={Home}></Route>);
	console.log(routers);
	return routers;
};

@withRouter
@connect(state => state, { loadData })
class AuthRoute extends React.Component {
	constructor(props) {
		super(props);
		console.log('checking if logged');

		/*		const publicList = ['/login', '/register'];
		const pathname = this.props.location.pathname;
		if (publicList.indexOf(pathname) === -1) {
			axios.get('/api/user/info').then(res => {
				if (res.status === 200) {
					if (res.data.code === 0) {
						this.props.loadData(res.data.data);
					} else {
						console.log('going to login');
						this.props.history.push('/login');
					}
				}
			});
        }
        */
	}

	render() {
		const isAuth = this.props.user.isAuth;
		const rightNavbarClass = 'navbar-right';
		const navList = [
			{
				path: '/',
				text: 'GoDrive',
				component: FileUpload,
				className: 'navbar-title',
				hide: false
			},
			{
				path: '/register',
				text: 'Register',
				component: Register,
				className: rightNavbarClass,
				hide: isAuth
			},

			{
				path: '/login',
				text: 'Login',
				component: Login,
				className: rightNavbarClass,
				hide: isAuth
			},
			{
				text: 'usercenter',
				hide: !isAuth,
				className: rightNavbarClass,
				subItem: [
					{
						path: '/edit-profile',
						text: 'Edit Profile'
						//component: EditProfile
					},
					{
						path: '/change-password',
						text: 'Change Password'
					},
					{
						text: 'Sign out'
					}
				]
			}
		];

		console.log(isAuth);
		return (
			<div>
				<NavBar data={navList}></NavBar>
				<Switch>{navListRouting(navList)}</Switch>
			</div>
		);
	}
}

export default AuthRoute;
