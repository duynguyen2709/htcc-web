import React from 'react';
import {Col, Row} from "antd";
import {HomeFilled, MailFilled, PhoneFilled} from '@ant-design/icons';

const EmployeeInfoCard = ({info}) => {
    return (<>
        <Row>
            <Col span={3}>
                <MailFilled/>
            </Col>
            <Col offset={1}>
                <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>
                    {info.email}
                </span>
            </Col>
        </Row>
        <Row>
            <Col span={3}>
                <PhoneFilled/>
            </Col>
            <Col offset={1}>
                <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>
                    {info.phoneNumber}
                </span>
            </Col>
        </Row>
        <Row>
            <Col span={3}>
                <HomeFilled/>
            </Col>
            <Col offset={1}>
                <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>
                    {info.department}
                </span>
            </Col>
        </Row>
    </>)
};

export default EmployeeInfoCard;
