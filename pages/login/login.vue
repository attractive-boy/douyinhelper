<template>
	<view class="login-container">
		<!-- 顶部logo -->
		<view class="logo-box">
			<u-image width="150px" height="150px" src="/static/logo.png"></u-image>
		</view>

		<!-- 登录表单 -->
		<view class="form-box">
			<u-form>
				<!-- 手机号输入框 -->
				<u-form-item>
					<u-input v-model="form.phone" placeholder="请输入手机号" prefixIcon="phone" clearable></u-input>
				</u-form-item>

				<!-- 密码输入框 -->
				<u-form-item>
					<u-input v-model="form.password" type="password" placeholder="请输入密码" prefixIcon="lock" clearable
						password></u-input>
				</u-form-item>
			</u-form>
			<!-- 登录按钮 -->
			<view class="btn-box">
				<u-button type="primary" text="登 录" @click="handleLogin"></u-button>
			</view>

			<!-- 其他操作 -->
			<view class="other-box">
				<text class="forget-text" @click="toForget">忘记密码</text>
				<text class="register-text" @click="toRegister">立即注册</text>
			</view>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					phone: '',
					password: ''
				}
			}
		},
		onLoad() {
			const token = uni.getStorageSync('token')
			console.log('token', token)
			const expiry = token.expiry
			console.log('expires', expiry) //2025-01-31T09:19:43.073Z
			if (Date.parse(expiry) > Date.now()) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		methods: {
			handleLogin() {
				if (!this.form.phone || !this.form.password) {
					uni.$u.toast('请填写完整信息')
					return
				}
				// 这里添加登录逻辑
				uni.$api.request('/login', 'POST', {
					username: this.form.phone,
					password: this.form.password
				}).then(res => {
					console.log(res)
					// 登录成功，保存token
					uni.setStorageSync('token', res)
					uni.$u.toast('登录成功')
					uni.switchTab({
						url: '/pages/index/index'
					})
				})
			},
			toForget() {
				uni.navigateTo({
					url: '/pages/forget/forget'
				})
			},
			toRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		padding: 50rpx;

		.logo-box {
			display: flex;
			justify-content: center;
			margin-bottom: 80rpx;
			margin-top: 60rpx;
		}

		.form-box {
			.btn-box {
				margin-top: 50rpx;
			}

			.other-box {
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				font-size: 28rpx;
				color: #909399;

				.forget-text,
				.register-text {
					color: #2979ff;
				}
			}

			.third-box {
				margin-top: 100rpx;

				.third-title {
					margin-bottom: 40rpx;

					.title-text {
						color: #909399;
						font-size: 24rpx;
					}
				}

				.icon-box {
					display: flex;
					justify-content: center;
				}
			}
		}
	}
</style>