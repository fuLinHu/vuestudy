<template>
	<div class="login-container">
		<div class='login'>
			<div class="header">
				<img src="../assets/logo.png" />
			</div>
			<el-form  label-width="0px" class="login_form">
				<!-- 用户名 -->
			  <el-form-item>
			    <el-input></el-input>
			  </el-form-item>
			  <!-- 密码 -->
			  <el-form-item>
			    <el-input></el-input>
			  </el-form-item>
			  <!-- 按钮 -->
			  <el-form-item class="button">
			     <el-button type="primary">主要按钮</el-button>
			     <el-button type="info">信息按钮</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
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
