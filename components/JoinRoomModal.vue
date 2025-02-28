<template>
	<view class="modal">
		<view class="modal-content">
			<input v-model="roomId" type="text" placeholder="请输入房间号" />
			<button @click="handleConfirm">确认房间号</button>
			<button @click="handleClose">关闭</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";

// 定义 emit 函数
const emit = defineEmits(["join", "close"]);

const roomId = ref(""); // 输入的房间号

// 确认加入房间
const handleConfirm = async () => {
	if (roomId.value.length !== 4) {
		uni.showToast({ title: "房间号必须是4位数字", icon: "none" });
		return;
	}

	const openid = uni.getStorageSync("openid");

	// 调用云函数加入房间
	const { result } = await uniCloud.callFunction({
		name: "handleRoom",
		data: {
			action: "joinRoom",
			roomId: roomId.value,
			userOpenId: openid,
		},
	});

	if (result.success) {
		emit("join", roomId.value); // 跳转到房间页面
	} else {
		uni.showToast({ title: '加入房间失败：result.message', icon: "none" });
	}
};

// 关闭模态框
const handleClose = () => {
	emit("close"); // 触发父组件的 close 事件
};
</script>

<style>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background-color: white;
	padding: 20px;
	border-radius: 10px;
	width: 80%;
	max-width: 300px;
}

input {
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

button {
	margin: 5px;
	padding: 10px;
	width: 100%;
}
</style>
