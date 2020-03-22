import React, { Component } from 'react';
import { Tabs } from 'antd';
import {
  BranchesOutlined,
  ProfileOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import Info from '../components/Company/Info';

const { TabPane } = Tabs;

class CompanyInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="content">
        <div className="table-wrapper">
          <Tabs defaultActiveKey="info">
            <TabPane
              tab={
                <span>
                  <BranchesOutlined />
                  Chi Nhánh
                </span>
              }
              key="branch"
            >
              Chi Nhánh
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ProfileOutlined />
                  Thông tin Cty
                </span>
              }
              key="info"
            >
              <Info />
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
              Vị trí
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CompanyInfo;
