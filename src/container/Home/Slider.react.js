import React from 'react';
import { Carousel } from 'antd';

const imageFit = {
	display: 'block',
	marginLeft: 'auto',
	marginRight: 'auto',
	width: '100%',
	maxWidth: '100%',
	maxHeight: '80%',
	padding: '0px'
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
						<img style={imageFit} src={require('../../assets/resumable2.jpg')} />
						
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/instant3.jpg')} />					
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/storage2.jpg')} />						
					</div>
				</Carousel>
			</div>
		);
	}
}
