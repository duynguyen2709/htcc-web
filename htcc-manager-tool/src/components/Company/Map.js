import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import {GOOGLE_MAP_API_KEY} from '../../constant/url';
import {companyApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import * as _ from 'lodash';
import {calculateMaxDistance, calculateZoomRatio} from '../../utils/location';
import ReactLoading from 'react-loading';
import {Button, Col, Row, Table} from "antd";
import {SettingOutlined,} from '@ant-design/icons';

const MarkerComponent = ({text}) => (
    <div className="container-marker">
        <div className="marker"/>
        <strong className="text">{text}</strong>
    </div>
);

class CompanyMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: [],
            defaultCenter: {
                lat: 0,
                lng: 0,
            },
            center: {
                lat: 0,
                lng: 0,
            },
            defaultZoom: 6,
            zoom: 6
        };

        this.columns = [
            {
                title: 'Chi nhánh',
                render: (text, record, index) => {
                    return `${record.officeId} - ${record.officeName}`
                }
            },
            {
                title: 'Tọa độ',
                render: (text, record, index) => {
                    return `(${record.longitude}, ${record.latitude})`
                }
            }
        ];

        this.resetDefaultView = this.resetDefaultView.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.updateMap) {
            this.getData();
        }
    }

    toggleLoading() {
        this.setState({
            isLoading: !this.state.isLoading
        })
    }

    getData = () => {
        this.toggleLoading();

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
                        defaultZoom: zoom,
                        defaultCenter: {
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
                this.toggleLoading();
            });
    };


    resetDefaultView() {
        this.setState({
            zoom: this.state.defaultZoom,
            center: this.state.defaultCenter,
        })
    }

    render() {
        const {data, zoom, center, isLoading} = this.state;
        if (isLoading) {
            return (
                <ReactLoading
                    type={'spinningBubbles'}
                    color={'#4caf50'}
                    className={"center-div"}
                    height={'10%'}
                    width={'10%'}
                />
            );
        }

        return (
            <Row>
                <Col span={16}>
                    <div style={{height: 'calc(100vh - 195px)', width: '100%', overflow: 'hidden'}}>
                        <GoogleMapReact
                            bootstrapURLKeys={{key: GOOGLE_MAP_API_KEY}}
                            defaultZoom={6}
                            zoom={zoom}
                            defaultCenter={{
                                lat: 0,
                                lng: 0,
                            }}
                            center={center}
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
                </Col>
                <Col offset={1} span={7}>
                    <Button
                        style={{marginBottom: '10px'}}
                        type="primary"
                        onClick={this.resetDefaultView}
                    >
                        <SettingOutlined
                            style={{
                                display: 'inline',
                                margin: '5px 10px 0 0',
                            }}
                        />
                        <span className="btn-save-text">
                            Đặt lại tọa độ bản đồ
                        </span>
                    </Button>
                    <Table
                        columns={this.columns}
                        rowKey="officeId"
                        dataSource={data}
                        loading={data === null}
                        pagination={{
                            hideOnSinglePage: true,
                            pageSize: 6,
                        }}
                        bordered={true}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                    this.setState({
                                        zoom: 15,
                                        center: {
                                            lat: record.latitude,
                                            lng: record.longitude
                                        }
                                    })
                                }
                            };
                        }}
                    />
                </Col>
            </Row>
        );
    }
}

export default CompanyMap;
