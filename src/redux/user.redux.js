import axios from 'axios';
import { message } from 'antd';
// action
const LOAD_DATA = 'LOAD_DATA';
const AUTH_SUCC = 'AUTH_SUCC';
const LOGOUT = 'LOGOUT';
const NO_USER = 'NO_USER';
const AUTH_ERR = 'AUTH_ERR';
const UPDATE_AUTH = 'UPDATE_AUTH';

// init state
const initState = {
	redirectTo: '',
	msg: '',
	username: ''
};

//reducer
export function userRedux(state = initState, action) {
	switch (action.type) {
	case NO_USER:
		return { ...initState, isAuth: false };
	case LOAD_DATA:
		return { ...state, ...action.payload, isAuth: true, redirectTo: '/' };
	case UPDATE_AUTH:
		return { isAuth: action.isAuth, ...state };
	case AUTH_SUCC:
		return {
			...state,
			msg: '',
			...action.payload,
			isAuth: true,
			redirectTo: '/'
		};
	case AUTH_ERR:
		return { ...state, isAuth: false, msg: action.msg };
	case LOGOUT:
		return { ...initState, isAuth: false };
	default:
		return state;
	}
}

//helper
const authSuccess = obj => {
	const { pwd, ...data } = obj;
	return { type: AUTH_SUCC, payload: data };
};

function errorMsg(msg) {
	message.error(msg);
	return { msg, type: AUTH_ERR };
}

function updateAuth(auth) {
	return { type: UPDATE_AUTH, isAuth: auth };
}

export function loadData(userinfo) {
	return { type: LOAD_DATA, payload: userinfo, redirectTo: '/' };
}

export function noUser() {
	return { type: NO_USER };
}

export function logoutRedux() {
	return { type: LOGOUT };
}

export function checkAuth() {
	return dispatch => {
		return axios
			.get('/api/user/info')
			.then(res => {
				if (res.data.code === 0) {
					dispatch(updateAuth(true));
				} else if (res.data.code === 2) {
					dispatch(updateAuth(false));
					message.warn('Login session expires, please log in again!');
				} else {
					dispatch(updateAuth(false));
					message.warn(res.data.msg);
				}
			})
			.catch(err => {
				console.log(err.response.data);
				message.warn(err.response.data.msg);
			});
	};
}

export function login({ input, password }) {
	// console.log(input, pwd);
	if (!input || !password) {
		return errorMsg('missing fields!');
	}

	return dispatch => {
		return axios
			.post('/api/user/login', { input, password })
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					dispatch(authSuccess(res.data.data));
				} else {
					dispatch(errorMsg(res.data.msg));
					throw new Error('Failed to authenticate this user!');
				}
			})
			.catch(err => {
				console.log(err.response.data);
				message.error(err.response.data.msg);
			});
	};
}

export function register(userInput) {
	console.log(userInput);
	const { email, password, confirm, username } = userInput;
	if (!email || !password || password !== confirm || !username) {
		return errorMsg('missing fields!');
	}

	const registerInfo = { ...userInput, email: email.toLowerCase() };

	return dispatch => {
		axios
			.post('/api/user/signup', registerInfo)
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					console.log(res.data);
					dispatch(authSuccess(res.data.data));
				} else {
					dispatch(errorMsg(res.data.msg));
				}
			})
			.catch(err => {
				console.log(err.response.data);
				message.error(err.response.data.msg);
			});
	};
}
