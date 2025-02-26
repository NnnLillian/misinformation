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

// 创建房间
const createRoom = () => {
  const roomId = generateRoomId(); // 生成4位房间号
  uni.navigateTo({
    // url: `/pages/room/room`, // 跳转到房间页面，并标记为房主
    url: `/pages/room/room?roomId=${roomId}&isHost=true`, // 跳转到房间页面，并标记为房主
  });
};

// 生成4位房间号
const generateRoomId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
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