import { Badge, Button, Form, Image, Input, Table, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import './UserManage.css';
import { ColumnsType } from "antd/es/table";
import { BASE_URL, changeFrozenStatus, userSearch } from "../../interfaces/interfaces";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";

interface SearchUser {
    username: string;
    nickname: string;
    email: string;
}

export interface UserSearchResult {
    id: number,
    username: string;
    nickname: string;
    email: string;
    avatar: string;
    create_time: Date;
    is_frozen: boolean;
}


export function UserManage() {
    const [offset, setPageNo] = useState<number>(1);
    const [limit, setPageSize] = useState<number>(10);
    const [userResult, setUserResult] = useState<UserSearchResult[]>();
    const [num, setNum] = useState(0);

    const columns: ColumnsType<UserSearchResult> = useMemo(() => [
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            render: value => {
                return value ? <Image
                        width={50}
                        src={`${BASE_URL}${value}`}
                /> : '';
            }
        },
        {
            title: '昵称',
            dataIndex: 'nickname'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render(value) {
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '状态',
            dataIndex: 'is_frozen',
            render: (_, record) => (
                record.is_frozen ? <Badge status="success">已冻结</Badge> : ''
            )
        },
        {
            title: '操作',
            render: (_, {
                is_frozen,
                id,
            }) => (
                <a href="#" onClick={() => {changeFrozen(id, !is_frozen)}}>{is_frozen ? '解冻': '冻结'}</a>
            )
        }
    ], []);
    
    const changeFrozen = useCallback(async (id: number, is_frozen: boolean) => {
        const res = await changeFrozenStatus(id, is_frozen);
    
        const { data } = res.data;
        if(res.status === 201 || res.status === 200) {
            message.success(is_frozen ? '冻结成功': '解冻成功');
            setNum(Math.random())
        } else {
            message.error(data || '系统繁忙，请稍后再试');
        }
    }, []);

    const searchUser = useCallback(async (values: SearchUser) => {
        const res = await userSearch(values.username,values.nickname, values.email,  offset - 1, limit);

        const { data } = res.data;
        if(res.status === 201 || res.status === 200) {
            setUserResult(data.users.map((item: UserSearchResult) => {
                return {
                    key: item.username,
                    ...item
                }
            }))
        } else {
            message.error(data || '系统繁忙，请稍后再试');
        }
    }, []);

    const [form ]  = useForm();

    useEffect(() => {
        searchUser({
            username: form.getFieldValue('username'),
            email: form.getFieldValue('email'),
            nickname: form.getFieldValue('nickname')
        });
    }, [offset, limit, num]);

    const changePage = useCallback(function(offset: number, limit: number) {
        setPageNo(offset);
        setPageSize(limit);
    }, []);


    return <div id="userManage-container">
        <div className="userManage-form">
            <Form
                form={form}
                onFinish={searchUser}
                name="search"
                layout='inline'
                colon={false}
            >
                <Form.Item label="用户名" name="username">
                    <Input />
                </Form.Item>

                <Form.Item label="昵称" name="nickname">
                    <Input />
                </Form.Item>

                <Form.Item label="邮箱" name="email" rules={[
                    { type: "email", message: '请输入合法邮箱地址!'}
                ]}>
                    <Input/>
                </Form.Item>

                <Form.Item label=" ">
                    <Button type="primary" htmlType="submit">
                        搜索用户
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div className="userManage-table">
            <Table columns={columns} dataSource={userResult} pagination={ {
                current: offset,
                limit: limit,
                onChange: changePage
            }}/>
        </div>
    </div>
}