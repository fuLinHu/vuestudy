import Vue from 'vue'
import App from './App.vue'

//import ElementUI from 'element-ui'; //全部导入
//以下是按照需要导入
import {Form,FormItem} from 'element-ui';
import {Input} from 'element-ui';
import {Button} from 'element-ui';
import {Message} from 'element-ui';



import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

import qs from 'qs';
Vue.prototype.$qs = qs;

import "./assets/css/gloable.css"

import axios from "axios"


//axios.defaults.baseURL = "http://localhost:8866/"
axios.defaults.timeout = 300000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config=>{
	//this.$router.push("/home");
	//debugger
	// const token = window.sessionStorage.getItem("token");
	// if(!token){
	// 	axios.push("/login");
	// }
	// console.log(config);
	return config;
},error=>{
	console.log(error);
})
Vue.prototype.$http = axios
Vue.prototype.$message = Message
//Vue.use(ElementUI)
//注册为全局可用的组件
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
