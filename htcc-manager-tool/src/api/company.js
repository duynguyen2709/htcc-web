import axios from 'axios';
import {API_URL_EMPLOYEE} from '../constant/url';
import {TOKEN, USER} from '../constant/localStorageKey';

const getInfoCompany = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/companies/${user.companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 30000
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const updateInfoCompany = data => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_EMPLOYEE}/companies/${user.companyId}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

// ################### Office Section ###################

const getAllOffices = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/offices/${user.companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 30000
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const updateInfoBranch = data => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_EMPLOYEE}/offices/${user.companyId}/${data.officeId}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const createBranch = data => {
    const token = localStorage.getItem(TOKEN);

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/offices`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 30000
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const deleteBranch = data => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'delete',
            url: `${API_URL_EMPLOYEE}/offices/${user.companyId}/${data.officeId}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

// ################### Department Section ###################

const getAllDepartment = () => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios
            .get(`${API_URL_EMPLOYEE}/departments/${user.companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 30000
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const updateDepartment = data => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            url: `${API_URL_EMPLOYEE}/departments/${user.companyId}/${data.department}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const createDepartment = data => {
    const token = localStorage.getItem(TOKEN);

    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL_EMPLOYEE}/departments`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 30000
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

const deleteDepartment = data => {
    const token = localStorage.getItem(TOKEN);
    const user = JSON.parse(localStorage.getItem(USER));

    return new Promise((resolve, reject) => {
        axios({
            method: 'delete',
            url: `${API_URL_EMPLOYEE}/departments/${user.companyId}/${data.department}`,
            data: data,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};


export default {
    getInfoCompany,
    updateInfoCompany,
    getAllOffices,
    updateInfoBranch,
    createBranch,
    deleteBranch,

    getAllDepartment,
    updateDepartment,
    createDepartment,
    deleteDepartment
};
