import React from 'react';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import * as _ from 'lodash';

const { Option } = Select;

class SelectBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    clear = () => {
        this.setState({
            value: null,
        });
    };

    componentDidMount() {
        const { options = [] } = this.props;
        this.setState({
            value: options[0] || null,
        });
    }

    onChange = (value) => {
        if (!_.isEmpty(value)) {
            this.setState({
                value,
            });
            this.props.returnValue(value);
        }
    };

    render() {
        const { options = [] } = this.props;

        return (
            <Select
                style={{ width: '100%' }}
                className="bor-radius"
                value={this.state.value}
                onChange={(val) => this.onChange(val)}
                onCancel={() => this.clear()}
                placeholder={'Chọn mã chi nhánh'}
            >
                {_.map(options, (o) => {
                    return (
                        <Option key={o} className=" bor-radius" value={o}>
                            {o}
                        </Option>
                    );
                })}
            </Select>
        );
    }
}

export default SelectBox;
