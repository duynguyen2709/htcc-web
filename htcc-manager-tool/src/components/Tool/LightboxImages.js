import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import * as _ from 'lodash';

class LightboxImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  open = (index) => {
    this.setState({
      photoIndex: index,
      isOpen: true,
    });
  };

  renderListImage = (images) => {
    const list = _.map(images, (img, index) => {
      return (
        <li className="float-left" key={index}>
          <img
            style={{ cursor: 'pointer' }}
            className="img-complaint"
            onClick={() => this.open(index)}
            src={img}
            alt=""
          />
        </li>
      );
    });

    return (
      <ul style={{ listStyle: 'none', padding: 0 }} className="clearfix">
        {list}
      </ul>
    );
  };

  render() {
    const { photoIndex, isOpen } = this.state;
    const { imageSource } = this.props;

    return (
      <React.Fragment>
        {this.renderListImage(imageSource)}
        {isOpen && (
          <Lightbox
            mainSrc={imageSource[photoIndex]}
            nextSrc={
              photoIndex + 1 == imageSource.length
                ? undefined
                : imageSource[photoIndex + 1]
            }
            prevSrc={
              photoIndex - 1 < 0 ? undefined : imageSource[photoIndex - 1]
            }
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (photoIndex + imageSource.length - 1) % imageSource.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % imageSource.length,
              })
            }
          />
        )}
      </React.Fragment>
    );
  }
}

export default LightboxImages;
