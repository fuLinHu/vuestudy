<template>
	<div class="login-container">
		<div class='login'>
			<div class="header">
				<img src="../assets/logo.png" />
			</div>
			<el-form ref="loginFormRef" :model="loginFrom" :rules="loginFromRules"  label-width="0px" class="login_form">
				<!-- 用户名 -->
			  <el-form-item prop="username">
			    <el-input v-model="loginFrom.username" prefix-icon="el-icon-user-solid"></el-input>
			  </el-form-item>
			  <!-- 密码 -->
			  <el-form-item prop="password">
			    <el-input type="password" v-model="loginFrom.password" prefix-icon="el-icon-lock"></el-input>
			  </el-form-item>
			  <!-- 按钮 -->
			  <el-form-item class="button">
			     <el-button type="primary" @click="login">登录</el-button>
			     <el-button type="info" @click="formRest" >重置</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loginFrom:{
					username:"zhangsan",
					password:"123456"
				},
				loginFromRules:{
					username:[
						 { required: true, message: '请输入用户名称', trigger: 'blur' },
						 { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			formRest(){
				this.$refs.loginFormRef.resetFields();
			},
			login() {
				this.$refs.loginFormRef.validate(valid =>{
					if(!valid){
						return;
					}else{
						this.$http.post('http://localhost:8866/login',this.$qs.stringify(this.loginFrom))
							.then(response =>{
								if(response.status==200){
									const tokenInfor = response.data.data.body;
									const access_token = tokenInfor.access_token;
									console.log(access_token)
									window.sessionStorage.setItem("token", access_token);
									this.$message.success("成功！")
									console.log(this.$route)
									this.$router.go(-1); // 登录成功后，返回上次进入的页面；
								}else{
									this.$message.error("失败！")
								}
							})
							.catch(function (error) { // 请求失败处理
								console.log(error);
							});
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped="scoped">  /* scoped 当前页面生效 */
   .login-container{
	   background-color: blueviolet;
	   height: 100%;
   }
   .login{
	   width: 450px;
	   height: 300px;
	   background-color: white;
	   border-radius: 3px;
	  /* 据中得css */
	   position: absolute;
	   left: 50%;
	   top: 50%;
	   transform: translate(-50%,-50%);
	   
	   .header{
		   height: 130px;
		   width: 130px;
		   border: 1px solid #eee;
		   border-radius: 50%;
		   padding: 10px;
		   box-shadow: 0 0 10px #ddd;
		   position: absolute;
		   left: 50%;
		   transform: translate(-50%,-50%);
		   background-color: #fff;
		   img{
			   width: 100%;
			   height: 100%;
			   border-radius: 50%;
			   background-color: #eee;
		   }
	   }
   }
   .button{
	   display: flex;
	   justify-content: flex-end;
   }
   .login_form{
	   position: absolute;
	   bottom: 0;
	   width: 100%;
	   padding: 0 20px;
	   box-sizing: border-box;
   }
</style>
