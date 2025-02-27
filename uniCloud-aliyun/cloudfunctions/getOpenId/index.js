// 云函数 getOpenId/index.js
// const cloud = require('wx-server-sdk');
// cloud.init();
const AppID = "self";
const AppSecret = "self";
exports.main = async (event, context) => {
	const { code } = event;
	// const { OPENID } = cloud.getWXContext();
	const resule = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`,
		{ dataType: "json" }
	);
	return resule; // 直接返回用户 OpenID
};
