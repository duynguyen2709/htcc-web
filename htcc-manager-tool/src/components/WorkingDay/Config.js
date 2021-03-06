import React, {Component} from 'react';
import {Col, Popconfirm, Row, Select, Tabs, Tooltip} from 'antd';
import {
    CalendarOutlined,
    PlusSquareOutlined,
    QuestionCircleOutlined,
    ScheduleOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import NormalDayTable from './NormalDayTable';
import SpecialDayTable from './SpecialDayTable';
import SelectBox from '../Tool/SelectBox';
import {connect} from 'react-redux';
import {workScheduleApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import moment from 'moment';
import * as _ from 'lodash';
import {Button, CardFooter} from 'reactstrap';
import FormNewWorkingDay from '../Form/FormNewWorkingDay';
import AsyncModal from '../Modal/AsyncModal';
import {canDoAction} from "../../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../../constant/constant";

const {TabPane} = Tabs;

class Config extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            currentOffices: '',
            normalDays: null,
            specialDays: null,
            year: moment(new Date()).format('YYYY'),
            showModal: false,
        };
    }

    toggle = (submit = false) => {
        const {normalDays, specialDays} = this.state;

        this.setState({
            showModal: !this.state.showModal,
            normalDays: submit ? null : normalDays,
            specialDays: submit ? null : specialDays,
        });

        if (submit) {
            this.reloadData();
        }
    };

    getOfficeId = (id) => {
        this.setState({
            currentOffices: id,
        });
        this.props.getCurrentOffices(id);
        this.getListDay(id, this.state.year);
    };

    componentDidMount() {
        const {currentOffices, year} = this.state;

        if (!_.isEmpty(currentOffices)) {
            this.getListDay(currentOffices, year);
        }
    }

    getListDay = (officeId, year) => {
        if (!officeId || _.isEmpty(officeId)) {
            return;
        }

        this.setState({
            normalDays: null,
            specialDays: null,
        });

        workScheduleApi
            .getListWorkingDay(officeId, year)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        normalDays: res.data.normalDays,
                        specialDays: res.data.specialDays,
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

    renderYearOptions = () => {
        const year = new Date().getFullYear();

        const options = [];
        for (let i = year - 5; i <= year + 1; i += 1) {
            options.push(
                <Select.Option key={i} value={i} className="year-item">
                    {i}
                </Select.Option>
            );
        }

        return options;
    };

    onChangeYear = (value) => {
        this.setState({
            year: value,
        });
        this.props.getCurrentOffices(this.state.currentOffices);
        this.getListDay(this.state.currentOffices, value);
    };

    submitConfigLikeHeadquarter = () => {
        const {currentOffices, normalDays, specialDays} = this.state;

        this.setState({
            normalDays: null,
            specialDays: null,
        });

        workScheduleApi
            .configWorkingDayLikeHeadquarter(currentOffices)
            .then((res) => {
                if (res.returnCode === 1) {
                    store.addNotification(
                        createNotify('default', 'Thiết lập thành công')
                    );
                } else {
                    this.setState({
                        normalDays,
                        specialDays,
                    });

                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                this.setState({
                    normalDays,
                    specialDays,
                });

                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            }).finally(() => {
            this.reloadData();
        })
    };

    reloadData = () => {
        this.getListDay(this.state.currentOffices, this.state.year);
        this.props.reload();
    };

    render() {
        const {data = {}} = this.props;
        const {
            currentOffices,
            normalDays,
            specialDays,
            year,
            showModal,
        } = this.state;

        const canAdd = canDoAction(this.props.data, ROLE_GROUP_KEY.WORKING_DAY, ACTION.CREATE);
        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.WORKING_DAY, ACTION.UPDATE);
        const canDelete = canDoAction(this.props.data, ROLE_GROUP_KEY.WORKING_DAY, ACTION.DELETE);

        return (
            <div className="content">
                <div className="tabs-big">
                    <Row>
                        <Col sm={4} className="mr-2">
                            <SelectBox
                                key={data.canManageOffices}
                                options={data.canManageOffices}
                                returnValue={this.getOfficeId}
                            />
                        </Col>
                        <Col sm={2} className="mr-4">
                            <Select
                                dropdownMatchSelectWidth={false}
                                className="my-year-select"
                                onChange={this.onChangeYear}
                                value={year}
                            >
                                {this.renderYearOptions()}
                            </Select>
                        </Col>
                        <Col sm={16} className="text-right mr-2">
                            {canUpdate ?
                            <CardFooter className="text-right info no-mar">
                                <Popconfirm
                                    title="Bạn chắc chắn về thiết lập này ？"
                                    icon={<QuestionCircleOutlined/>}
                                    okText="Đồng ý"
                                    cancelText="Huỷ"
                                    onConfirm={() =>
                                        this.submitConfigLikeHeadquarter()
                                    }
                                >
                                    <Button
                                        className="btn-custom"
                                        color="primary"
                                        type="button"
                                    >
                                        <SettingOutlined
                                            style={{
                                                display: 'inline',
                                                margin: '5px 10px 0 0',
                                            }}
                                        />{' '}
                                        {'  '}
                                        <span className="btn-save-text">
                                            {' '}
                                            Thiết lập giống trụ sở chính
                                        </span>
                                    </Button>
                                </Popconfirm>
                            </CardFooter> : null}
                        </Col>
                        {canAdd ?
                        <div sm={3} className="float-right btn-new-big">
                            <Tooltip
                                placement="top"
                                title={'Thêm ngày làm việc'}
                            >
                                <PlusSquareOutlined
                                    onClick={() => this.toggle(false)}
                                />
                            </Tooltip>
                        </div> : null}
                    </Row>

                    <Tabs defaultActiveKey="normal" type="card">
                        <TabPane
                            style={{overflowY: 'auto', overflowX: 'scroll'}}
                            tab={
                                <span>
                                    <CalendarOutlined/>
                                    Ngày thường
                                </span>
                            }
                            key="normal"
                        >
                            <NormalDayTable
                                key={normalDays}
                                officeId={currentOffices}
                                data={normalDays}
                                reloadData={this.reloadData}
                                canAction={{
                                    canAdd,
                                    canUpdate,
                                    canDelete
                                }}
                            />
                        </TabPane>
                        <TabPane
                            tyle={{overflowY: 'auto', overflowX: 'scroll'}}
                            tab={
                                <span>
                                    <ScheduleOutlined/>
                                    Ngày đặc biệt
                                </span>
                            }
                            key="special"
                        >
                            <SpecialDayTable
                                key={specialDays}
                                officeId={currentOffices}
                                data={specialDays}
                                reloadData={this.reloadData}
                                canAction={{
                                    canAdd,
                                    canUpdate,
                                    canDelete
                                }}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                {canAdd ?
                <div>
                    <AsyncModal
                        key={showModal}
                        reload={false}
                        CompomentContent={FormNewWorkingDay}
                        visible={showModal}
                        toggle={(submit) => this.toggle(submit)}
                        title={'Thêm ngày làm việc mới'}
                        data={null}
                        mode={'new'}
                        prop={{officeId: currentOffices}}
                    />
                </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(Config);
