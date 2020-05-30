import React, {Component} from 'react';
import {Badge, Calendar, Col, Row, Select} from 'antd';
import moment from 'moment';
import SelectBox from '../Tool/SelectBox';
import {workScheduleApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import * as _ from 'lodash';

class CalendarView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: moment(new Date()).format('YYYY'),
            month: moment(new Date()).format('MM'),
            currentOffices: props.currentOffices,
        };
    }

    componentDidMount() {
        const {currentOffices, year} = this.state;

        if (!_.isEmpty(currentOffices) && !_.isEmpty(year)) {
            this.getListDay(currentOffices, year);
        }
    }

    getListData = (value) => {
        const {listDays = []} = this.state;
        const result = [];

        const specialDays = listDays.filter((element) => {
            return (
                element.type === 2 &&
                _.isEqual(value.format('YYYYMMDD'), element.date)
            )
        });

        const normalDays = listDays.filter((element) => {
            return (
                element.type === 1 && !element.isWorking &&
                value.day() + 1 === element.weekDay
            )
        });

        for (let element of specialDays) {
            let color = 'success';
            if (element.isWorking) {
                color = 'red';
            } else {
                if (element.session === 1) {
                    color = 'purple';
                } else if (element.session === 2) {
                    color = 'orange';
                } else {
                    color = 'success';
                }
            }
            result.push({key: element.id, type: color, content: element.extraInfo});
        }

        for (let element of normalDays) {
            let color = 'blue';
            if (element.session === 1) {
                color = 'purple';
            } else if (element.session === 2) {
                color = 'orange';
            } else {
                color = 'blue';
            }
            result.push({key: element.id, type: color});
        }

        return result;
    };

    getListDay = (officeId, year) => {
        if (!officeId || _.isEmpty(officeId)) {
            return;
        }

        this.setState({
            listDays: []
        });

        workScheduleApi
            .getListWorkingDay(officeId, year)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        listDays: [
                            ...res.data.normalDays,
                            ...res.data.specialDays,
                        ],
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

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.key} className="text-left">
                        <Badge status={item.type} text={item.content}/>
                    </li>)
                )}
            </ul>
        );
    };

    onPanelChange = (value, mode) => {
        const {year, currentOffices} = this.state;
        const newYear = value.format('YYYY');
        const newMonth = value.format('MM');

        if (!_.isEqual(year, newYear)) {
            this.getListDay(currentOffices, newYear);
        }

        this.setState({
            year: newYear,
            month: newMonth,
        });
    };

    getOfficeId = (id) => {
        const lastOffice = this.state.currentOffices;
        this.setState({
            currentOffices: id,
        });

        if (!_.isEqual(lastOffice, id)) {
            this.getListDay(id, this.state.year);
        }
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            !_.isEqual(nextProps.currentOffices, this.props.currentOffices) &&
            !_.isEmpty(nextProps.currentOffices)
        ) {
            this.setState({
                currentOffices: nextProps.currentOffices,
            });
        }

        if (
            !_.isEqual(nextProps.refresh, this.props.refresh) &&
            nextProps.refresh != null
        ) {
            const {currentOffices, year} = this.state;
            this.getListDay(currentOffices, year);
        }
    }

    render() {
        const {optionsOffices} = this.props;
        const {currentOffices} = this.state;

        return (
            <Row>
                <Calendar
                    dateCellRender={this.dateCellRender}
                    headerRender={({value, type, onChange, onTypeChange}) => {
                        const start = 0;
                        const end = 12;
                        const monthOptions = [];

                        const current = value.clone();
                        const localeData = value.localeData();
                        const months = [];
                        for (let i = 0; i < 12; i++) {
                            current.month(i);
                            months.push(localeData.months(current));
                        }

                        for (let index = start; index < end; index++) {
                            monthOptions.push(
                                <Select.Option
                                    className="month-item"
                                    key={`${index}`}
                                >
                                    {months[index]}
                                </Select.Option>
                            );
                        }
                        const month = value.month();

                        const year = value.year();
                        const currentYear = new Date().getFullYear();

                        const options = [];
                        for (let i = year - 10; i < year + 10; i += 1) {
                            if (i < currentYear - 5 || i > currentYear + 1) {
                                continue;
                            }

                            options.push(
                                <Select.Option
                                    key={i}
                                    value={i}
                                    className="year-item"
                                >
                                    {i}
                                </Select.Option>
                            );
                        }
                        return (
                            <Row style={{borderBottom: '2px solid #389e0d'}}>
                                <Col sm={4} className="mr-2">
                                    <SelectBox
                                        key={optionsOffices}
                                        options={optionsOffices}
                                        returnValue={this.getOfficeId}
                                        currentOffices={currentOffices}
                                    />
                                </Col>
                                <Col sm={2} className="mr-2">
                                    <Select
                                        style={{width: '100%'}}
                                        dropdownMatchSelectWidth={false}
                                        value={String(month)}
                                        onChange={(selectedMonth) => {
                                            const newValue = value.clone();
                                            newValue.month(
                                                parseInt(selectedMonth, 10)
                                            );
                                            onChange(newValue);
                                        }}
                                    >
                                        {monthOptions}
                                    </Select>
                                </Col>
                                <Col sm={2} className="mr-2">
                                    <Select
                                        style={{width: '100%'}}
                                        dropdownMatchSelectWidth={false}
                                        className="my-year-select"
                                        onChange={(newYear) => {
                                            const now = value
                                                .clone()
                                                .year(newYear);
                                            onChange(now);
                                        }}
                                        value={String(year)}
                                    >
                                        {options}
                                    </Select>
                                </Col>
                                <Col offset={1} className="mr-2">
                                    <Badge
                                        status="success"
                                        text="Ngày nghỉ lễ"
                                    />
                                    <br/>
                                    <Badge
                                        status="red"
                                        text="Tăng ca/ làm thêm"
                                    />
                                    <br/>
                                </Col>
                                <Col offset={1} className="mr-2">
                                    <Badge
                                        status="purple"
                                        text="Nghỉ buổi sáng"
                                    />
                                    <br/>
                                    <Badge
                                        status="orange"
                                        text="Nghỉ buổi chiều"
                                    />
                                    <br/>
                                </Col>
                                <Col offset={1} className="mr-2">
                                    <Badge
                                        status="blue"
                                        text="Ngày nghỉ thường (cả ngày)"
                                    />
                                </Col>
                            </Row>
                        );
                    }}
                    onPanelChange={this.onPanelChange}
                />
            </Row>
        );
    }
}

export default CalendarView;
