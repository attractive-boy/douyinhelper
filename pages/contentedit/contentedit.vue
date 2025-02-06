<template>
	<view class="content">
		<u-navbar title="话术" :safeAreaInsetTop="true" bgColor="#007bff" :placeholder="true" height="60">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" size="28" color="#fff" @click="back"></u-icon>
			</view>
			<view class="u-nav-slot" slot="center">
				<u-text text="修改互动" color="#fff"></u-text>
			</view>
			<view class="u-nav-slot" slot="right">
				<u-text text="新增话术" color="#fff" @click="addCategory"></u-text>
			</view>
		</u-navbar>
		<br>
		<view style="width: calc(100% - 40rpx); margin-top: 20rpx; border-radius: 10rpx; padding: 20rpx; ">
			<u-text text="关键字" color="#007bff" size="15" align="left"></u-text>
			<u-text :text="catogery_name" size="15" align="left"></u-text>
		</view>
		<u-text text="回复" color="#007bff" size="15" align="left"></u-text>

		<view v-for="item in categorylist" :key="item.id" style="width: calc(100% - 40rpx); margin-top: 20rpx;">
			<view v-if="item.content != '<EMPTY>'"
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
						<view>
							<u-cell :border="false" :title="item.content" v-if="item.content != '<EMPTY>'"
								:isLink="true" arrow-direction="right" @click="handleClick(item)">
								<view slot="right-icon">
									<u-icon name="edit-pen"></u-icon>
								</view>
							</u-cell>
							<view style="display: flex; flex-direction: row; justify-content: space-between;">
								<u-text v-if="item.video1" prefixIcon="volume" iconStyle="font-size: 19px"
									:text="item.video1.split(',')[0]" @click="playmusic(item)"></u-text>

								<u-text v-if="item.video2" prefixIcon="play-right" iconStyle="font-size: 19px"
									@click="playvideo(item)" align="right" :text="item.video2.split(',')[0]"></u-text>
							</view>
						</view>
					</u-swipe-action-item>
				</u-swipe-action>
			</view>
		</view>
		<u-popup :show="musicpopup" @close="closemusicpopup" closeOnClickOverlay closeable>
			<view style="padding: 80rpx;">
				<u-button :text="isplay ? '暂停播放' : '播放音频'" @click="changePlayState(item)"
					:type="isplay ? 'warning' : 'primary'"></u-button>
			</view>
		</u-popup>
		<u-modal :show="videopopup" @close="closevideopopup" closeOnClickOverlay closeable @confirm="closevideopopup"
			confirmText="关闭">
			<view style="padding: 20rpx; width: 100%;height: 70vh;">
				<video :src="currentVideoUrl" autoplay controls style="width: 100%;height: 70vh;"
					@error="videoError"></video>
			</view>
		</u-modal>

	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			categorylist: ['礼物', '开场白', '互动', '结束语', '其他', '话术', '其他'],

			title: '',
			content: '',
			catogery_id: -1,
			catogery_name: '',
			musicpopup: false,
			isplay: false,
			innerAudioContext: null,
			videopopup: false,
			currentVideoUrl: '',

		}
	},
	components: {
		tabbar
	},
	onLoad(options) {
		this.catogery_id = options.id
		console.log("options==>", options)
		uni.hideTabBar()
		this.refreshData()
	},
	onPullDownRefresh() {
		this.refreshData()
	},
	methods: {
		refreshData() {
			uni.$api.request('/ccscript', 'GET').then(res => {
				const catogery_name = res.find(item => item.id == this.catogery_id).secondary_catogory
				this.categorylist = res
				this.catogery_name = catogery_name
				this.categorylist = this.categorylist.filter((item, index, self) => {
					return item.secondary_catogory == catogery_name
				})
				console.log('刷新数据成功', this.categorylist)
				uni.stopPullDownRefresh()
			}).catch(err => {
				console.error('刷新失败', err)
				uni.stopPullDownRefresh()
			})
		},
		addCategory() {
			uni.navigateTo({
				url: '/pages/contentedit/edit/edit?id=' + this.catogery_id + "&type=add"
			})
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

				this.refreshData()
			}).catch(err => {
				console.log(err)
			})
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
				url: `/pages/contentedit/edit/edit?id=${item.id}&type=edit`
			})
		},
		back() {
			uni.navigateBack()
		},
		playmusic(item) {
			console.log('播放音乐', item)


			// 创建音频实例
			this.innerAudioContext = uni.createInnerAudioContext()

			// 设置音频源
			this.innerAudioContext.src = item.video1.split(',')[1] // 获取逗号后面的 URL

			// 监听播放状态
			this.innerAudioContext.onPlay(() => {
				console.log('开始播放')
				this.isplay = true
			})

			this.innerAudioContext.onError((res) => {
				console.log('播放错误', res)
				uni.showToast({
					title: '播放失败',
					icon: 'error'
				})
			})

			this.innerAudioContext.onEnded(() => {
				console.log('播放结束')
				this.isplay = false
				this.musicpopup = false
			})

			// 开始播放
			this.innerAudioContext.play()

			this.play = true
			this.musicpopup = true
		},

		// 停止播放

		changePlayState(item) {
			if (this.isplay) {
				this.innerAudioContext.pause()
				this.isplay = false
			} else {
				this.innerAudioContext.play()
				this.isplay = true
			}
		},
		closemusicpopup() {
			this.musicpopup = false
			this.isplay = false
			this.innerAudioContext.stop()
		},
		playvideo(item) {
			console.log('播放视频', item)
			this.videopopup = true
			this.currentVideoUrl = item.video2.split(',')[1]
			console.log('播放视频', this.currentVideoUrl)
		},
		closevideopopup() {
			this.currentVideoUrl = ''
			this.videopopup = false

		},
		// 处理视频播放错误
		videoError() {
			console.log('视频播放错误')
			uni.showToast({
				title: '视频播放错误',
				icon: 'error'
			})
		},
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
