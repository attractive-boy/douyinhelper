/**
 * 获取ttwid和liveid
 * @param {string} appurl - 抖音分享链接
 * @returns {Promise<Array>} - live_id
 */
export async function getLiveid(appurl) {
    try {
        const scode = appurl.split("/")[3]
        const base_url = "https://v.douyin.com";
        const response = await uni.request({
            url: `${base_url}/${scode}`,
            method: 'GET'
        })
        const html = response.data;
        
        const webRidMatch = html.match(/webRid[\\\"]*:[\\\"]*(\d+)/);
        const regex = /【([^】]+)】正在直播/;
        const match = html.match(regex);
        if (match && match[1]) {
            console.log('获取到的主播名:', match[1]);
        }
        
        const live_id = webRidMatch?.[1] || null;
        const live_name = match?.[1] || null;

        console.log(' lid:', live_id);
    
        return {live_id, live_name};
    } catch (error) {
        console.error('get lid error:', error);
        return  null;
    }
}