import React from 'react';
import { FileUpload } from '#/component/FileUpload/FileUpload.react';
import withAuth from '#/component/HOC/CheckAuth.react';

const Upload = () => {
	return (
		<React.Fragment>
			<div className="center-cpn">
				<FileUpload></FileUpload>
			</div>
		</React.Fragment>
		
	);
};

export default withAuth(Upload);