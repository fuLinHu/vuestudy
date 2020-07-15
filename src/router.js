import Vue from 'vue' 
import Router from 'vue-router'
import Login from './components/Login.vue'
import HelloWorld from './components/HelloWorld'


Vue.use(Router)
 export default new Router({
	 routes:[
		 {
		 	 path:"/home",
		 	 name:HelloWorld
	    },
		{
			path:"/",
			redirect:"/login"
		},
		{
			path:"/login",
			component:Login
		}
	 ]
 })