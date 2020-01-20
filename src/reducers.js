//combine all the reducers here

import { combineReducers } from 'redux';
import { userRedux } from './redux/user.redux';

export default combineReducers({
	user: userRedux
});
