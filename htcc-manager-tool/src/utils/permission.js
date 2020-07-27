import {USER} from "../constant/localStorageKey";
import * as _ from "lodash";

export const canDoAction = (data, group, action) => {
    return data &&
        data.roleDetail &&
        data.roleDetail[group][action]
};

export const isEmployeeUnderManaged = (data, target) => {
    const user = JSON.parse(localStorage.getItem(USER));
    const employeeUsername = target.match(/\(([^)]+)\)/)[1];
    if (user.username === employeeUsername) {
        return true;
    }

    if (!data || !data.canManageEmployees) {
        return false;
    }

    for (let employee of data.canManageEmployees) {
        if (employee.username === employeeUsername) {
            return true;
        }
    }
    return false;
};

export const hasNoTargetToSendNoti = (data) => {
    if (!data || !data.canManageEmployees || !data.canManageOffices) {
        return true;
    }
    if (_.isEmpty(data.canManageEmployees) && _.isEmpty(data.canManageOffices) && !data.isSuperAdmin) {
        return true;
    }
    return false;
};
