import React from 'react';

class NumberNotify extends React.Component {
    render() {
        const {value} = this.props;
        if (value) {
            return <div className="number-notify">
                {value > 10 ? '10+' : (value <= 0) ? '' : value}
            </div>;
        }
        return null;
    }
}

export default NumberNotify;
