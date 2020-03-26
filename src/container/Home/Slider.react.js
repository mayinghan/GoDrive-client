import React from 'react';
import { Carousel } from 'antd';

const imageFit = {
	display: 'block',
	marginLeft: 'auto',
	marginRight: 'auto',
	// width: '100%',
	maxWidth: '100%',
	maxHeight: '50%',
	objectFit: 'cover'
	// padding: '0px'
};


export class HomeSlide extends React.Component {
	render() {
		return (
			<div>
				<div style={{ display: 'inline' }}>
					<p>
						<span style={{ fontSize: '30px' }}>GoDrive</span> ———{' '}
						<span style={{ fontSize: '18px' }}>
							A file storage platform
						</span>
					</p>
				</div>
				<Carousel autoplay>
					<div>
						<img style={imageFit} src={require('../../assets/resumable.jpg')} />
						
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/instant.jpg')} />					
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/storage.jpg')} />						
					</div>
				</Carousel>
			</div>
		);
	}
}
