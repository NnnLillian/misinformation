<template>
  <view class="container">
    <button @click="createRoom">创建房间</button>
    <button @click="showJoinModal = true">加入房间</button>

    <!-- 加入房间的模态框 -->
    <JoinRoomModal
      v-if="showJoinModal"
      @close="showJoinModal = false"
      @join="handleJoinRoom"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import JoinRoomModal from '@/components/JoinRoomModal.vue';

const showJoinModal = ref(false); // 控制模态框显示

// 在入口页面（如 index.vue）调用微信登录
const login = async () => {
	try {
		const res = await uni.login({
			provider: "weixin",
		});
		const { code } = res;

		const uniOpenId = await uni.getStorageSync("openid");
		console.log("op", uni.getStorageSync("openid"), code);
		if (uniOpenId) {
			console.log("allready login");
		} else {
			// 通过云函数换取 OpenID
			const { result } = await uniCloud.callFunction({
				name: "getOpenId",
				data: { code },
			});
			const { openid } = result;
			uni.setStorageSync("openid", openid); // 存储 OpenID
		}
	} catch (err) {
		console.error('登录失败:', err);
	}
};


// 生成4位房间号
const generateRoomId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// 创建房间
const createRoom = async () => {
  const roomId = generateRoomId(); // 生成4位房间号
  const openid = uni.getStorageSync('openid');
  
  // 调用云函数创建房间
  await uniCloud.callFunction({
    name: 'createRoom',
    data: {
      roomId,
      hostOpenId: openid,
    },
  });

  // 跳转到房间页面
  uni.navigateTo({
    url: `/pages/room/room?roomId=${roomId}&isHost=true`,
  });
};



// 处理加入房间
const handleJoinRoom = (roomId) => {
  uni.navigateTo({
    url: `/pages/room/room?roomId=${roomId}&isHost=false`, // 跳转到房间页面，并标记为普通用户
  });
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>