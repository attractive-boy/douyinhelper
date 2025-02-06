<template>
	<view style="height: 100vh;">
		<u-navbar :safeAreaInsetTop="true" bgColor="#007bff" :placeholder="true" height="60">
			<view class="u-nav-slot" slot="left">
				<u-icon name="arrow-left" size="20" @click="back" color="#fff"></u-icon>
			</view>
			<view class="u-nav-slot" slot="center">
			</view>
			<view class="u-nav-slot" slot="right">
				<u-text text="新增绑定" color="#fff" @click="addBind"></u-text>
			</view>
		</u-navbar>

		<u-list style="height: calc(100vh - 60px);">
			<u-list-item v-for="(item, index) in liveidlist" :key="index">
				<u-swipe-action>
					<u-swipe-action-item :options="[{
						text: '删除',
						style: {
							backgroundColor: '#f56c6c'
						}
					}]" @click="handleSwipeClick($event, item)">
						<u-cell :title="item.dyNicn" :isLink="true" arrow-direction="right" @click="control(item)">
							<u-icon slot="icon" size="32" name="star-fill" v-if="item.liveid == activeRoom" color="#f9ae3d"></u-icon>
						</u-cell>
					</u-swipe-action-item>
				</u-swipe-action>
			</u-list-item>
		</u-list>

		<u-modal :show="show" :title="title">
			<view class="slot-content" style="margin-top: 20px; width: 90%;">
				<u--textarea v-model="content" placeholder="请输入并确认无误绑定链接"></u--textarea>
			</view>
			<view slot="confirmButton">
				<u-button type="primary" @click="confirm">立即绑定</u-button>
			</view>
		</u-modal>
		<u-action-sheet title="操作" :actions="actionList"  @select="handleAction" @close="close" :show="showActionSheet" cancelText="取消" safeAreaInsetBottom> </u-action-sheet>
	</view>
</template>

<script>
import { getLiveid } from '../../douyin.js'
export default {
	data() {
		return {
			show: false,
			title: '',
			content: '',
			liveidlist: [],
			actionList: [{
				name:'激活房间'
			}],
			showActionSheet: false,
			currentItem: null,
			activeRoom: null
		}
	},
	methods: {
		back() {
			uni.navigateBack()
		},
		addBind() {
			this.show = true
			this.title = '新增绑定'
			this.content = ''
		},
		onLoad() {
			this.refreshData()
			this.activeRoom = uni.getStorageSync('liveid')
			console.log('activeRoom',this.activeRoom)
		},
		refreshData() {
			uni.$api.request('/liveid', 'GET').then(res => {
				this.liveidlist = res
				console.log('刷新数据成功', res)
				uni.stopPullDownRefresh()
			}).catch(err => {
				console.error('刷新失败', err)
				uni.stopPullDownRefresh()
			})
		},
		onPullDownRefresh() {
			this.refreshData()
		},
		control(item) {
			this.showActionSheet = true
			this.currentItem = item
		},
		handleAction(index) {
			console.log(index)
			this.showActionSheet = false
			if (index.name == '激活房间') {
				this.activateRoom(this.currentItem)
			}
		},
		activateRoom(item) {
			uni.setStorageSync('liveid', this.currentItem.liveid);
			console.log('currentItem',this.currentItem)
			this.activeRoom = this.currentItem.liveid
			this.refreshData()
		},
		close() {
			this.showActionSheet = false
		},
		confirm() {
			getLiveid(this.content).then(res => {
				console.log(res)
				uni.$api.request('/liveid', 'POST', {
					liveid: res.live_id,
					dyNicn: res.live_name
				}).then(res => {
					console.log(res)
					this.show = false
					this.refreshData()
				})

			}).catch(err => {
				console.log(err)
			})
		},
		handleSwipeClick(event, item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该绑定吗？',
				success: (res) => {
					if (res.confirm) {
						uni.$api.request('/liveid/' + item.liveid, 'DELETE').then(res => {
							this.refreshData()
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						}).catch(err => {
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

<style></style>
