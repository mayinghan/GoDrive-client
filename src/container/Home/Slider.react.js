import React from 'react';
import { Carousel } from 'antd';

const imageFit = {
	display: 'block',
	marginLeft: 'auto',
	marginRight: 'auto',
	width: '50%',
	maxWidth: '30%',
	maxHeight: '30%',
	padding: '10px'
};


export class HomeSlide extends React.Component {
	render() {
		return (
			<div>
				<div style={{ display: 'inline' }}>
					<p>
						<span style={{ fontSize: '30px' }}>GoDrive</span> ———{' '}
						<span style={{ fontSize: '18px' }}>
							A platform for storage and download files
						</span>
					</p>
				</div>
				<Carousel autoplay>
					<div>
						<img style={imageFit} src={require('../../assets/file.png')} />
						<h6>You could do resumable upload and download your files</h6>
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/upload.png')} />
						<h6>You could do instant upload for your specific files</h6>
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/space.png')} />
						<h6>You could experience with Distributed storge file blocks
							We can support 200GB space</h6>
					</div>
				</Carousel>
			</div>
		);
	}
}
