import React from 'react';
import { Row, Col } from 'antd';

const imageFit = {
	maxWidth: '90%',
	maxHeight: '90%',
	padding: '30px'
};

/*export const Home = () => {
	return <h2 style={{ textAlign: 'center' }}>GoDrive Homepage</h2>;


};*/

export class Home extends React.Component {
	render() {
		return (
			<div style={{ padding: '0px 0px 50px 0px' }}>
				<div style={{ display: 'inline' }}>
					<p>
						<span style={{ fontSize: '30px' }}>GoDrive</span> ———{' '}
						<span style={{ fontSize: '18px' }}>
							A platform for storage and download files
						</span>
					</p>
				</div>
				<Row>
					<Col xs={4}>
						<img style={imageFit} src={require('../../assets/file.png')} />
						<br />
						<h4>Resumable Upload and Download</h4>
					</Col>
					<Col xs={4}>
						<img style={imageFit} src={require('../../assets/upload.png')} />
						<br />
						<h4>Instant upload for specific files</h4>
					</Col>
					<Col xs={4}>
						<img style={imageFit} src={require('../../assets/space.png')} />
						<br />
						<h4>With Distributed storge file blocks</h4>
						<h4>We can support 200GB space</h4>
					</Col>
				</Row>
			</div>
		);
	}
}
