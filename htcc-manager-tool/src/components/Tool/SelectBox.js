import React from 'react';
import { Select } from 'antd';
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
        const { options = [], currentOffices } = this.props;
        this.setState(
            {
                value: _.isEmpty(currentOffices)
                    ? typeof options[0] === 'object'
                        ? options[0].key
                        : options[0]
                    : currentOffices,
            },
            () => {
                this.props.returnValue(this.state.value);
            }
        );
    }

    onChange = (value) => {
        this.setState({
            value,
        });
        this.props.returnValue(value);
    };

    render() {
        const { options = [], placeholder = 'Chọn mã chi nhánh' } = this.props;
        let { value } = this.state;

        if (!_.isEmpty(value) && typeof value === 'object') value = value.key;

        return (
            <Select
                style={{ width: '100%' }}
                className="bor-radius"
                value={value}
                onChange={(val) => this.onChange(val)}
                onCancel={() => this.clear()}
                placeholder={placeholder}
            >
                {_.map(options, (o, i) => {
                    return (
                        <Option
                            key={i}
                            className=" bor-radius"
                            value={o.key ? o.key : o}
                        >
                            {o.value ? o.value : o}
                        </Option>
                    );
                })}
            </Select>
        );
    }
}

export default SelectBox;
