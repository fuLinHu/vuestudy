import Vue from 'vue'
import App from './App.vue'

//import ElementUI from 'element-ui'; //全部导入
//以下是按照需要导入
import {Form,FormItem} from 'element-ui';
import {Input} from 'element-ui';
import {Button} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

import "./assets/css/gloable.css"



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
