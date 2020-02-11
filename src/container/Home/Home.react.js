import React from "react";
import { Row, Col } from "react-bootstrap";

const imageFit = {
  maxWidth: "100%",
  maxHeight: "100%",
  padding: "30px"
};

/*export const Home = () => {
	return <h2 style={{ textAlign: 'center' }}>GoDrive Homepage</h2>;


};*/

export class Home extends React.Component {
  render() {
    return (
      <div style={{ padding: "0px 0px 50px 0px" }}>
        <div style={{ display: "inline" }}>
          <p>
            <span style={{ fontSize: "30px" }}>GoDrive</span> ———{" "}
            <span style={{ fontSize: "18px" }}>
              Better than Google Drive. A safe place for all your files
            </span>
          </p>
        </div>
        <Row>
          <Col xs={4}>
            <img style={imageFit} src="/src/assets/resumable.jpg" />
            <br />
            <h4>Resumable Upload and Download</h4>
          </Col>
          <Col xs={4}>
            <img style={imageFit} src="/src/assets/instant.png" />
            <br />
            <h4>Instant upload for specific files</h4>
          </Col>
          <Col xs={4}>
            <img style={imageFit} src="/src/assets/space.jpg" />
            <br />
            <h4>Using file blocks distributed stored</h4>
            <h4>Every user 200+G space!</h4>
          </Col>
        </Row>
      </div>
    );
  }
}
