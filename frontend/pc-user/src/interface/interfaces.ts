import axios, { AxiosRequestConfig } from "axios";
import { RegisterUser } from "@/page/register/Register";
import { UpdatePassword } from "@/page/update_password/UpdatePassword";
import { UserInfo } from "@/page/update_info/UpdateInfo";
import { message } from "antd";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 3000
});

axiosInstance.interceptors.request.use(function (config) {
    const access_token = localStorage.getItem('access_token');

    if(access_token) {
        config.headers.authorization = 'Bearer ' + access_token;
    }
    return config;
})

interface PendingTask {
    config: AxiosRequestConfig
    resolve: Function
  }
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { data, config } = error.response;

        if(refreshing) {
            return new Promise((resolve) => {
                queue.push({
                    config,
                    resolve
                });
            });
        }

        if (data.code === 401 && !config.url.includes('/user/refresh')) {
            
            refreshing = true;

            const res = await refresh_token();

            refreshing = false;

            if(res.status === 200) {

                queue.forEach(({config, resolve}) => {
                    resolve(axiosInstance(config))
                })

                return axiosInstance(config);
            } else {
                message.error(res.data);

                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
            
        } else {
            return error.response;
        }
    }
)

async function refresh_token() {
    const res = await axiosInstance.get('/user/refresh', {
        params: {
          refresh_token: localStorage.getItem('refresh_token')
        }
    });
    localStorage.setItem('access_token', res.data.access_token || '');
    localStorage.setItem('refresh_token', res.data.refresh_token || '');
    return res;
}

export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/login', {
        username, password
    });
}

export async function registerCaptcha(email: string) {
    return await axiosInstance.get('/user/register/verify_code', {
        params: {
            address: email
        }
    });
}

export async function register(registerUser: RegisterUser) {
    return await axiosInstance.post('/user/register', registerUser);
}

export async function updatePasswordCaptcha(username: string) {
    return await axiosInstance.get('/user/update_password/verify_code', {
        params: {
            username
        }
    });
}

export async function updatePassword(data: UpdatePassword) {
    return await axiosInstance.post('/user/update_password', data);
}

export async function getUserInfo() {
    return await axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
    return await axiosInstance.post('/user/update', data);
}

export async function updateUserInfoCaptcha() {
    return await axiosInstance.get('/user/update/verify_code');
}

export async function searchMeetingRoomList(name: string, capacity: number, equipment: string, offset: number, limit: number) {
    return await axiosInstance.get('/meeting-room/list', {
        params: {
            name,
            capacity,
            equipment,
            offset,
            limit
        }
    });
}