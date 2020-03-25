import React from 'react';
import { FileList } from '#/component/FileUpload/FileList.react';
import withAuth from '#/component/HOC/CheckAuth.react';

const List = () => {
	return <FileList></FileList>;
};


export default withAuth(List);