import { message } from "antd";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { UserInfo } from "../pages/InfoModify/InfoModify";
import { UpdatePassword } from "../pages/PasswordModify/PasswordModify";
import { CreateMeetingRoom } from "../pages/MeetingRoomManage/CreateMeetingRoomModal";
import { UpdateMeetingRoom } from "../pages/MeetingRoomManage/UpdateMeetingRoomModal";
import { SearchBooking } from "../pages/BookingManage/BookingManage";
import dayjs from "dayjs";
export const BASE_URL = 'http://localhost:3000/'
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 3000
});

async function refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token')
    localStorage.removeItem('refresh_token')
    const res = await axiosInstance.get('/user/refresh', {
        params: {
          refresh_token
        }
    });
    localStorage.setItem('access_token', res.data.data.access_token);
    localStorage.setItem('refresh_token', res.data.data.refresh_token);
    return res;
}
axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');

    if(accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
})

interface PendingTask {
    config: AxiosRequestConfig
    // resolve: (config:AxiosRequestConfig) => Promise<AxiosResponse>
    resolve: (...args: any) => any
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

            const res = await refreshToken();

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



export async function login(username: string, password: string) {
    return axiosInstance.post('/user/login', {
        username, password, is_admin: true
    });
}

export async function userSearch(username: string, nickname: string, email: string, offset: number, limit: number) {
    return axiosInstance.get('/user/list', {
        params: {
            username,
            nickname,
            email,
            offset,
            limit
        }
    });
}

export async function changeFrozenStatus(user_id: number, is_frozen: boolean) {
    return axiosInstance.post('/user/change_frozen_status', {
            user_id,
            is_frozen,
    });
}

export async function getUserInfo() {
    return axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
    return axiosInstance.post('/user/update', data);
}

export async function updateUserInfoCaptcha() {
    return axiosInstance.get('/user/update/verify_code');
}

export async function updatePasswordCaptcha() {
    return axiosInstance.get('/user/update_password/admin/verify_code', {
    });
}

export async function updatePassword(data: UpdatePassword) {
    return axiosInstance.post('/user/update_password', data);
}

export async function meetingRoomList(name: string, capacity: number, equipment_ids: number[], offset: number, limit: number) {
    return axiosInstance.get('/meeting-room/list', {
        params: {
            name,
            capacity,
            equipment_ids,
            offset,
            limit
        }
    });
}

export async function deleteMeetingRoom(id: number) {
    return axiosInstance.get('/meeting-room/delete', {
        params: {
            id
        }
    });
}

export async function createMeetingRoom(meetingRoom: CreateMeetingRoom) {
    return axiosInstance.post('/meeting-room/create', meetingRoom);
}

export async function updateMeetingRoom(meetingRoom: UpdateMeetingRoom) {
    return axiosInstance.post('/meeting-room/update', meetingRoom);
}

export async function findMeetingRoom(id: number) {
    return axiosInstance.get('/meeting-room/' + id);
}

export async function bookingList(searchBooking: SearchBooking, offset: number, limit: number) {

    let bookingTimeRangeStart;
    let bookingTimeRangeEnd;

    if(searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
        const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD');
        const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm');
        bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf()
    }

    if(searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
        const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD');
        const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm');
        bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf()
    }

    return  axiosInstance.post('/booking/list', {
            booking_user: searchBooking.username,
            meeting_room_name: searchBooking.meetingRoomName,
            meeting_room_location: searchBooking.meetingRoomPosition,
            start_time: bookingTimeRangeStart,
            end_time: bookingTimeRangeEnd,
            offset: offset - 1,
            limit
    });
}

export async function getBooking(id: number) {
    return axiosInstance.get('/booking/get', {
        params: {
            id
        }
    })
}

export async function apply(id: number) {
    return axiosInstance.get('/booking/apply/' + id);
}

export async function reject(id: number) {
    return axiosInstance.get('/booking/reject/' + id);
}

export async function unbind(id: number) {
    return axiosInstance.get('/booking/unbind/' + id);
}

export async function meetingRoomUsedCount(startTime: string, endTime: string) {
    return axiosInstance.get('/statistic/meetingRoomUsedCount', {
        params: {
            startTime,
            endTime
        }
    });
}

export async function userBookingCount(startTime: string, endTime: string) {
    return axiosInstance.get('/statistic/userBookingCount', {
        params: {
            startTime,
            endTime
        }
    });
}

export async function getEquipments(include_used = false) {
    return axiosInstance.get('/equipment', {
        params: {
            include_used
        }
    });
}