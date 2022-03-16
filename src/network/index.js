import Vue from 'vue'
import App from '../App'
import axios from 'axios'
import store from "../store";
import router from "../router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:8081';
//前置拦截，用来添加请求头
axios.interceptors.request.use(
    config => {
        //发起请求前携带token
        if (store.state.token) {
            config.headers['token'] = `${store.state.token}`
        }
        return config
    }
)

//后置拦截，用来全局处理异常
axios.interceptors.response.use(
    response => {
        let res = response.data
        if(res.code === 200) {
            return response
        } else {
            ElementUI.Message.error(response.data.msg)
            return Promise.reject(response.data.code)
        }
    },

    error => {
        if(error.response.data) {
            error.message = error.response.data.msg
        }
        if(error.response.status === 401) {
            store.commit("REMOVE_INFO");
            router.push({name: 'index'})
        }

        ElementUI.Message.error(error.message)
        return Promise.reject(error)
    }
)
