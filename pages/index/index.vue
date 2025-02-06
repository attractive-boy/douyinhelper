<template>
	<view class="content">
		<tabbar></tabbar>
		<u-navbar  leftText="排序" title="首页" :safeAreaInsetTop="true" bgColor="#007bff" :placeholder="true" height="60">
			<view class="u-nav-slot" slot="left" >
				<u-text text="排序" color="#fff"></u-text>
			</view>
			<view class="u-nav-slot" slot="center">
				<u-input placeholder="输入内容">
					<template slot="suffix">
						<u-button @tap="search" text="搜索" type="success" size="mini"></u-button>
					</template>
				</u-input>
			</view>
			<view class="u-nav-slot" slot="right">
				<u-icon name="plus" size="20" @click="openAdd" color="#fff"></u-icon>
			</view>
		</u-navbar>
		<br>
		<u-swiper :list="homeswiper" @change="swiperChange" @click="click" style="width: 100%;" height="200"></u-swiper>
		<view v-for="item in cardlist" :key="item.id" style="width: calc(100% - 40rpx); margin-top: 20rpx; border-radius: 10rpx; padding: 20rpx; box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);">
			<u-text :text="item.roomname" size="20" style="margin-bottom: 10rpx; text-align: left;"></u-text>
			<u-text :text="activeRoom" size="12" style="text-align: left;margin-bottom: 10rpx;" color="#f9ae3d"></u-text> 
			<u-text :text="item.contents" size="16" style="text-align: left;"></u-text>
			<br>
			<view style="display: flex; justify-content: space-between; align-items: center;">
				<u-text type="error" prefixIcon="trash" iconStyle="font-size: 19px" text="删除" :iconStyle="{color: '#FF0000'}"  
					align="center" @click="deleteRoom(item)"></u-text>
				<u-text type="warning" prefixIcon="edit-pen" iconStyle="font-size: 19px" text="编辑" :iconStyle="{color: '#f9ae3d'}"  
					align="center" @click="edit(item)"></u-text>
				<u-text type="primary"  iconStyle="font-size: 19px" text="开始直播" align="center"></u-text>
			</view>
		</view>
		<br>
		<u-loadmore :status="status" />
		<u-popup :show="show" @close="close" @open="openPopup" :closeable="true" round="20">
            <view style="padding: 20rpx;">
				<u-text :text="isEdit ? '编辑房间' : '新增房间'" size="20" style="margin-bottom: 10rpx; text-align: left;"></u-text>
				<br>
                <u-input placeholder="请输入房间名称" v-model="roomname"></u-input>
				<br>
				<u-textarea v-model="contents" placeholder="请输入房间介绍" autoHeight maxlength = '-1' style="height: 600rpx;"></u-textarea>
				<br>
				<u-button @click="submit" :text="isEdit ? '保存' : '添加'" type="primary" size="large"></u-button>
            </view>
		</u-popup>
	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue'
export default {
	data() {
		return {
			homeswiper: [
				"https://gd-filems.dancf.com/gaoding/cms/mcm79j/mcm79j/60898/f27e72e2-fc96-4edc-a4fe-ce0259edd61f679527.jpg",
			],
			cardlist: [
				{
					roomname: '电脑与电子产品',
					contents: '我们普通人如何通过短视频直播创业来变现.....',
				}
			],
			status: 'nomore',
			show: false,
			roomname: '',
			contents: '',
			isEdit: false,
			currentId: null,
			activeRoom: null
		}
	},
	components: {
		tabbar
	},
	onLoad() { 
		uni.hideTabBar()
		this.refreshData()
		this.activeRoom = uni.getStorageSync('liveid')
	},
	onPullDownRefresh() {
		this.refreshData()
	},
	methods: {
		refreshData() {
			uni.$api.request('/rooms', 'GET').then(res => {
				this.cardlist = res
				console.log('刷新数据成功', res)
				uni.stopPullDownRefresh()
			}).catch(err => {
				console.error('刷新失败', err)
				uni.stopPullDownRefresh()
			})
		},
		search() {
			console.log('搜索')
		},
		swiperChange(index) {
			console.log(index)
		},
		click(index) {
			console.log(index)
		},
		openAdd() {
			console.log('openAdd')	
			this.roomname = ''
			this.contents = ''
			this.isEdit = false
			this.currentId = null
			this.show = true
		},
		openPopup() {
			console.log('popup opened')
		},
		close() {
			console.log('close')
			this.show = false
		},
		add() {
			console.log('add')
			uni.$api.request('/rooms', 'POST', {
				roomname: this.roomname,
				contents: this.contents
			}).then(res => {
				console.log(res)
				this.show = false
				this.roomname = ''
				this.contents = ''
				this.refreshRooms()
			})
		},
		closeable() {
			console.log('closeable')
		},
		edit(item) {
			this.isEdit = true
			this.currentId = item.id
			this.roomname = item.roomname
			this.contents = item.contents
			this.show = true
		},
		submit() {
			if (this.isEdit) {
				// 编辑房间
				uni.$api.request(`/rooms/${this.currentId}`, 'PUT', {
					roomname: this.roomname,
					contents: this.contents
				}).then(res => {
					console.log('修改成功', res)
					this.show = false
					// 刷新房间列表
					this.refreshRooms()
				}).catch(err => {
					console.error('修改失败', err)
				})
			} else {
				// 添加房间
				this.add()
			}
		},
		refreshRooms() {
			uni.$api.request('/rooms', 'GET').then(res => {
				this.cardlist = res
			})
		},
		deleteRoom(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该房间吗？',
				success: (res) => {
					if (res.confirm) {
						uni.$api.request(`/rooms/${item.id}`, 'DELETE').then(res => {
							console.log('删除成功')
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							// 刷新房间列表
							this.refreshRooms()
						}).catch(err => {
							console.error('删除失败', err)
							uni.showToast({
								title: '删除失败',
								icon: 'error'
							})
						})
					}
				}
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

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
