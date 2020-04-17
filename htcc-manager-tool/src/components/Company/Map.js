import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAP_API_KEY } from '../../constant/url';
import { companyApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import * as _ from 'lodash';

const MarkerComponent = ({ text }) => (
  <div style={{ color: '#f5222d', fontSize: 15 }}>{text}</div>
);

class CompanyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 2,
    };
  }

  componentDidMount() {
    companyApi
      .getAllOffices()
      .then((res) => {
        if (res.returnCode === 1) {
          const headquarter =
            _.find(res.data, (office) => office.isHeadquarter) || {};
          console.log('headquarter', headquarter);
          this.setState({
            data: res.data,
            center: {
              lat: headquarter.latitude,
              lng: headquarter.longitude,
            },
          });
          this.data = res.data;
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch((err) => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          defaultZoom={this.state.zoom}
          center={this.state.center}
        >
          {_.map(this.state.data, (office, index) => {
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
