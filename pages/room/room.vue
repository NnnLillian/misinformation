<template>
  <view class="room-container">
    <view class="room-info">
      <text>房间号：{{ roomId }}</text>
      <text v-if="isHost">您是房主</text>
    </view>

    <view class="user-list">
      <text>用户列表：</text>
      <view v-for="user in users" :key="user.id" class="user-item">
        <text>{{ user.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const roomId = ref(''); // 房间号
const isHost = ref(false); // 是否是房主
const users = ref([]); // 用户列表

// 获取页面参数
onLoad((query) => {
  roomId.value = query.roomId;
  isHost.value = query.isHost === 'true';

  // 模拟用户加入房间
  joinRoom(roomId.value);
});

// 模拟加入房间
const joinRoom = (roomId) => {
  // 这里可以替换为实际的 WebSocket 或 HTTP 请求
  setTimeout(() => {
    users.value.push({ id: 1, name: '用户A' });
    users.value.push({ id: 2, name: '用户B' });
  }, 1000);
};
</script>

<style>
.room-container {
  padding: 20px;
}

.room-info {
  margin-bottom: 20px;
}

.user-list {
  margin-top: 20px;
}

.user-item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>