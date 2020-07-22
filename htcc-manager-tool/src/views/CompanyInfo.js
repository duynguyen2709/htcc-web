import React, {Component} from 'react';
import {Tabs} from 'antd';
import {ApartmentOutlined, BranchesOutlined, EnvironmentOutlined, ProfileOutlined} from '@ant-design/icons';
import Info from '../components/Company/Info';
import Map from '../components/Company/Map';
import Branch from '../components/Company/Branch';
import Department from "../components/Company/Department";
import {connect} from 'react-redux';
import {canDoAction} from "../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../constant/constant";

const {TabPane} = Tabs;

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
        const canViewCompany = canDoAction(this.props.data, ROLE_GROUP_KEY.COMPANY, ACTION.READ);
        const canViewOffice = canDoAction(this.props.data, ROLE_GROUP_KEY.OFFICE, ACTION.READ);
        const canViewDepartment = canDoAction(this.props.data, ROLE_GROUP_KEY.DEPARTMENT, ACTION.READ);
        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    <Tabs defaultActiveKey="info" onChange={(key) => this.changeTab(key)}>
                        {canViewCompany ?
                            <TabPane
                                style={{overflow: 'auto'}}
                                tab={
                                    <span>
                                  <ProfileOutlined/>
                                  Thông tin Công ty
                                </span>
                                }
                                key="info"
                            >
                                <Info/>
                            </TabPane> : null}
                        {canViewOffice ?
                            <TabPane
                                style={{overflow: 'auto'}}
                                tab={
                                    <span>
                                  <BranchesOutlined/>
                                  Chi Nhánh
                                </span>
                                }
                                key="branch"
                            >
                                <Branch/>
                            </TabPane> : null}
                        {canViewDepartment ?
                            <TabPane
                                style={{overflow: 'auto'}}
                                tab={
                                    <span>
                                    <ApartmentOutlined/>
                                  Phòng ban
                                </span>
                                }
                                key="department"
                            >
                                <Department/>
                            </TabPane> : null}
                        {canViewOffice ?
                            <TabPane
                                style={{overflow: 'auto'}}
                                tab={
                                    <span>
                                  <EnvironmentOutlined/>
                                  Vị trí
                                </span>
                                }
                                key="map"
                            >
                                <Map updateMap={this.state.updateMap}/>
                            </TabPane> : null}
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(CompanyInfo);
