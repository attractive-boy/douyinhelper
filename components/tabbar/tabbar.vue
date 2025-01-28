<template>
	<view class="tabbar">
		<u-tabbar
			:value="value1"
			@change="change1"
			:fixed="false"
			:placeholder="false"
			:safeAreaInsetBottom="false"
			>
			<u-tabbar-item text="首页" icon="home" @click="switchTab('/pages/index/index')"></u-tabbar-item>
			<u-tabbar-item text="话术" icon="play-right" @click="switchTab('/pages/speechcraft/index')"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" @click="switchTab('/pages/me/index')"></u-tabbar-item>
			</u-tabbar>
	</view>
</template>

<script>
	export default {
		name:"tabbar",
		data() {
			return {
				
			};
		},
		methods:{
			switchTab(url){
				uni.switchTab({
					url: url
				})
			}
		}
	}
</script>

<style>
	.tabbar{
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>
