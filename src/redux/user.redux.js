// action
const LOAD_DATA = 'LOAD_DATA';
const AUTH_SUCC = 'AUTH_SUCC';
const LOGOUT = 'LOGOUT';
const ERROR_MSG = 'ERROR_MSG';

const initState = {
	redirectTo: '',
	msg: '',
	username: '',
	isAuth: false
};

//reducer
export function userRedux(state = initState, action) {
	switch (action.type) {
		case LOAD_DATA:
			return { ...state, ...action.payload, isAuth: true };
		case AUTH_SUCC:
			return {
				...state,
				msg: '',
				...action.payload,
				isAuth: true,
				redirectTo: '/'
			};
		case ERROR_MSG:
			return { ...state, isAuth: false, msg: action.msg };
		case LOGOUT:
			return { ...initState };
		default:
			return state;
	}
}
