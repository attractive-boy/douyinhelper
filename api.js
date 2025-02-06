// 封装 uniapp 统一 API
const apiBaseUrl = 'http://47.121.208.223:8008'; // API 基础 URL

// 请求封装
const request = (url, method = 'GET', data = {}) => {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync('token')
        const headers = {}
        if (token && Date.parse(token.expiry) > Date.now()) {
            // 如果 token 存在且未过期，则添加到请求头
            headers.Authorization = `Bearer ${token.token}`
        }
        console.log(`request=>${method}=>${apiBaseUrl}${url}=>${JSON.stringify(data)}=>${JSON.stringify(headers)}`);
        uni.request({
            url: `${apiBaseUrl}${url}`,
            method: method,
            data: data,
            header: headers,
            success: (res) => {
				console.log(`response=>${JSON.stringify(res)}`);
                switch (res.statusCode) {
                    case 200:
                        resolve(res.data);
                        break;
                    case 401:
                        uni.removeStorageSync('token')
                        uni.reLaunch({
                            url: '/pages/login/login'
                        });
                        break;
                    default:
                        reject(res);
                        break;
                }
            },
            fail: (err) => {
				console.log(`error=>${JSON.stringify(err)}`);
                reject(err);
            }
        });
    });
};
uni.$api = {
    request
};

export default {
    request
};

