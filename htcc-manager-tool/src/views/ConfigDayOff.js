import React, {Component} from 'react';
import {Popconfirm, Select, Table, Tooltip} from 'antd';
import {Button, CardFooter, Col, Form, FormGroup, Input, Row,} from 'reactstrap';
import {CheckCircleOutlined, PlusSquareOutlined, QuestionCircleOutlined,} from '@ant-design/icons';
import {configDayOffApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {buildColsCategoryDayOff, buildColsDayOffLevel,} from '../constant/colTable';
import {removeItem, updateItem} from '../utils/config';
import ReactLoading from 'react-loading';
import AsyncModal from '../components/Modal/AsyncModal';
import FormNewCategory from '../components/Form/FormNewCategory';
import FormNewLevel from '../components/Form/FormNewLevel';
import FormEditCategory from '../components/Form/FormEditCategory';
import FormEditLevel from '../components/Form/FormEditLevel';
import {canDoAction} from "../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../constant/constant";

const {Option} = Select;
const COMPONENT = {
    FormNewCategory: FormNewCategory,
    FormNewLevel: FormNewLevel,
    FormEditCategory: FormEditCategory,
    FormEditLevel: FormEditLevel,
};
const TITLE = {
    FormNewCategory: 'Thêm danh mục',
    FormNewLevel: 'Thêm cấp bậc',
    FormEditCategory: 'Chỉnh sửa thông tin danh mục',
    FormEditLevel: 'Chỉnh sửa thông tin cấp bậc',
};

class ConfigDayOff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                allowCancelRequest: true,
                categoryList: null,
                dayOffByLevel: null,
                maxDayAllowCancel: '',
            },
            loadCategory: false,
            loadDayoff: false,
            form: '',
            showModal: false,
            dataModal: null,
            mode: null,
        };
    }

    componentDidMount() {
        this.getConfig();
    }

    getConfig = () => {
        this.setState({loadCategory: true, loadDayoff: true});
        configDayOffApi
            .getConfig()
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        value: {
                            categoryList: res.data.categoryList,
                            dayOffByLevel: res.data.dayOffByLevel,
                            maxDayAllowCancel: res.data.maxDayAllowCancel,
                            allowCancelRequest: res.data.allowCancelRequest,
                        },
                        loadCategory: false,
                        loadDayoff: false,
                    });
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    handleDeleteCategory = (record) => {
        this.setState({
            loadCategory: true,
        });

        const {value} = this.state;
        const result = removeItem(
            value.categoryList,
            'category',
            record.category
        );

        setTimeout(() => {
            this.setState({
                value: {
                    ...value,
                    categoryList: result,
                },
                loadCategory: false,
            });
        }, 200);
    };

    handleEditCategory = (record) => {
        this.setState({
            form: 'FormEditCategory',
            showModal: true,
            mode: 'edit',
            dataModal: record,
        });
    };

    handleDeleteDayOffLevel = (record) => {
        this.setState({
            loadDayoff: true,
        });

        const {value} = this.state;
        const result = removeItem(value.dayOffByLevel, 'level', record.level);

        setTimeout(() => {
            this.setState({
                value: {
                    ...value,
                    dayOffByLevel: result,
                },
                loadDayoff: false,
            });
        }, 200);
    };

    handleEditDayOffLevel = (record) => {
        this.setState({
            form: 'FormEditLevel',
            showModal: true,
            mode: 'edit',
            dataModal: record,
        });
    };

    mapData = (data, key) => {
        return _.map(data, (item) => ({
            key: item[key].toString(),
            ...item,
        }));
    };

    handleSubmit = () => {
        const {value} = this.state;

        this.setState({
            loadDayoff: true,
            loadCategory: true,
        });

        configDayOffApi
            .updateConfig(value)
            .then((res) => {
                this.setState({
                    loadDayoff: false,
                    loadCategory: false,
                });

                if (res.returnCode === 1) {
                    this.getConfig();

                    store.addNotification(
                        createNotify('default', 'Cập nhật thành công')
                    );
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                this.setState({
                    loadDayoff: false,
                    loadCategory: false,
                });
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    changeAllowCancelRequests = (val) => {
        const {value} = this.state;
        this.setState({
            value: {
                ...value,
                allowCancelRequest: val
            },
        });
    };

    changeMaxDay = (e) => {
        this.setState({
            value: {
                ...this.state.value,
                maxDayAllowCancel: e.target.value
            },
        });
    };

    showForm = (name, mode) => {
        this.setState({
            form: name,
            showModal: true,
            mode,
        });
    };

    toggle = (submit, newData = {}) => {
        const {mode, value, form} = this.state;
        const [name, key, loading] = _.isEqual(
            form,
            `Form${_.upperFirst(mode)}Category`
        )
            ? ['categoryList', 'category', 'loadCategory']
            : ['dayOffByLevel', 'level', 'loadDayoff'];

        if (submit) {
            this.setState({
                [loading]: true,
            });

            if (mode === 'new') {
                value[name].push(newData);
            } else {
                value[name] = updateItem(value[name], key, newData);
            }

            setTimeout(() => {
                this.setState({
                    value: {
                        ...value,
                    },
                    [loading]: false,
                });
            }, 200);
        }

        this.setState({
            showModal: false,
        });
    };

    getListDataTable = () => {
        const {form, value} = this.state;

        switch (form) {
            case 'FormNewCategory':
                return value.categoryList;
            case 'FormNewLevel':
                return value.dayOffByLevel;
            default:
                return [];
        }
    };

    render() {
        const {
            value,
            loadCategory,
            loadDayoff,
            form,
            showModal,
            dataModal,
        } = this.state;

        if (loadDayoff && loadCategory) {
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

        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.DAY_OFF, ACTION.UPDATE);

        return (
            <div className="content">
                <div className="table-wrapper tabs-small">
                    <Form>
                        <Row>
                            <Col sm={{size: 5, offset: 2}}>
                                <FormGroup>
                                    <h5 className="text-dark">
                                        Cho phép huỷ đơn ?
                                    </h5>
                                    <Select
                                        style={{width: '100%'}}
                                        className="bor-radius"
                                        value={value.allowCancelRequest}
                                        onChange={(val) =>
                                            this.changeAllowCancelRequests(val)
                                        }
                                        onCancel={() => this.clear()}
                                        disabled={!canUpdate}
                                    >
                                        <Option
                                            className=" bor-radius"
                                            value={true}
                                        >
                                            Cho phép huỷ
                                        </Option>
                                        <Option
                                            className=" bor-radius"
                                            value={false}
                                        >
                                            Không được huỷ
                                        </Option>
                                    </Select>
                                </FormGroup>
                            </Col>
                            {value.allowCancelRequest ?
                                <Col sm="3">
                                    <FormGroup>
                                        <h5 className="text-dark">
                                            Số ngày được huỷ trước khi duyệt
                                        </h5>
                                        <Input
                                            onChange={this.changeMaxDay}
                                            value={value.maxDayAllowCancel}
                                            placeholder="Nhập số ngày tối đa"
                                            type="number"
                                            className="bor-gray text-dark"
                                            name="maxDayAllowCancel"
                                            disabled={!canUpdate}
                                        />
                                    </FormGroup>
                                </Col> : null}
                        </Row>
                        <Row>
                            <Col sm="7">
                                <div className="header-table clearfix">
                                    <div className="float-left">
                                        <h5 className="text-dark">
                                            Danh mục nghỉ phép
                                        </h5>
                                    </div>
                                    {canUpdate ?
                                        <div className="float-right btn-new-small">
                                            <Tooltip
                                                placement="left"
                                                title={'Thêm danh mục'}
                                            >
                                                <PlusSquareOutlined
                                                    onClick={() =>
                                                        this.showForm(
                                                            'FormNewCategory',
                                                            'new'
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        </div> : null}
                                </div>
                                <div className="table-config">
                                    <Table
                                        bordered
                                        columns={buildColsCategoryDayOff(
                                            this.handleEditCategory,
                                            this.handleDeleteCategory,
                                            canUpdate
                                        )}
                                        dataSource={this.mapData(
                                            value.categoryList,
                                            'category'
                                        )}
                                        scroll={{
                                            y: 'calc(100vh - 450px)',
                                        }}
                                        loading={
                                            loadCategory ||
                                            value.categoryList === null
                                        }
                                        pagination={false}
                                    />
                                </div>
                            </Col>
                            <Col sm="5">
                                <div className="header-table clearfix">
                                    <div className="float-left">
                                        <h5 className="text-dark">
                                            Số ngày nghỉ theo cấp bậc
                                        </h5>
                                    </div>
                                    {canUpdate ?
                                        <div className="float-right btn-new-small">
                                            <Tooltip
                                                placement="left"
                                                title={'Thêm cấp bậc'}
                                            >
                                                <PlusSquareOutlined
                                                    onClick={() =>
                                                        this.showForm(
                                                            'FormNewLevel',
                                                            'new'
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        </div> : null}
                                </div>
                                <div className="table-config">
                                    <Table
                                        bordered
                                        columns={buildColsDayOffLevel(
                                            this.handleEditDayOffLevel,
                                            this.handleDeleteDayOffLevel,
                                            canUpdate
                                        )}
                                        dataSource={this.mapData(
                                            value.dayOffByLevel,
                                            'level'
                                        )}
                                        scroll={{
                                            y: 'calc(100vh - 450px)',
                                        }}
                                        loading={
                                            loadDayoff ||
                                            value.dayOffByLevel === null
                                        }
                                        pagination={false}
                                    />
                                </div>
                            </Col>
                        </Row>
                        {canUpdate ?
                            <>
                                <h5 style={{marginTop: 30}} className="text-right">
                                    <i>Nếu có thay đổi xin hãy bấm LƯU để cập nhật</i>
                                </h5>
                                <hr style={{marginTop: 0}}/>
                                <CardFooter className="text-right info">
                                    <Popconfirm
                                        title="Bạn chắc chắn thay đổi？"
                                        icon={<QuestionCircleOutlined/>}
                                        okText="Đồng ý"
                                        cancelText="Huỷ"
                                        onConfirm={() => this.handleSubmit()}
                                    >
                                        <Button
                                            className="btn-custom"
                                            color="primary"
                                            type="button"
                                        >
                                            <CheckCircleOutlined
                                                style={{
                                                    display: 'inline',
                                                    margin: '5px 10px 0 0',
                                                }}
                                            />{' '}
                                            {'  '}
                                            <span className="btn-save-text"> LƯU</span>
                                        </Button>
                                    </Popconfirm>
                                </CardFooter>
                            </> : null}
                    </Form>
                </div>
                {canUpdate ?
                    <div>
                        <AsyncModal
                            key={showModal}
                            reload={false}
                            CompomentContent={COMPONENT[form]}
                            visible={showModal}
                            toggle={(submit, newData) =>
                                this.toggle(submit, newData)
                            }
                            title={TITLE[form]}
                            data={dataModal}
                            listData={this.getListDataTable()}
                        />
                    </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(ConfigDayOff);
