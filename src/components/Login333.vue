<template>
  <div class="total_div">
    <div class="imgs_div">
      <div class="left" style="width: 490px;">
        <img class="left_img" src="../../assets/img/login_l.png">
      </div>
      <div class="right">
        <div class="user_pwd">
          <div class="tab">
              <span class="tab_span active">Smart.KE</span>
              <!--<span class="tab_span">企业用户入口</span>-->
          </div>
          <div class="con smartke show">
              <el-form ref="userFormRef" style="margin-top: 20px;" :rules="rules" :model="userForm">
                <el-form-item prop="username">
                  <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" clearable v-model="userForm.username" @clear="clearUsername"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input placeholder="请输入密码" prefix-icon="el-icon-unlock" show-password v-model="userForm.password"></el-input>
                </el-form-item>
              </el-form>
              <div>
                  <a class="zca" @click="register" style="text-decoration:none;cursor: pointer;">
                    <span style="color: #999999">暂无账号</span>
                    <span class="zc">注册</span>
                  </a>
                  <p class="forgetpwd" style="margin-top: 0px; left: -16px;" @click="forgetPwd">忘记密码</p>
              </div>
              <button type="submit" class="login_btn" @click="login">登录</button>
          </div>
          <div class="con enterprise">
              <div class="qy_wrap">
                  <img src="../../assets/img/qyImg.png">
              </div>
          </div>
      </div>
      </div>
      <div class="copyright">
        <span>copyright@2019北明智通（北京）科技有限公司AII Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  created() {
    console.info(this.$route.name);
  },
  data(){
    return {
      userForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    //登录
    login(){
      this.$refs.userFormRef.validate(valid => {
        if(!valid) return;
        this.$axios.post('/authorization/login', this.$qs.stringify(this.userForm)
        ).then(respose => {
            let loginResult = respose.data;
            if(loginResult.loginSuccess){ //登录成功
              this.$axios.post('/authorization/oauth/token', this.$qs.stringify({
                username: this.userForm.username,
                password: this.userForm.password,
                client_id: "vue-cli",
                client_secret: "vue-cli79bf0a19f46b47d99526177a54c1e663",
                grant_type: "password"
              })).then(respose => {
                var access_token = respose.data.access_token;
                if(access_token){
                  window.sessionStorage.setItem("token", access_token);
                  //获取用户权限信息
                  this.$axios.get("/authorization/oauth/user").then(response => {
                    const result = response.data;
                    if(!result.error){
                      window.sessionStorage.setItem("permissions", result.permissions);
                      window.sessionStorage.setItem("username", result.username);
                      window.sessionStorage.setItem("realName", result.realName);
                      window.sessionStorage.setItem("userAccountId", result.userAccountId);
                      //保存登录日志
                      this.$axios.get("/auth/processLogin/successLogin?userAccountId=" + result.userAccountId)
                      .then(response => {
                      }).catch(error => {console.info(error)})
                      this.$router.push(window.sessionStorage.getItem("activePath") || "/home");
                    }else{
                      this.$message.error(result.error);
                      this.$router.push("/login");
                    }
                  }).catch(error => {console.info(error)})
                }
              }).catch(error => {console.info(error)})
            }else{  //登录失败
              let code = loginResult.code;
              if(code == 1){
                this.$message.warning("用户名不存在");
                this.userForm.username = "";
                this.userForm.password = "";
              }else if(code == 2){
                this.$message.warning("密码不正确");
                this.userForm.password = "";
              }else if(code == 3){
                this.$message.warning("密码输入错误次数过多");
                this.userForm.password = "";
              }
            }
        }).catch(error => {
           console.log(error)
        });
      });
    },
    //注册
    register(){
      //跳转到注册页面
      this.$router.push("/register");
    },
    //忘记密码
    forgetPwd(){
      this.$router.push("/forgetPwd");
    },
    clearUsername(){
      this.userForm = {
        username: "",
        password: ""
      }
    }
  }
}
</script>

