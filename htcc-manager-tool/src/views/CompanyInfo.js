import React, {Component} from 'react';
import {Tabs} from 'antd';
import {ApartmentOutlined, BranchesOutlined, EnvironmentOutlined, ProfileOutlined} from '@ant-design/icons';
import Info from '../components/Company/Info';
import Map from '../components/Company/Map';
import Branch from '../components/Company/Branch';
import Department from "../components/Company/Department";

const { TabPane } = Tabs;

class CompanyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updateMap: false,
    };
  }

  changeTab = (key) => {
    this.setState({
      updateMap: key === 'map',
    });
  };

  render() {
    return (
      <div className="content">
        <div className="table-wrapper tabs-big">
          <Tabs defaultActiveKey="info" onChange={(key) => this.changeTab(key)}>
            <TabPane
              tab={
                <span>
                  <ProfileOutlined />
                  Thông tin Công ty
                </span>
              }
              key="info"
            >
              <Info />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <BranchesOutlined />
                  Chi Nhánh
                </span>
              }
              key="branch"
            >
              <Branch />
            </TabPane>
            <TabPane
                tab={
                  <span>
                  <ApartmentOutlined />
                  Phòng ban
                </span>
                }
                key="department"
            >
              <Department />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <EnvironmentOutlined />
                  Vị trí
                </span>
              }
              key="map"
            >
              <Map updateMap={this.state.updateMap} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CompanyInfo;
