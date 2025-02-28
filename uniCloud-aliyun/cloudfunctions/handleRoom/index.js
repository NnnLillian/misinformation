"use strict";
exports.main = async (event, context) => {
	const { roomId, hostOpenId, userOpenId, action } = event;
	const db = uniCloud.database();
	const _ = db.command;

	if (action === "createRoom") {
		// 将房间信息存入云数据库
		await db.collection("rooms").add({
			roomId,
			hostOpenId,
			users: `${hostOpenId}`, // 初始用户列表包含房主
		});
	}

  if(action==="getRoom"){
    const { data: rooms } = await db.collection("rooms").where({ roomId }).get();
    return rooms[0];
  }

	if (action === "joinRoom") {
		// 查询房间是否存在
		const { data: rooms } = await db.collection("rooms").where({ roomId }).get();
		if (rooms.length === 0) {
			return { success: false, message: "房间不存在" };
		}

		const room = rooms[0];

		// 检查用户是否已在房间中
		if (room.users.includes(userOpenId)) {
			return { success: true }; // 用户已存在，直接返回成功
		}
		// 更新房间用户列表
		await db
			.collection("rooms")
			.doc(room._id)
			.update({
				data: {
					users: _.addToSet(userOpenId),
				},
			});
	}

	if (action === "leaveRoom") {
		// 从用户列表中移除用户
		await db
			.collection("rooms")
			.where({ roomId })
			.update({
				data: {
					users: _.pull(userOpenId),
				},
			});
	}

	if (action === "deleteRoom") {
		// 删除房间记录
		const { data: rooms } = await db.collection("rooms").where({ roomId }).get();

		if (rooms.length > 0) {
			await db.collection("rooms").doc(rooms[0]._id).remove();
		}
	}
	return { success: true };
};
