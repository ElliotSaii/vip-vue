import axios from "axios";
import { message } from 'ant-design-vue'
import router from "@/router";

let BASEURL = '';
if (process.env.NODE_ENV == 'development') {
    BASEURL = '/';
}
else {
    BASEURL ='/';
}

let HTTP = axios.create({
    baseURL: BASEURL,
    headers: {
        Admin: 'kzieksikeiskkeiskeiksieiskeisiekiskeksie', 
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem('token')  || ''
    },
});

HTTP.interceptors.response.use(
    response => {
        return Promise.resolve(response.data);
    },
    error => {
        if (error.response.status == 403 ) {
            localStorage.removeItem("token")
            router.push("/login");
        } 

        // else if (error.response.status == 500) {
        //     router.push("/server-error")
        // }
            return Promise.reject(error);
        // return Promise.resolve(error.data);
    }
)

HTTP.interceptors.request.use(request => {
    return request;
}, function (error) {
    return Promise.reject(error);
});




export default HTTP;