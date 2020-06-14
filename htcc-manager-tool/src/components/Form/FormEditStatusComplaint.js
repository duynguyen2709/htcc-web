import React from 'react';
import {Button, CardFooter, Col, Form, FormGroup, Row} from 'reactstrap';
import * as _ from 'lodash';
import {complaintApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, EditOutlined, QuestionCircleOutlined,} from '@ant-design/icons';
import {DatePicker, Input, Popconfirm, Select, Table} from 'antd';
import moment from 'moment';
import {columnsHistoryResponse} from '../../constant/colTable';

const {Option} = Select;
const {TextArea} = Input;

class FormEditStatusComplaint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                complaintId: this.props.data.complaintId,
                response: null,
                status: 1,
                yyyyMM: this.props.currDate
            },
            onlyView: props.onlyView,
            response: this.props.data.response,
            content: this.props.data.content,
            status: this.props.data.status
        };
    }

    handleChangeStatus = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                status: value,
            },
        });
    };

    handleOnChange = (e) => {
        const {value: valueInput, name} = e.target;
        let {value} = this.state;

        value[name] = valueInput;

        this.setState({
            value: {...value},
        });
    };

    handleSubmit = (e) => {
        const {value} = this.state;
        if (!_.isEmpty(value.response)) {
            const data = _.cloneDeep(value);

            data.response = value.response;

            this.props.loading();
            complaintApi
                .updateStatus(data)
                .then((res) => {
                    if (res.returnCode === 1) {
                        this.props.onSubmit();
                        this.clear();
                    } else {
                        this.props.stopLoading();
                        store.addNotification(createNotify('danger', res.returnMessage));
                    }
                })
                .catch((err) => {
                    this.props.stopLoading();
                    store.addNotification(createNotify('danger', JSON.stringify(err)));
                });
        } else {
            this.props.stopLoading();
            store.addNotification(
                createNotify('warning', 'Bạn chưa nhập thông tin phản hồi')
            );
        }
    };

    handleChangeDate = (date) => {
        const {value} = this.state;
        if (!_.isEmpty(date)) {
            this.setState({
                value: {
                    ...value,
                    yyyyMM: moment(date, 'YYYYMM'),
                },
            });
        }
    };

    clear = () => {
        this.setState({
            value: {
                ...this.state.value,
                response: null,
            },
        });
    };

    mapDataResponse = (contentList, responseList) => {
        const result = [];

        for (let i = 0; i < _.size(contentList); i += 1) {
            result.push({
                key: i,
                content: contentList[i],
                response: responseList[i] ? responseList[i] : ''
            });
        }

        return result;
    };

    render() {
        const {value, onlyView, content, response, status} = this.state;

        return (
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>ID</label>
                            <Input
                                className="form-control bor-radius bor-gray text-dark"
                                type="text"
                                name="complaintId"
                                disabled
                                value={value.complaintId}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Tháng</label>
                            <DatePicker
                                className="form-control bor-radius"
                                format={'MM-YYYY'}
                                value={moment(value.yyyyMM, 'YYYYMM')}
                                onChange={() => this.handleChangeDate()}
                                disabled
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Lịch sử phản hồi</label>
                            <Table
                                columns={columnsHistoryResponse}
                                dataSource={this.mapDataResponse(content, response)}
                                bordered
                                pagination={false}
                                scroll={{y: 150}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row style={{display: onlyView ? 'none' : ''}}>
                    <Col md="12">
                        <FormGroup>
                            <label>Trạng thái</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                defaultValue={1}
                                onChange={(val) => this.handleChangeStatus(val)}
                                onCancel={() => this.clear()}
                            >
                                <Option className=" bor-radius" value={1}>
                                    Đã xử lý
                                </Option>
                                <Option className=" bor-radius" value={0}>
                                    Từ chối
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row style={{display: onlyView ? 'none' : ''}}>
                    <Col md="12">
                        <FormGroup>
                            <label>Nội dung phản hồi</label>
                            <TextArea
                                name="response"
                                className="form-control bor-radius text-dark"
                                value={value.response}
                                onChange={(e) => this.handleOnChange(e)}
                                rows={4}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {status === 2 ?
                    <CardFooter className="text-right info">
                        {onlyView ? (
                            <Button
                                className="btn-custom"
                                color="primary"
                                type="button"
                                onClick={() => this.setState({onlyView: false})}
                            >
                                <EditOutlined
                                    style={{display: 'inline', margin: '5px 10px 0 0'}}
                                />{' '}
                                {'  '}
                                <span className="btn-save-text">Thêm phản hồi</span>
                            </Button>
                        ) : (
                            <Popconfirm
                                title="Bạn chắc chắn thay đổi？"
                                icon={<QuestionCircleOutlined/>}
                                okText="Đồng ý"
                                cancelText="Huỷ"
                                onConfirm={() => this.handleSubmit()}
                            >
                                <Button className="btn-custom" color="primary" type="button">
                                    <CheckCircleOutlined
                                        style={{display: 'inline', margin: '5px 10px 0 0'}}
                                    />{' '}
                                    {'  '}
                                    <span className="btn-save-text"> LƯU</span>
                                </Button>
                            </Popconfirm>
                        )}
                    </CardFooter>
                    : null
                }
            </Form>
        );
    }
}

export default FormEditStatusComplaint;
