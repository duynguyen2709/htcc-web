import React, {Component} from 'react';
import {Badge, Calendar, Col, Row, Select} from 'antd';
import moment from 'moment';
import SelectBox from '../Tool/SelectBox';
import {workScheduleApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import * as _ from 'lodash';
import ReactLoading from "react-loading";

class CalendarView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: moment(new Date()).format('YYYY'),
            month: moment(new Date()).format('MM'),
            currentOffices: props.currentOffices,
            isLoading: false,
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

        for (let index = 0; index < listDays.length; index++) {
            const element = listDays[index];

            if (
                element.type === 2 &&
                _.isEqual(value.format('YYYYMMDD'), element.date)
            ) {
                return [{key: element.id, type: 'success', content: element.extraInfo}];
            }

            if (value.day() + 1 === element.weekDay && !element.isWorking) {
                return [{key: element.id, type: 'orange'}];
            }
        }

        return [];
    };

    toggleLoading = () => {
        const {isLoading} = this.state;
        this.setState({
            isLoading: !isLoading
        })
    };

    getListDay = (officeId, year) => {
        if (!officeId || _.isEmpty(officeId)) {
            return;
        }

        this.toggleLoading();

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
            }).finally(() => {
            this.toggleLoading();
        });
    };

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.key} className="text-center">
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
    }

    render() {
        const {optionsOffices} = this.props;
        const {isLoading, currentOffices} = this.state;

        return (
            <Row>
                {isLoading ?
                    <ReactLoading
                        type={'spinningBubbles'}
                        color={'#4caf50'}
                        style={{position: 'relative', left: '45%'}}
                        height={'10%'}
                        width={'10%'}
                    /> :
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
                                        value={String(index + 1)}
                                    >
                                        {months[index]}
                                    </Select.Option>
                                );
                            }
                            const month = value.month();

                            const year = value.year();
                            const options = [];
                            for (let i = year - 5; i <= year + 1; i += 1) {
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
                                            status="orange"
                                            text="Ngày nghỉ thường"
                                        />
                                        <br/>
                                    </Col>
                                </Row>
                            );
                        }}
                        onPanelChange={this.onPanelChange}
                    />}
            </Row>
        );
    }
}

export default CalendarView;
