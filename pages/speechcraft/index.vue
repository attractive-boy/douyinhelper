<template>
	<view class="content">
		<tabbar></tabbar>
		<u-navbar title="话术" :safeAreaInsetTop="true" bgColor="#007bff" :placeholder="true" height="60">
			<view class="u-nav-slot" slot="left"></view>
			<view class="u-nav-slot" slot="center"></view>
			<view class="u-nav-slot" slot="right">
				<u-text text="新增分类" color="#fff" @click="addCategory"></u-text>
			</view>
		</u-navbar>
		<br>
		
		<view v-for="item in categorylist" :key="item.id" style="width: calc(100% - 40rpx); margin-top: 20rpx; border-radius: 10rpx; padding: 20rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);">
			<u-swipe-action>
				<u-swipe-action-item :options="[
					{
						text: '删除',
						style: {
							backgroundColor: '#f56c6c'
						}
					}
				]" @click="handleDelete(item)">
					<u-cell :border="false" :title="item.catogery" v-if="item.catogery != '<EMPTY>'" :isLink="true" arrow-direction="right" @click="handleClick(item)"></u-cell>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
		<u-modal :show="show" :title="title"  @confirm="confirm" @close="close" showCancelButton @cancel="close">
			<view>
				<u-input v-model="content" placeholder="请输入分类名称" />
			</view>
		</u-modal>
		
	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			categorylist: ['礼物','开场白','互动','结束语','其他','话术','其他'],
			show: false,
			title: '',
			content: ''
		}
	},
	components: {
		tabbar
	},
	onLoad() { 
		uni.hideTabBar()
		this.refreshData()
	},
	onPullDownRefresh() {
		this.refreshData()
	},
	methods: {
		refreshData() {
			uni.$api.request('/ccscript', 'GET').then(res => {
				this.categorylist = res //catogery 去重
				this.categorylist = this.categorylist.filter((item, index, self) => {
					return self.findIndex(t => t.catogery === item.catogery) === index
				})
				console.log('刷新数据成功', res)
				uni.stopPullDownRefresh()
			}).catch(err => {
				console.error('刷新失败', err)
				uni.stopPullDownRefresh()
			})
		},
		addCategory() {
			this.show = true
			this.title = '新增分类'
			this.content = ''
		},
		confirm() {
			console.log('确认')
			uni.$api.request('/ccscript', 'POST', {
				id: -1,
				catogery: this.content,
				secondary_catogory: "<EMPTY>",
				content: "<EMPTY>",
				priority: 0,
				f_gender: 0,
				content: "<EMPTY>",
				isban: 0,
				video1: [],
				video2: [],
			}).then(res => {
				console.log(res)
				this.show = false
				this.refreshData()
			}).catch(err => {
				console.log(err)
			})
		},
		close() {
			console.log('关闭')
			this.show = false
		},
		handleDelete(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该分类吗？',
				success: (res) => {
					if (res.confirm) {
						uni.$api.request(`/ccscript/${item.id}`, 'DELETE').then(res => {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							this.refreshData()
						}).catch(err => {
							uni.showToast({
								title: '删除失败',
								icon: 'error'
							})
						})
					}
				}
			})
		},
		handleClick(item) {
			console.log('点击', item)
			uni.navigateTo({
				url: `/pages/secondary/index?id=${item.id}`
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
