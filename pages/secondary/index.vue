<template>
	<view class="content">

		<u-navbar title="话术" :safeAreaInsetTop="true" bgColor="#007bff" :placeholder="true" height="60">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" size="28" color="#fff" @click="back"></u-icon>
			</view>
			<view class="u-nav-slot" slot="center"></view>
			<view class="u-nav-slot" slot="right">
				<u-text text="新增分类" color="#fff" @click="addCategory"></u-text>
			</view>
		</u-navbar>
		<br>
		<view style="width: calc(100% - 40rpx); margin-top: 20rpx; border-radius: 10rpx; padding: 20rpx; ">
			<u-text text="关键字" color="#007bff" size="15" align="left"></u-text>
			<u-text :text="catogery_name" size="15" align="left"></u-text>
		</view>
		<view v-for="item in categorylist" :key="item.id" style="width: calc(100% - 40rpx); margin-top: 20rpx;">
			<view v-if="item.secondary_catogory != '<EMPTY>'"
				style="border-radius: 10rpx; padding: 20rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1); ">
				<u-swipe-action>
					<u-swipe-action-item :options="[
			{
				text: '删除',
				style: {
					backgroundColor: '#f56c6c'
				}
			}
		]" @click="handleDelete(item)">
						<u-cell :border="false" :title="item.secondary_catogory" :isLink="true" arrow-direction="right"
							@click="handleClick(item)"></u-cell>
					</u-swipe-action-item>
				</u-swipe-action>
			</view>
		</view>


	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			categorylist: ['礼物', '开场白', '互动', '结束语', '其他', '话术', '其他'],
			show: false,
			title: '',
			content: '',
			catogery_id: -1,
			catogery_name: ''
		}
	},
	components: {
		tabbar
	},
	onLoad(options) {
		this.catogery_id = options.id
		uni.hideTabBar()
		this.refreshData()
	},
	onPullDownRefresh() {
		this.refreshData()
	},
	methods: {
		refreshData() {
			uni.$api.request('/ccscript', 'GET').then(res => {
				const catogery_name = res.find(item => item.id == this.catogery_id).catogery
				this.categorylist = res
				this.catogery_name = catogery_name
				this.categorylist = this.categorylist.filter((item, index, self) => {
					return item.catogery == catogery_name
				})
				//根据secondary_catogory 去重
				this.categorylist = this.categorylist.filter((item, index, self) => {
					return self.findIndex(t => t.secondary_catogory === item.secondary_catogory) === index
				})
				console.log('刷新数据成功', this.categorylist)
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
				catogery: this.catogery_name,
				secondary_catogory: this.content,
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
				url: `/pages/contentedit/contentedit?id=${item.id}`
			})
		},
		back() {
			uni.navigateBack()
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
