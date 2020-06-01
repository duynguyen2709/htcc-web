import React, {Component} from 'react';
import {Card, Carousel, Col, Collapse, Input, Row, Tooltip, Tree} from 'antd';
import {PlusSquareOutlined,} from '@ant-design/icons';
import {shiftTemplate} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import ReactLoading from "react-loading";
import {WEEK_DAYS} from "../constant/constant";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const {Search} = Input;
const {Panel} = Collapse;

class ShiftTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: null,
            showModal: false,
        };
        this.data = [];
    }

    toggleLoading = () => {
        this.setState({
            isLoading: !this.state.isLoading,
        });
    };

    toggle = (submit = false) => {
        const {data} = this.state;
        this.setState({
            showModal: !this.state.showModal,
            data: submit ? null : data,
        });

        if (submit) {
            this.getListShiftTemplate();
        }
    };

    componentDidMount() {
        this.getListShiftTemplate();
    }

    getListShiftTemplate = () => {
        this.setState({
            data: null,
        });
        this.data = null;

        this.toggleLoading();

        shiftTemplate
            .getShiftTemplate()
            .then((res) => {
                if (res.returnCode === 1) {
                    console.log(res.data);
                    this.setState({
                        data: res.data,
                    });
                    this.data = res.data;
                } else {
                    this.setState({
                        data: [],
                    });
                    this.data = [];

                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    data: [],
                });
                this.data = [];

                store.addNotification(
                    createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                );
            })
            .finally(() => {
                this.toggleLoading();
            });
    };

    onSearch = (e) => {
        const data = _.filter(this.data, (ele) =>
            JSON.stringify(ele).includes(e.target.value)
        );

        this.setState({
            data: data,
        });
    };

    // handleDeleteShiftTemplate = (record) => {
    //     const { officeId } = this.state;
    //
    //     if (!officeId || officeId === '') {
    //         return;
    //     }
    //
    //     this.toggleLoading();
    //
    //     workScheduleApi
    //         .deleteShiftTime(officeId, record.shiftId)
    //         .then((res) => {
    //             if (res.returnCode === 1) {
    //                 this.getListShiftTime(officeId);
    //
    //                 store.addNotification(
    //                     createNotify('default', 'Xoá thành công !')
    //                 );
    //             } else {
    //                 store.addNotification(
    //                     createNotify('danger', res.returnMessage)
    //                 );
    //             }
    //         })
    //         .catch((err) => {
    //             store.addNotification(
    //                 createNotify('danger', JSON.stringify(err))
    //             );
    //         })
    //         .finally(() => {
    //             this.toggleLoading();
    //         });
    // };

    buildTreeData = (fixedShiftMap) => {

        const fixedShiftList = [];

        _.forOwn(fixedShiftMap, (value, key) => {
            const parentNode = {
                title: WEEK_DAYS[key],
                key: `weekDay_${key}`,
                children: [],
            };

            if (value.length === 0) {
                const leafNode = {
                    title: <span style={{color: '#d9534f'}}>Không có ca làm việc</span>,
                    key: `leaf_${key}_0`,
                    isLeaf: true,
                    checkable: false,
                    selectable: false,
                };

                parentNode.children.push(leafNode);
            }

            _.forEach(value, (shift, index) => {
                const leafNode = {
                    title: `- Chi nhánh: ${shift.officeId} - Ca: ${shift.shiftName} (${shift.shiftId}) - Giờ: ${shift.shiftTime}`,
                    key: `leaf_${key}_${index}`,
                    isLeaf: true,
                    checkable: false,
                    selectable: false,
                };

                parentNode.children.push(leafNode);
            });


            fixedShiftList.push(parentNode);
        });

        return fixedShiftList;
    };

    render() {
        const {
            data,
            showModal,
            isLoading,
        } = this.state;

        if (isLoading || _.isEmpty(data)) {
            return <ReactLoading
                type={'spinningBubbles'}
                color={'#4caf50'}
                className={"center-div"}
                height={'10%'}
                width={'10%'}/>
        }

        const length = data.length >= 3 ? 3 : data.length;

        const settings = {
            dots: true,
            centerMode: true,
            focusOnSelect: true,
            speed: 500,
            slidesToShow: length,
            slidesToScroll: 1,
            className: 'test-class'
        };

        return (
            <div className="content">
                <div className="table-wrapper tabs-small">
                    <div className="header-table clearfix">
                        <Row justify="space-between">
                            <Col span={8}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Search
                                        className="form-control bor-radius"
                                        placeholder="Tìm kiếm nhanh"
                                        style={{
                                            width: '300',
                                            marginRight: '20px',
                                        }}
                                        onChange={this.onSearch}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div
                                    className="btn-new"
                                    style={{
                                        margin: 'auto',
                                        marginLeft: '30px',
                                        marginRight: '20px',
                                    }}
                                >
                                    <Tooltip
                                        placement="bottomLeft"
                                        title={'Thêm ca'}
                                    >
                                        <PlusSquareOutlined
                                            onClick={() =>
                                                this.toggle(false)
                                            }
                                        />
                                    </Tooltip>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div style={{padding: '50px'}}>
                    <Slider {...settings}>
                        {_.map(data, (item, index) => {
                            const treeData = this.buildTreeData(item.shiftTimeMap);
                            return <>
                                <Card title={item.templateName}
                                      className={"card-shift-template"}
                                      headStyle={{background: '#efefef', borderRadius: '10px'}}
                                      hoverable
                                >
                                    <Tree
                                        blockNode
                                        selectable={false}
                                        checkable={false}
                                        defaultExpandAll
                                        treeData={treeData}/>
                                </Card>
                            </>
                        })}
                    </Slider>
                    </div>
                    </div>
                    {/*<div>*/}
                    {/*    <AsyncModal*/}
                    {/*        key={{}}*/}
                    {/*        reload={false}*/}
                    {/*        CompomentContent={{}}*/}
                    {/*        visible={showModal}*/}
                    {/*        toggle={(submit) => this.toggle(submit)}*/}
                    {/*        title={'Thêm ca mẫu mới'}*/}
                    {/*        data={{}}*/}
                    {/*    />*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default ShiftTemplate;
