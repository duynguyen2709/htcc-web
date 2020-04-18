import React, { Component } from 'react';
import { Tabs } from 'antd';
import {
  BranchesOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import Info from '../components/Company/Info';
import Map from '../components/Company/Map';
import Branch from '../components/Company/Branch';

const { TabPane } = Tabs;

class CompanyInfo extends Component {
  render() {
    return (
      <div className="content">
        <div className="table-wrapper tabs-big">
          <Tabs defaultActiveKey="info">
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
                  <EnvironmentOutlined />
                  Vị trí
                </span>
              }
              key="map"
            >
              <Map />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CompanyInfo;
