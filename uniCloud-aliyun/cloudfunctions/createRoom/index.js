'use strict';
exports.main = async (event, context) => {
  const { roomId, hostOpenId } = event;
  const db = uniCloud.database();

  // 将房间信息存入云数据库
  await db.collection('rooms').add({
    data: {
      roomId,
      hostOpenId,
      users: [hostOpenId], // 初始用户列表包含房主
      createdAt: db.serverDate(),
    },
  });

  return { success: true };
};