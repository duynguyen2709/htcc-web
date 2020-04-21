import * as _ from 'lodash';

export const removeItem = (array, key, value) => {
    _.remove(array, (item) => item[key] === value);
    return array;
};

export const updateItem = (array, key, data) => {
    const result = _.toArray(
        _.omitBy(array, (item) => item[key] === data[key])
    );

    result.push(data);

    return result;
};
