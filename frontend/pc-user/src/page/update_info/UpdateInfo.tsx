import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import './update_info.css';
import { BASE_URL, getUserInfo, updateInfo, updateUserInfoCaptcha } from '../../interface/interfaces';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import { HeadPicUpload } from './HeadPicUpload';

export interface UserInfo {
    avatar: string;
    nickname: string;
    email: string;
    verification_code: string;
}

const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export function UpdateInfo() {
    const [form] = useForm();
    const navigate = useNavigate();

    const onFinish = useCallback(async (values: UserInfo) => {
        const { avatar, ...rest} = values

        const data = new FormData()
        if (avatar instanceof File) data.append('avatar', avatar)
        for (const key in rest) {
            data.append(key, rest[key as keyof typeof rest])
        }
        const res = await updateInfo(data);
    
        if(res.status === 201 || res.status === 200) {
            const { message: msg, data} = res.data;
            if(msg === 'success') {
                message.success('用户信息更新成功');
                navigate('/')
            } else {
                message.error(data);
            }
        } else {
            message.error(res.data.data || '系统繁忙，请稍后再试');
        }
    }, []);

    const sendCaptcha = useCallback(async function () {
        const res = await updateUserInfoCaptcha();
        if(res.status === 201 || res.status === 200) {
            message.success(res.data.data);
        } else {
            message.error('系统繁忙，请稍后再试');
        }
    }, []);

    useEffect(() => {
        async function query() {
            const res = await getUserInfo();

            const { data } = res.data;
            const { avatar, nickname } = data

            if(res.status === 201 || res.status === 200) {
                
                if (avatar) form.setFieldValue('avatar', `${BASE_URL}${data.avatar}`);
                form.setFieldValue('nickname', nickname);
            }
        }
        query();
    }, []);

    return <div id="updateInfo-container">
        <Form
            form={form}
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="头像"
                name="avatar"
                shouldUpdate
            >
                <HeadPicUpload />
            </Form.Item>

            <Form.Item
                label="昵称"
                name="nickname"
                rules={[
                    { required: true, message: '请输入昵称!' },
                ]}
            >
                <Input />
            </Form.Item>


            <div className='captcha-wrapper'>
                <Form.Item
                    label="验证码"
                    name="verification_code"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary" onClick={sendCaptcha}>发送验证码</Button>
            </div>

            <Form.Item
                {...layout1}
                label=" "
            >
                <Button className='btn' type="primary" htmlType="submit">
                    修改
                </Button>
            </Form.Item>
        </Form>
    </div>   
}