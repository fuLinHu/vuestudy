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
	<el-container class="home-container">
		<el-header>
			<div>
				<img class="logo-home" src="../assets/image/tiger.png" />
				<span>虎虎电商系统</span>
			</div>
			<el-button type="infor" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<!--侧边栏 -->
			<el-aside :width="ifcollapse?'64px':'200px'">
				<div class="button-trogg" @click="menutrogger">|||</div>
				<el-menu  background-color="#545c64" text-color="#fff" active-text-color="#0c24ff"
				 :unique-opened="true" :collapse="ifcollapse" :collapse-transition="false" :router="true"
				 default-active="/user">
					<!-- 一级菜单-->
					<el-submenu :index="item.id +''" v-for="(item,index) in menuList" :key="item.id">
						<!-- 一级菜单模板区-->
						<template slot="title">
							<i :class="icons[index]"></i>
							<span>{{item.menuName}}</span>
						</template>
						<!-- 二级菜单-->
						<el-menu-item :index="sonitem.path" v-for="sonitem in item.childrent" @click="saveNavStatus(sonitem.path)">
							<!-- 二级菜单模板区-->
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{sonitem.menuName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
					
				</el-menu>
			</el-aside>
			<el-main>
				<!-- 路由占位符 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>

</template>

<script>
	export default {
		data() {
			return {
				menuList:[],
				icons:{
					"0":"el-icon-user-solid",
					"1":"el-icon-first-aid-kit",
					"2":"el-icon-shopping-bag-1",
					"3":"el-icon-notebook-2",
					"4":"el-icon-s-platform"
				},
				ifcollapse:false,
				activeNavStatus:""
			}
		},
		created() {
			this.getMeunList();
			this.activeNavStatus = window.sessionStorage.getItem("activeNavStatus");
			
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
			},
			getMeunList(){
				this.$http.get("/menu/getMenuList")
				.then(respon=>{
					if(respon.data.status=='888888'){
						this.menuList=respon.data.data;
					}
					console.log(respon)
				})
				.catch(error=>{
					
				})
				
			},
			menutrogger(){
				this.ifcollapse=!this.ifcollapse;
			},
			saveNavStatus(activeNavStatus){
				this.activeNavStatus = activeNavStatus;
				window.sessionStorage.setItem("activeNavStatus",activeNavStatus);
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
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

	.el-header {
		background-color: #666666;
		display: flex;
		justify-content: space-between;
		padding: 0px;
		align-items: center;
		color: #FFFFFF;
		font-size: 20px;

		>div {
			display: flex;
			align-items: center;

			span {
				margin-left: 10px;
			}
		}
	}

	.el-aside {
		background-color: #232323;
		.el-menu{
			border-right: none;
		}
	}

	.home-container {
		height: 100%;
	}

	.logo-home {
		width: 60px;
		height: 60px;
	}
	.button-trogg{
		background-color: #42B983;
		font-size: 10px;
		line-height: 24px;
		color: #FFFFFF;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>
