<template>
	<view class="content">
		<u-navbar title="话术" :safeAreaInsetTop="true" bgColor="#007bff" :placeholder="true" height="60">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" size="28" color="#fff" @click="back"></u-icon>
			</view>
			<view class="u-nav-slot" slot="center">
				<u-text :text="pagetitle" color="#fff"></u-text>
			</view>
			<view class="u-nav-slot" slot="right">
				<u-text text="保存" color="#fff" @click="saveCategory"></u-text>
			</view>
		</u-navbar>
		<br>
		<u-radio-group v-model="f_gender" placement="row">
			<u-radio v-for="(item, index) in genderlist" :key="index" :label="item.name" :name="item.value"
				@change="radioChange" style="margin-right: 20rpx;"></u-radio>
		</u-radio-group>
		<br>
		<u-text text="音视频添加" color="#007bff" size="15" align="left" style="margin-bottom: 10rpx;"></u-text>
		<view v-for="(item, index) in medialist" :key="item.id"
			style="width: calc(100% - 40rpx); margin-top: 20rpx; border-radius: 10rpx; padding: 20rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);">
			<view
				style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;width: 100%; margin-bottom: 20rpx;">
				<u-text :text="`素材${index + 1}`"></u-text>
				<u-text text="删除" align="right" type="error"></u-text>
			</view>
			<view>
				<u-input placeholder="素材名称" v-model="item.name" style="margin-bottom: 20rpx;"></u-input>
				<u-input placeholder="音视频素材地址" v-model="item.url"></u-input>
			</view>
		</view>

		<u-button v-if="medialist.length < 2" text="新增" shape='circle' type='primary' @click="addMedia"
			style="margin-top: 20rpx;"></u-button>
		<u-text text="话术内容" color="#007bff" size="15" align="left" style="margin: 10rpx 0;"></u-text>
		<u-textarea placeholder="请输入话术内容" autoHeight v-model="content"
			style="margin: 20rpx; width: calc(100% - 40rpx)"></u-textarea>
	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			medialist: [],
			show: false,
			title: '',
			content: '',
			catogery_id: -1,
			catogery_name: '',
			pagetitle: '新增话术',
			genderlist: [ //1：大哥版，2：姐姐版，0：通用
				{
					name: '大哥版',
					value: 1
				},
				{
					name: '姐姐版',
					value: 2
				},
				{
					name: '通用版',
					value: 0,
				}
			],
			f_gender: 1,
			content: '',
			speechcraft: null,
			type: ''
		}
	},
	components: {
		tabbar
	},
	onLoad(options) {
		this.catogery_id = options.id
		this.type = options.type
		if (options.type == 'edit') {
			this.pagetitle = '修改回复'

		}
		uni.hideTabBar()
		this.refreshData()
	},
	methods: {
		refreshData() {
			uni.$api.request('/ccscript', 'GET').then(res => {
				this.speechcraft = res.filter(item => item.id == this.catogery_id)[0]
				console.log('刷新数据成功', this.speechcraft)
				if (this.type == 'edit') {
					this.medialist = []
					if (this.speechcraft.video1) {
						this.medialist.push(
							{
								name: this.speechcraft.video1.split(',')[0],
								url: this.speechcraft.video1.split(',')[1]
							}
						)
					}
					if (this.speechcraft.video2) {
						this.medialist.push(
							{
								name: this.speechcraft.video2.split(',')[0],
								url: this.speechcraft.video2.split(',')[1]
							}
						)
					}
					this.content = this.speechcraft.content
					this.f_gender = this.speechcraft.f_gender
				}
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
		close() {
			console.log('关闭')
			this.show = false
		},
		handleDelete(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该话术吗？',
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
		},
		radioChange(e) {
			this.f_gender = e
		},

		addMedia() {
			this.medialist.push(
				{
					name: '',
					url: ''
				}
			)
		},
		saveCategory() {
			if (this.content == '') {
				uni.showToast({
					title: '请输入话术内容',
					icon: 'error'
				})
				return
			}

			uni.$api.request('/ccscript', 'POST', {
				id: this.type == 'add' ? '-1' : this.catogery_id,
				catogery: this.speechcraft.catogery,
				secondary_catogory: this.speechcraft.secondary_catogory,
				content: this.content,
				priority: 0,
				f_gender: this.f_gender,
				isban: 0,
				video1: this.medialist[0] ? [this.medialist[0]?.name, this.medialist[0]?.url] : [],
				video2: this.medialist[1] ? [this.medialist[1]?.name, this.medialist[1]?.url] : [],
			}).then(res => {
				console.log(res)
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				this.refreshData()
			}).catch(err => {
				console.log(err)
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