import React, {Component} from 'react';
import {Button, Card, Col, Empty, Input, Popconfirm, Row, Tooltip, Tree} from 'antd';
import {DeleteOutlined, PlusSquareOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {shiftTemplate, workScheduleApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import ReactLoading from "react-loading";
import {WEEK_DAYS} from "../constant/constant";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AsyncModal from "../components/Modal/AsyncModal";
import FormNewShiftTemplate from "../components/Form/FormNewShiftTemplate";

const {Meta} = Card;
const {Search} = Input;

class ShiftTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: [],
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
        this.setState({
            showModal: !this.state.showModal,
        });

        if (submit) {
            this.getListShiftTemplate();
        }
    };

    componentDidMount() {
        this.getListShiftTemplate();
        this.getOfficeShiftTimeMap();
    }

    getOfficeShiftTimeMap = () => {
        workScheduleApi
            .getOfficeShiftTimeMap()
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        officeShiftTimeMap: res.data,
                    });
                } else {
                    console.error(res.returnMessage);
                    this.setState({
                        officeShiftTimeMap: {},
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    officeShiftTimeMap: {},
                });
            })
    };

    getListShiftTemplate = () => {
        this.setState({
            data: [],
        });
        this.data = [];

        this.toggleLoading();

        shiftTemplate
            .getShiftTemplate()
            .then((res) => {
                if (res.returnCode === 1) {
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
            JSON.stringify(ele).toLowerCase().includes(e.target.value.toLowerCase())
        );

        this.setState({
            data: data,
        });
    };

    handleDeleteShiftTemplate = (templateId) => {
        this.toggleLoading();

        shiftTemplate
            .deleteShiftTemplate(templateId)
            .then((res) => {
                if (res.returnCode === 1) {
                    store.addNotification(
                        createNotify('default', res.returnMessage)
                    );

                    const data = _.filter(this.data, (ele) => !_.isEqual(ele.templateId, templateId));

                    this.setState({
                        data: data
                    });
                    this.data = data;
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                );
            })
            .finally(() => {
                this.toggleLoading();
            });
    };

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

    renderButtonDelete = (templateId) => {
        const message = `Bạn có chắc chắn xóa ?`;
        return (<>
            <Popconfirm
                title={message}
                icon={<QuestionCircleOutlined/>}
                okText="Đồng ý"
                cancelText="Huỷ"
                onConfirm={(event) => {
                    event.stopPropagation();
                    this.handleDeleteShiftTemplate(templateId);
                }}
            >
                <Button type="primary" danger
                        icon={<DeleteOutlined/>}
                        onClick={(event) => event.stopPropagation()}
                />
            </Popconfirm>
        </>)
    };

    render() {
        const {
            data,
            showModal,
            isLoading,
        } = this.state;

        if (isLoading) {
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
            centerMode: false,
            infinite: false,
            focusOnSelect: true,
            speed: 500,
            slidesToShow: length,
            slidesToScroll: 1
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
                    {_.isEmpty(data) ?
                        <Empty style={{marginTop: '50px'}}
                               description={
                                   <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>Không có ca mẫu</span>
                               }
                        />
                        :
                        <div style={{padding: '50px', overflow: 'auto', height: 'calc(100vh - 150px)'}}>
                            <Slider {...settings}>
                                {_.map(data, (item, index) => {
                                    const treeData = this.buildTreeData(item.shiftTimeMap);
                                    return (
                                        <Card title={
                                            <>
                                                <h3>{item.templateName}</h3>
                                                <span
                                                    style={{color: 'rgba(0, 0, 0, 0.8)'}}>Người tạo : {item.actor}</span>
                                            </>
                                        }
                                              className={"card-shift-template"}
                                              headStyle={{background: '#efefef', borderRadius: '10px'}}
                                              hoverable
                                              key={item.templateId}
                                              extra={this.renderButtonDelete(item.templateId)}
                                        >
                                            <Tree
                                                blockNode
                                                selectable={false}
                                                checkable={false}
                                                defaultExpandAll
                                                treeData={treeData}/>
                                        </Card>
                                    )
                                })}
                            </Slider>
                        </div>}
                </div>
                <AsyncModal
                    width={"50%"}
                    key={"shift-template-modal"}
                    reload={false}
                    CompomentContent={FormNewShiftTemplate}
                    visible={showModal}
                    toggle={(submit) => this.toggle(submit)}
                    title={'Thêm ca mẫu mới'}
                    data={{
                        officeShiftTimeMap: this.state.officeShiftTimeMap
                    }}
                />
            </div>
        );
    }
}

export default ShiftTemplate;
