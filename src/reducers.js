//combine all the reducers here

import { combineReducers } from 'redux';
import { userRedux } from '#/redux/user.redux';
import { fileRedux } from '#/redux/file.redux';

export default combineReducers({
	user: userRedux,
	file: fileRedux
});
