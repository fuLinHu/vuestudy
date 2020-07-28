import Vue from 'vue' 
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/user.vue'
import Role from "./components/power/Role.vue"
import Permission from "./components/power/Permission.vue"

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const router = new Router({
	 routes:[
		 {
		 	 path:"/home",
		 	 component:Home,
			 redirect:"/welcome",
			 children:[
				 {
					 path:"/welcome",
					 component:Welcome
				 },
				 {
					 path:"/user",
					  component:User
				 },
				 {
					 path:"/role",
					 component:Role
				 },
				 {
					 path:"/permission",
					 component:Permission
				 }
			 ]
	    },
		{
			path:"/",
			redirect:"/home"
		},
		{
			path:"/login",
			component:Login
		}
	 ]
 })
 //挂在路由导航设置
 router.beforeEach((to,from,next)=>{
	 //to 将要访问的路径
	 // from 代表从 那个模块跳转过来
	 // next()  放行   next("/login") 强制跳转到login路径
	 if(to.path=="/login"){
		 return next();
	 }
	 const token = window.sessionStorage.getItem("token");
	 if(!token) next("/login")
	 next()
 })
 
 export default router;