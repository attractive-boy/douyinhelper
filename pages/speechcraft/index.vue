<template>
	<view class="content">
		<tabbar></tabbar>
		<u-navbar title="话术" :safeAreaInsetTop="true" bgColor="#007bff" placeholder="true" height="60">
			<view class="u-nav-slot" slot="left"></view>
			<view class="u-nav-slot" slot="center"></view>
			<view class="u-nav-slot" slot="right">
				<u-text text="新增分类" color="#fff"></u-text>
			</view>
		</u-navbar>
		<br>
		
		<view v-for="item in categorylist" :key="item.id" style="width: calc(100% - 40rpx); margin-top: 20rpx; border-radius: 10rpx; padding: 20rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);">
			<u-cell :border="false" :title="item" :isLink="true" arrow-direction="right"></u-cell>
		</view>
		
	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			categorylist: ['礼物','开场白','互动','结束语','其他','话术','其他'],
		}
	},
	components: {
		tabbar
	},
	onLoad() { 
		uni.hideTabBar()
	},
	methods: {
		

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
