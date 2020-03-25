import axios from 'axios';
import { message } from 'antd';

// actions
const LOAD_FILE_SUC = 'LOAD_FILE_SUC';
const LOAD_FILE_ERR = 'LOAD_FILE_ERR';

// init state
const initState = {
	myFiles: null
};
// reducer
export function fileRedux(state=initState, action) {
	switch (action.type) {
	case LOAD_FILE_SUC:
		return { ...state, myFiles: action.payload };
	case LOAD_FILE_ERR:
		return { ...state, myFiles: null };
	default:
		return state;
	}
}

// helper
function updateList(list) {
	console.log(list);
	return { type: LOAD_FILE_SUC, payload: list };
}

function updateListErr(msg) {
	message.warning(msg);
	return { type: LOAD_FILE_ERR };
}

// action creator
export function getFileList() {
	return dispatch => {
		return axios.get('/api/user/filelist').then(res => {
			if(res.data.code === 0) {
				// // api get successfully
				dispatch(updateList(res.data.data));
				return;
			} else {
				console.log(res.data.msg);
				dispatch(updateListErr(res.data.msg));
			}     
		}).catch(err => {
			console.error(err.response);
		});
	};
}