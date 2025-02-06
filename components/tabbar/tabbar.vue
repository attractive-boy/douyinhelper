<template>
	<view class="tabbar">
		<u-tabbar :value="tabIndex" @change="change1" :fixed="false" :placeholder="false"
			:safeAreaInsetBottom="false">
			<u-tabbar-item text="首页" icon="home" @click="switchTab(0)"></u-tabbar-item>
			<u-tabbar-item text="话术" icon="play-right" @click="switchTab(1)"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" @click="switchTab(2)"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
	name: "tabbar",
	data() {
		return {
			urls: [
				'/pages/index/index',
				'/pages/speechcraft/index',
				'/pages/me/index'
			]
		};
	},
	computed: {
		...mapState(['tabIndex'])
	},
	methods: {
		...mapMutations(['setTabIndex']),
		switchTab(index) {
			uni.switchTab({
				url: this.urls[index],
				success: () => {
					this.setTabIndex(index)
				}
			})
		},
		change1(index) {
			console.log('change1', index)
		}
	}
}
</script>

<style>
.tabbar {
	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>