<style>
  .total_div{
    background: url(../../assets/img/login_bg.png)no-repeat;
    background-size: cover;
    overflow: hidden;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: "Microsoft Yahei"!important;
  }
  input,button{
    outline: none;
    border: none;
  }
  .imgs_div{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 845px;
  }
  .left{
    width: 490px;
    height: 370px;
    position: relative;
    top: 40px;
  }
  .left_img{
    width: 100%;
  }
  .right{
    width: 467px;
    height: 300px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(238,238,238,1);
    position: absolute;
    left: 345px;
    top: 70px;
    z-index: -1;
  }

  /*é§è¯²ç¶æ¤¤ç”¸æ½°*/
  .user_pwd{
    width: 300px;
    min-height: 200px;
    margin-left: 133px;
    margin-top: 33px;
  }
  .tab{
    border-bottom: 1px solid #eee;
  }
  .tab span{
    display: inline-block;
    width: 147px;
    color: #666;
    text-align: center;
    line-height: 30px;
    border-bottom: 1px solid transparent;
  }
  .active{
    color: #50A1FF !important;
    border-bottom: 1px solid #50A1FF!important;
  }
  .tab_span:hover{
    color: #50A1FF;
    border-bottom: 1px solid #50A1FF;
    cursor: pointer;
  }
  .username, .passwd{
    width: 220px;
    height: 20px;
    padding: 0 10px;
    float: right;
    border: none;
    position: relative;
    top: 9px;
    left: -10px;
    border-left: 1px solid #50A1FF;
  }
  .uername_div{
    margin-top: 20px;
  }
  .passwd{
    padding-right: 43px;
    width: 223px;
    left: -7px;
  }
  .pwd_div{
    margin: 20px 0;
  }
  .smartke_div{
    position: relative;
    width: 300px;
    height: 38px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(80,161,255,0.5);
    border-radius:19px;
    border:1px solid rgba(80,161,255,1);
  }
  .uimg{
    width: 20px;
    position: absolute;
    top: 9px;
    left: 20px;
  }
  .mImg{
    width: 20px;
    /* float: right; */
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
  }
  .con{
    display: none;
  }
  .show{
    display: block;
  }
  .copyright{
    position: absolute;
    left: 200px;
    top: 402px;
  }
  .copyright span{
    color: #fff;
  }
  .forgetpwd{
    color: #999;
    margin: 0 0 18px 0;
    position: relative;
    left: -16px;
    cursor: pointer;
    display: inline-block;
    float: right;
  }
  .login_btn{
    margin: 0 auto;
    width:200px;
    height:38px;
    background:rgba(80,161,255,1);
    border-radius:19px;
    color: #fff;
    text-align: center;
    line-height: 38px;
    margin-left: 50px;
    cursor: pointer;
  }
  /*æµ¼ä½·ç¬Ÿ*/
  .qy_wrap{
    width:100px;
    height:100px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 10px 0px rgba(80,161,255,0.3);
    border-radius:2px;
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(0,-50%);
    cursor: pointer;
  }
  .qy_wrap img{
    width: 90px;
    padding: 5px;
  }

  /*è¹‡æ¨¿î†‡ç€µå—™çˆœ1*/
  .forgetpwd_wrap{
    width: 775px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .forget1Img{
    width: 100%;
  }
  .forgetpwd_inner{
    margin-top: 20px;
    min-height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .yztgImg{
    width: 12px;
    position: absolute;
    right: -30px;
    top: 12px;
  }
  /*ç€µå—™çˆœæ©æ¶˜å®³é‰ï¿½*/
  .progressbar{
    display: flex;
    align-items: center;
  }
  .circle1, .circle2, .circle3{
    display: inline-block;
    width:16px;
    height:16px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 4px 0px rgba(0,0,0,0.1);
    border:4px solid rgba(204,204,204,1);
    border-radius: 100%;
  }
  .circle1,.circle2{
    border:4px solid #50A1FF;
  }
  .line1,.line2,.line3{
    display: inline-block;
    width:179px;
    height:4px;
    background:rgba(80,161,255,0.2);
  }
  .line1{
    background: #50A1FF;
  }
  .progressbar div{
    display: inline-block;
  }
  .circle_text{
    display: block;
    font-size: 12px;
    color: #666;
    position: absolute;
    margin-left: -20px;
    width: 65px;
    text-align: center;
  }
  .forget_user1{
    margin: 50px auto 20px auto;
  }
  .submit_btn{
    display: block;
    width:200px;
    height:38px;
    line-height: 38px;
    background:rgba(80,161,255,1);
    border-radius:19px;
    color: #fff;
    margin: 0 auto 20px auto;
    cursor: pointer;
  }
  .cancel_btn{
    display: block;
    width:200px;
    height:38px;
    line-height: 38px;
    border:1px solid rgba(80,161,255,1);
    border-radius:19px;
    color: #50A1FF;
    background: #fff;
    margin: 0 auto;
    cursor: pointer;
  }


  /*è¹‡æ¨¿î†‡ç€µå—™çˆœ2*/
  .js{
    width: 320px;
    color: #333;
    margin: 0 auto;
    margin-top: 75px;
    line-height: 28px;
  }

  span.error{
    color: red;
  }

  div.error{
    border-color: red;
  }
  ::-ms-clear, ::-ms-reveal{
    display: none;
  }
  .zc{
    color: #50A1FF
  }
  .zca:hover .zc{
    color: #68C9D1;
  }
</style>
