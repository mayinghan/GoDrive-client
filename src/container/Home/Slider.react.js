import React from 'react';
import Slider from 'react-slick';
import { Col } from 'antd';


const imageFit = {
	maxWidth: '60%',
	maxHeight: '60%',
	padding: '60px'
};


export class HomeSlide extends React.Component {
	render() {
		var settings = {
			dots:true,
			infinite:true,
			speed:500,
			slidesToShow:1,
			slidesToScroll:1
		};
		return (
			<div className="container">
				<div style={{ display: 'inline' }}>
					<p>
						<span style={{ fontSize: '30px' }}>GoDrive</span> ———{' '}
						<span style={{ fontSize: '18px' }}>
							A platform for storage and download files
						</span>
					</p>
				</div>
				<Slider {...settings}>
					<div>
						<img style={imageFit} src={require('../../assets/file.png')} />
						<br />
						<h5>You could do resumable upload and download your files</h5>
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/upload.png')} />
						<br />
						<h4>You could do instant upload for your specific files</h4>
					</div>
					<div>
						<img style={imageFit} src={require('../../assets/space.png')} />
						<br />
						<h4>You could experience with Distributed storge file blocks</h4>
						<h4>We can support 200GB space</h4>
					</div>
				</Slider>
			</div>
		);
	}
}
