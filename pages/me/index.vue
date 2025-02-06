<template>
	<view class="content">
		<tabbar></tabbar>

		<view>
			<view style="display: inline-block;">
				<u-avatar :text="text" font-size="35" size="55"></u-avatar>
			</view>

			<view style="display: inline-block; width: 500rpx; margin-left: 40rpx;">
				<u-text text="晚上好，灰太狼" size="16"></u-text>
				<view style="display: inline-block; margin-top: 10rpx;">
					<u-tag text="用户标签" plain shape="circle"></u-tag>
				</view>
			</view>
		</view>

		<u-grid :border="false" @click="click" col="4" align="center" style="margin-top: 20rpx;width: 100%;">
			<u-grid-item v-for="(baseListItem, baseListIndex) in baseList" :key="baseListIndex">
				<u-text :customStyle="{ paddingTop: 20 + 'rpx' }" :text="baseListItem.name" :size="22" align="center"></u-text>
				<text class="grid-text">{{ baseListItem.title }}</text>
			</u-grid-item>
		</u-grid>
		<br>
		<view
			style="margin-top: 20rpx; width: calc(100% - 60rpx); display: flex; justify-content: space-between; align-items: center; border-radius: 20rpx;  padding: 30rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);">
			<view @click="bindDouyin()">
				<u-text text="绑定抖音号" size="18" :bold="true"></u-text>
				<u-text text="绑定后开始直播" size="16" style="margin-top: 10rpx;"></u-text>
			</view>
			<view style="display: flex; justify-content: flex-end;">
				<u-button type="primary" text="去开播" @click="toLive()" style="width: 100rpx;"></u-button>
			</view>
		</view>

		<view
			style="margin-top: 20rpx; width: calc(100% - 60rpx); display: flex; flex-direction: column; justify-content: space-between; align-items: center; border-radius: 20rpx;  padding: 30rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);">
			<u-text text="其他功能" size="18" :bold="true"></u-text>
			<br>
			<view style="width: 100%;">
				<u-grid :border="false" @click="click" col="4" align="center" >
					<u-grid-item v-for="(baseListItem, baseListIndex) in otherList" :key="baseListIndex">
						<u-icon :customStyle="{ paddingTop: 20 + 'rpx' }" :name="baseListItem.name" :size="30"></u-icon>
						<text class="grid-text" style="text-wrap: nowrap;font-size: 14px;">{{ baseListItem.title }}</text>
					</u-grid-item>
				</u-grid>
			</view>

		</view>

		<u-button type="primary" text="退出登录" @click="logout()" style="width: 100%; margin-top: 20rpx;"></u-button>

	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			text: '狼',
			baseList: [
				{
					name: '99',
					title: '关注'
				},
				{
					name: '13.3K',
					title: '粉丝'
				},
				{
					name: '1K',
					title: '点赞'
				},
				{
					name: '30',
					title: '金币'
				}
			],
			otherList: [
				{
					name: 'red-packet',
					title: '邀请有礼'
				},
				{
					name: 'question-circle',
					title: '软件使用方法'
				},
				{
					name: 'phone',
					title: '联系客服'
				},
				{
					name: 'lock',
					title: '修改密码'
				}
			]
		}
	},
	components: {
		tabbar
	},
	onLoad() {
		uni.hideTabBar()
	},
	methods: {
		toLive() {
			console.log('去开播')
			uni.navigateTo({
				url: '/pages/index/index'
			})
		},
		logout() {
			console.log('退出登录')
			uni.removeStorageSync('token')
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		click(e) {
			console.log(e)
		},
		bindDouyin() {
			console.log('绑定抖音号')
			uni.navigateTo({
				url: '/pages/bind/bind'
			})
		}
	}
}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 20rpx;
}
</style>
