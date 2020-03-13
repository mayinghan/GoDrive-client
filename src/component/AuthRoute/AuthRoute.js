import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { loadData } from '../../redux/user.redux';
import { connect } from 'react-redux';
import NavBar from '../NavBar/NavBar';
import { Route, Switch } from 'react-router-dom';
import Login from '../Container/Login';

function Home() {
	return <h2>Homepage</h2>;
}

function NoMatch() {
	return <h2>404 Not Found</h2>;
}

const navListRouting = navList => {
	const routers = [];
	navList.forEach(op => {
		if (op.text === 'Home') {
			/*routers.push(
				<Route
					exact
					key={op.text}
					path={op.path}
					component={op.component}
				></Route>
			);*/
			routers.push(<Route key='home' component={Home}></Route>);

		} else if (op.text === 'Volunteer') {
			/*
			const sublist = op.subItem;
			sublist.forEach(it => {
				routers.push(
					<Route key={it.text} path={it.path} component={it.component}></Route>
				);
			});
			*/
		} else if (op.text === 'Login') {
			/*op.subItem.forEach(it => {
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
			});*/
			routers.push(<Route key='Login' component={Login}></Route>);

		} else {
			/*routers.push(
				<Route key={op.text} path={op.path} component={op.component}></Route>
			);*/
			routers.push(<Route key='home' component={Home}></Route>);
		}
	});

	
	console.log(routers);
	return routers;
};

@withRouter
@connect(state => state, { loadData })
class AuthRoute extends React.Component {
	constructor(props) {
		super(props);
		console.log('checking if logged');
	}

	render() {
		const isAuth = this.props.user.isAuth;
		const rightNavbarClass = 'navbar-right';
		const navList = [
			{
				path: '/',
				text: 'Home',
				component: Home,
				className: 'navbar-title',
				hide: false
			},
			{
				path: '/register',
				text: 'Register',
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
						text: 'Edit Profile',
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