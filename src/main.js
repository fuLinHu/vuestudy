import Vue from 'vue'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css';

import router from './router'

import qs from 'qs';
Vue.prototype.$qs = qs;

import "./assets/css/gloable.css"

import axios from "axios"

//import ElementUI from 'element-ui'; //全部导入
//以下是按照需要导入
import {
	Form,
	FormItem,
	Input,
	Button,
	Message,
	Header,
	Aside,
	Main,
	Container,
	Menu,
	MenuItem,
	MenuItemGroup,
	Submenu,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Row,
	Col,
	Table,
	TableColumn,
	Switch,
	Tooltip,
	Pagination,
	Dialog,
	MessageBox,
	Tag,
	Tree,
	Select,
	Option
} from 'element-ui';
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
//Vue.use(ElementUI)
//注册为全局可用的组件
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)





	







axios.defaults.baseURL = "http://localhost:8866/"
axios.defaults.timeout = 300000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config => {
		config.headers.Authorization = "bearer " + window.sessionStorage.getItem("token");
		return config;
	},
	error => {
		console.log(error);
	})
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
	router, //挂在router实例对象   router:router
	render: h => h(App),
}).$mount('#app')
