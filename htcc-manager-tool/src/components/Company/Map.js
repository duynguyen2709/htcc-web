import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAP_API_KEY } from '../../constant/url';
import { companyApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import * as _ from 'lodash';
import { calculateMaxDistance, calculateZoomRatio } from '../../utils/location';
import ReactLoading from 'react-loading';

const MarkerComponent = ({ text }) => (
  <div className="container-marker">
    <div className="marker"></div>
    <strong className="text">{text}</strong>
  </div>
);

class CompanyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 6,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateMap) {
      this.getData();
    }
  }

  getData = () => {
    companyApi
      .getAllOffices()
      .then((res) => {
        if (res.returnCode === 1) {
          let headquarter =
            _.find(res.data, (office) => office.isHeadquarter) || {};
          if (headquarter == null) {
            headquarter = res.data[0];
          }

          const maxDistance = calculateMaxDistance(res.data);
          const zoom = calculateZoomRatio(maxDistance);

          this.setState({
            data: res.data,
            center: {
              lat: headquarter.latitude,
              lng: headquarter.longitude,
            },
            zoom: zoom,
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch((err) => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { data, zoom, center, isLoading } = this.state;
    if (isLoading) {
      return (
        <ReactLoading
          type={'spinningBubbles'}
          color={'#4caf50'}
          className={'center-div'}
          height={'10%'}
          width={'10%'}
        />
      );
    }

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          defaultZoom={zoom}
          defaultCenter={center}
        >
          {_.map(data, (office, index) => {
            return (
              <MarkerComponent
                key={index}
                lat={office.latitude}
                lng={office.longitude}
                text={office.officeName}
              />
            );
          })}
        </GoogleMapReact>
      </div>
    );
  }
}

export default CompanyMap;
