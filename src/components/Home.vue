<template>
	<!-- <div>
		<div class="header">
			<h1>
				欢迎光临Tiger俱乐部
			</h1>
		</div>
		<div class="home-login">
			<el-button type="primary" @click="login">登录</el-button>
			<el-button type="infor" @click="logout">退出</el-button>
			<span>欢迎{{}}</span>
		</div>
	</div> -->
	<el-container>
	  <el-header>Header</el-header><el-button type="infor" @click="logout">退出</el-button>
	  <el-container>
	    <el-aside width="200px">Aside</el-aside>
	    <el-main>Main</el-main>
	  </el-container>
	</el-container>

</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			login() {
				this.$router.push('/login');
			},
			logout() {
				//清空token 
				window.sessionStorage.clear();
				//重定向到 登录页面
				this.$router.push("/login");
			}
		}
	}
</script>

<style scoped="scoped">
	.header {
		top: 60px;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.home-login {
		float: right;
		margin-right: 30px;
		margin-top: 30px;
	}
	.el-header{
		background-color: #666666;
	}
	.el-aside{
		background-color: #232323;
	}
</style>
