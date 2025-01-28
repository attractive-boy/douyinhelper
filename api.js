// 封装 uniapp 统一 API
const apiBaseUrl = 'https://api.dancf.com'; // API 基础 URL

// 请求封装
const request = (url, method = 'GET', data = {}) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `${apiBaseUrl}${url}`,
            method: method,
            data: data,
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

export default {
    request
};

