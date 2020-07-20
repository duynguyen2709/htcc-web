export const canDoAction = (data, group, action) => {
    return data &&
        data.roleDetail &&
        data.roleDetail[group][action]
};
