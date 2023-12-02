import axios, { AxiosRequestConfig } from "axios";
import { RegisterUser } from "@/page/register/Register";
import { UpdatePassword } from "@/page/update_password/UpdatePassword";
import { UserInfo } from "@/page/update_info/UpdateInfo";
import { message } from "antd";
export const BASE_URL = 'http://localhost:3000/'
const axiosInstance = axios.create({
    baseURL: BASE_URL,
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
            if (config.url.includes('/user/refresh')) {
                queue.length = 0
                refreshing = false
                window.location.href = '/login';
                return
            }
            return new Promise((resolve) => {
                queue.push({
                    config,
                    resolve
                });
            });
        }
        if (data.message === 'fail' && typeof data.data === 'string') {
            if (!(data.code === 401 && localStorage.getItem('refresh_token'))) {
                message.error(data.data)
            }
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
            throw error;
        }
    }
)

async function refresh_token() {
    const res = await axiosInstance.get('/user/refresh', {
        params: {
          refresh_token: localStorage.getItem('refresh_token')
        }
    });
    localStorage.setItem('access_token', res.data.data.access_token || '');
    localStorage.setItem('refresh_token', res.data.data.refresh_token || '');
    return res;
}

export function login(username: string, password: string) {
    return axiosInstance.post('/user/login', {
        username, password
    });
}

export function registerCaptcha(email: string) {
    return axiosInstance.get('/user/register/verify_code', {
        params: {
            email
        }
    });
}

export function register(registerUser: RegisterUser) {
    return axiosInstance.post('/user/register', registerUser);
}

export function updatePasswordCaptcha(username: string) {
    return axiosInstance.get('/user/update_password/verify_code', {
        params: {
            username
        }
    });
}

export function updatePassword(data: UpdatePassword) {
    return axiosInstance.post('/user/update_password', data);
}

export function getUserInfo() {
    return axiosInstance.get('/user/info');
}

export function updateInfo(data: any) {
    return axiosInstance.post('/user/update', data);
}

export function updateUserInfoCaptcha() {
    return axiosInstance.get('/user/update/verify_code');
}

export function searchMeetingRoomList(name: string, capacity: number, equipment_ids: number[], offset: number, limit: number) {
    return  axiosInstance.get('/meeting-room/list', {
        params: {
            name,
            capacity,
            equipment_ids,
            offset,
            limit
        }
    });
}
export interface CreateBookingProps {
    start_time: number
    end_time: number
    remark?: string
}
export function createBooking(params: CreateBookingProps) {
    return axiosInstance.post('/booking', params)
}

export function getEquipments(include_used = false) {
    return axiosInstance.get('/equipment', {
        params: {
            include_used
        }
    });
}