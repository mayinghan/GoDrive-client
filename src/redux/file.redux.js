import axios from 'axios';
import { message } from 'antd';

// actions
const LOAD_FILE_SUC = 'LOAD_FILE_SUC';
const LOAD_FILE_ERR = 'LOAD_FILE_ERR';
const DELETE_SUC = 'DELETE_SUC';
const DELETE_ERR = 'DELETE_ERR';

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
	case DELETE_SUC:
		return  { ...state, myFiles: state.myFiles.filter(v => v.key !== action.payload) };
	case DELETE_ERR:
		return { ...state };
	default:
		return state;
	}
}

// helper
function updateList(list) {
	return { type: LOAD_FILE_SUC, payload: list };
}

function updateListErr(msg) {
	message.warning(msg);
	return { type: LOAD_FILE_ERR };
}

function deleteSuc(filehash) {
	return { type: DELETE_SUC, payload: filehash };
}

function deleteErr(msg) {
	message.warning(msg);
	return { type: DELETE_ERR };
}

/**
 *  Action creators
 */

// get user's file list
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

// delete target file from user's file list
export function deleteFile(filehash, filename) {
	return dispatch => {
		return axios.delete(`/api/user/file?filehash=${filehash}`).then(res => {
			console.log(res.data);
			if(res.data.code === 0) {
				dispatch(deleteSuc(filehash));
				message.success(`${filename} deleted successfully!`);
			} else {
				dispatch(deleteErr(res.data.msg));
			}
		}).catch(err => {
			console.log(err.response);
		});
	};
}