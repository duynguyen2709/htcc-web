import React, { Component } from 'react';
import { Calendar, Badge, Select, Col, Row } from 'antd';
import moment from 'moment';
import SelectBox from '../Tool/SelectBox';
import { workScheduleApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
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
        const { currentOffices, year } = this.state;

        if (!_.isEmpty(currentOffices) && !_.isEmpty(year)) {
            this.getListDay(currentOffices, year);
        }
    }

    getListData = (value) => {
        const { listDays = [] } = this.state;

        for (let index = 0; index < listDays.length; index++) {
            const element = listDays[index];

            if (
                element.type === 2 &&
                _.isEqual(value.format('YYYYMMDD'), element.date)
            ) {
                return [{ type: 'success', content: element.extraInfo }];
            }

            if (value.day() + 1 === element.weekDay && !element.isWorking) {
                return [{ type: 'orange' }];
            }
        }

        return [];
    };

    getListDay = (officeId, year) => {
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
                    <li key={item.content} className="text-center">
                        <Badge status={item.type} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };

    onPanelChange = (value, mode) => {
        const { year, officeId } = this.state;
        const newYear = value.format('YYYY');

        if (!_.isEqual(year, newYear)) {
            this.getListDay(officeId, newYear);
        }
        this.setState({
            year: newYear,
            month: value.format('MM'),
        });
    };

    getOfficeId = (id) => {
        this.setState({
            currentOffices: id,
        });
        this.getListDay(id, this.state.year);
    };

    componentWillReceiveProps(nextProps) {
        if (
            !_.isEqual(nextProps.currentOffices, this.props.currentOffices) &&
            !_.isEmpty(nextProps.currentOffices)
        ) {
            this.setState({
                currentOffices: nextProps.currentOffices,
            });
        }
    }

    render() {
        const { optionsOffices, currentOffices } = this.props;

        return (
            <Row>
                <Calendar
                    dateCellRender={this.dateCellRender}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
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
                        const options = [];
                        for (let i = year - 10; i < year + 10; i += 1) {
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
                            <Row style={{ borderBottom: '2px solid #389e0d' }}>
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
                                <Col className="mr-2">
                                    <Badge
                                        status="success"
                                        text="Ngày nghỉ lễ"
                                    />
                                    <br />
                                    <Badge
                                        status="orange"
                                        text="Ngày nghỉ thường"
                                    />
                                    <br />
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
