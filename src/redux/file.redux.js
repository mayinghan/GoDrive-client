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

// action creator
export function getFileList() {
	return dispatch => {
		return axios.get('/api/user/filelist').then(res => {
			if(res.data.code === 0) {
				// api get successfully
				console.log(res.data.data);
				// const list = res.data.data;
			} else {
				console.log(res.data.msg);
			}     
		}).catch(err => {
			console.error(err.response);
		});
	};
}