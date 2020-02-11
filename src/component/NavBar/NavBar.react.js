import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Modal } from 'antd';
import browserCookie from 'browser-cookies';
import { logoutRedux } from '../../redux/user.redux';

const { Item } = Menu;

// deep filter an item in a high dimensional array
const deepFilter = (arr, filterFunc) => {
	for (let i = 0; i < arr.length; i++) {
		let element = arr[i];
		if (element.subItem) {
			const item = deepFilter(element.subItem, filterFunc);
			if (item) {
				return item;
			}
		}
	}
	return arr.filter(filterFunc)[0];
};

@withRouter
@connect(state => state, { logoutRedux })
class NavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			location: this.props.location.pathname
		};
	}

	logout = () => {
		console.log('logout');
		this.setState({
			...this.state,
			modalVisible: true
		});
	};

	handleOk = e => {
		this.setState({
			modalVisible: false
		});

		browserCookie.erase('token');
		this.props.history.push('/login');
		this.props.logoutRedux();
	};

	handleCancel = e => {
		this.setState({
			modalVisible: false
		});
	};

	render() {
		let currItem = null;
		if (this.props.location) {
			currItem = deepFilter(
				this.props.data,
				v => v.path === this.props.location.pathname
			);
		}
		const list = this.props.data.filter(v => !v.hide);

		return (
			<React.Fragment>
				{/* {currItem ? ( */}
				<div>
					<Menu
						mode='horizontal'
						selectedKeys={(() => {
							if (currItem) return [currItem.text];
							else {
								return [];
							}
						})()}
					>
						{list.map(choice => {
							if (choice.text !== 'Sign out') {
								return (
									<Item
										key={choice.text}
										className={choice.className}
										onClick={() => this.props.history.push(choice.path)}
									>
										{choice.text}
									</Item>
								);
							} else {
								return (
									<Item
										key={choice.text}
										className={choice.className}
										onClick={this.logout}
									>
										Sign out
									</Item>
								);
							}
						})}
					</Menu>
					<Modal
						title='Log out?'
						visible={this.state.modalVisible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
					>
						Are you sure you want to log out?
					</Modal>
				</div>
				{/* ) : null} */}
			</React.Fragment>
		);
	}
}

export default NavBar;
