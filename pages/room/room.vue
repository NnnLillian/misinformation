<template>
	<view class="room-container">
		<view class="room-info">
			<text>房间号：{{ roomId }}</text>
			<text v-if="isHost">您是房主</text>
			<button @click="handleLeaveRoom" class="leave-btn">离开房间</button>
		</view>

		<view class="user-list">
			<text>用户列表（{{ users.length }}人）：</text>
			<view v-for="user in users" :key="user" class="user-item">
				<text>{{ user === hostOpenId ? "房主" : "用户" }} {{ user.slice(-4) }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad, onUnload, onHide } from "@dcloudio/uni-app";
import { ref, onMounted } from "vue";

const roomId = ref("");
const isHost = ref(false);
const users = ref([]);
const hostOpenId = ref("");
const currentUserOpenId = uni.getStorageSync("openid");
let watcher = null;

onLoad(async (query) => {
	roomId.value = query.roomId;
	isHost.value = query.isHost === "true";

	// 监听房间数据变化
	const db = uniCloud.database();
	watcher = db
		.collection("rooms")
		.where({ roomId: roomId.value })
		.watch({
			onChange: (snapshot) => {
				const roomData = snapshot.docs[0].data();
				hostOpenId.value = roomData.hostOpenId;
				users.value = roomData.users; // 更新用户列表
			},
			onError: (err) => {
				uni.showToast({
					title: "房间连接失败",
					icon: "none",
				});
			},
		});

	// 自动加入房间（防止页面刷新后状态丢失）
	if (!users.value.includes(currentUserOpenId)) {
		await joinRoom();
	}
});

// 页面卸载/隐藏时自动离开
const autoLeave = async () => {
	if (watcher) {
		watcher.close();
	}
	await leaveRoom();
};

// 监听页面卸载
onUnload(autoLeave);
// 监听页面隐藏（小程序切换到后台）
onHide(autoLeave);

// 离开房间
const leaveRoom = async () => {
	try {
		await uniCloud.callFunction({
		name: "handleRoom",
		data: {
			action: "leaveRoom",
			roomId: roomId.value,
			userOpenId: currentUserOpenId
		},
	});

		// 如果是房主且房间已空，删除房间
		if (isHost.value && users.value.length === 1) {
			await uniCloud.callFunction({
				name: "handleRoom",
				data: { action: "deleteRoom", roomId: roomId.value },
			});
		}
	} catch (err) {
		console.error("离开房间失败:", err);
	}
};

// 在 room.vue 中
const handleLeaveRoom = async () => {
  await leaveRoom();
	uni.navigateBack();
};
</script>

<style>
.room-container {
  padding: 20px;
}

.room-info {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leave-btn {
  background-color: #ff4444;
  color: white;
  margin-top: 10px;
}

.user-list {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.user-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
</style>