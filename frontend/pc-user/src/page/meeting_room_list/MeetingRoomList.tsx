import { Badge, Button, Form, Input, Select, Table, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import './meeting_room_list.css';
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { searchMeetingRoomList } from "../../interface/interfaces";
import { useGetEquipments } from "@/hooks";
import dayjs from 'dayjs'

interface SearchMeetingRoom {
    name: string;
    capacity: number;
    equipment_ids: number[];
}

interface MeetingRoomSearchResult {
    id: number,
    name: string;
    capacity: number;
    location: string;
    equipments: { name: string }[];
    description: string;
    booked: boolean;
    create_time: number;
    update_time: number;
}

export function MeetingRoomList() {
    const [offset, setoffset] = useState<number>(1);
    const [limit, setPageSize] = useState<number>(10);

    const [meetingRoomResult, setMeetingRoomResult] = useState<Array<MeetingRoomSearchResult>>([]);
    const [equipmentOptions] = useGetEquipments({
        include_used: true,
        requestFirst: true
    })
    const columns: ColumnsType<MeetingRoomSearchResult> = useMemo(() => [
        {
            title: '名称',
            dataIndex: 'name'
        },
        {
            title: '容纳人数',
            dataIndex: 'capacity',
        },
        {
            title: '位置',
            dataIndex: 'location'
        },
        {
            title: '设备',
            dataIndex: 'equipments',
            render(_, { equipments }) {
                return equipments?.map((item: { name: string }) => item.name).join('、');
            }
        },
        {
            title: '描述',
            dataIndex: 'description'
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            render(_, {create_time}) {
                return dayjs(create_time).format('YYYY-MM-DD HH:mm:ss')

            }
        },
        {
            title: '上次更新时间',
            dataIndex: 'update_time',
            render(_, {update_time}) {
                return dayjs(update_time).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '预定状态',
            dataIndex: 'booked',
            render: (_, record) => (
                record.booked ? <Badge status="error">已被预订</Badge> : <Badge status="success">可预定</Badge>
            )
        },
        {
            title: '操作',
            render: (_, record) => (
                <div>
                    <a href="#">预定</a>
                </div>
            )
        }
    ], []);

    const searchMeetingRoom = useCallback(async (values: SearchMeetingRoom) => {
        const res = await searchMeetingRoomList(values.name, values.capacity, values.equipment_ids, offset - 1, limit);

        const { data } = res.data;
        if(res.status === 201 || res.status === 200) {
            setMeetingRoomResult(data.meeting_rooms.map((item: MeetingRoomSearchResult) => {
                return {
                    key: item.id,
                    ...item
                }
            }))
        } else {
            message.error(data || '系统繁忙，请稍后再试');
        }
    }, []);

    const [form ]  = useForm();

    useEffect(() => {
        searchMeetingRoom({
            name: form.getFieldValue('name'),
            capacity: form.getFieldValue('capacity'),
            equipment_ids: form.getFieldValue('equipment')
        });
    }, [offset, limit]);

    const changePage = useCallback(function(offset: number, limit: number) {
        setoffset(offset);
        setPageSize(limit);
    }, []);

    return <div id="meetingRoomList-container">
        <div className="meetingRoomList-form">
            <Form
                form={form}
                onFinish={searchMeetingRoom}
                name="search"
                layout='inline'
                colon={false}
            >
                <Form.Item label="会议室名称" name="name">
                    <Input />
                </Form.Item>

                <Form.Item label="容纳人数" name="capacity">
                    <Input />
                </Form.Item>

                <Form.Item label="设备" name="equipment_ids">
                    <Select mode='multiple' options={equipmentOptions} style={{width: 140}}/>
                </Form.Item>

                <Form.Item label=" ">
                    <Button type="primary" htmlType="submit">
                        搜索会议室
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div className="meetingRoomList-table">
            <Table columns={columns} dataSource={meetingRoomResult} pagination={ {
                current: offset,
                pageSize: limit,
                onChange: changePage
            }}/>
        </div>
    </div>
}