import React from 'react';
import {Avatar, Card, Col, Row, Tooltip} from "antd";
import {MailFilled, PhoneFilled, UserOutlined} from '@ant-design/icons';

const EmployeePermissionCard = ({user}) => (
    <Tooltip
        overlayStyle={{
            width: '250%'
        }}
        title={() => (
        <>
            <Row>
                <Col span={3}>
                    <UserOutlined />
                </Col>
                <Col offset={1}>
                <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>
                    {user.username}
                </span>
                </Col>
            </Row>
            <Row>
                <Col span={3}>
                    <MailFilled/>
                </Col>
                <Col offset={1}>
        <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>
        {user.email}
        </span>
                </Col>
            </Row>
            <Row>
                <Col span={3}>
                    <PhoneFilled/>
                </Col>
                <Col offset={1}>
        <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>
        {user.phoneNumber}
        </span>
                </Col>
            </Row>
        </>)}
    >
        <Card type="inner" title={
            <>
                <Avatar src={user.avatar}/>
                <span style={{color: 'rgba(0, 0, 0, 0.75)', marginLeft: '5px',}}>
                {user.fullName}
            </span>
            </>
        }>
        </Card>
    </Tooltip>
);

export default EmployeePermissionCard;
