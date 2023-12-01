import { Button, DatePicker, Form, Input, Popconfirm, Table, TimePicker, message } from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/es/form/Form";
import { apply, bookingList, reject, unbind } from "../../interfaces/interfaces";
import './booking_manage.css';
import { UserSearchResult } from "../UserManage/UserManage";
import { MeetingRoomSearchResult } from "../MeetingRoomManage/MeetingRoomManage";
import dayjs from "dayjs";
import { AxiosResponse } from "axios";

export enum BookingStatus {
    /** 申请中 */
    APPLYING = 1,
    /** 审批通过 */
    APPROVED,
    /** 审批驳回 */
    REJECTED,
    /** 已解除 */
    RELIEVED,
  }
export interface SearchBooking {
    username: string;
    meetingRoomName: string;
    meetingRoomPosition: string;
    rangeStartDate: Date;
    rangeStartTime: Date;
    rangeEndDate: Date;
    rangeEndTime: Date;
}

interface BookingSearchResult {
    id: number;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    note: string;
    create_time: string;
    update_time: string;
    user: UserSearchResult,
    meeting_room: MeetingRoomSearchResult
}

export function BookingManage() {
    const [offset, setPageNo] = useState<number>(1);
    const [limit, setPageSize] = useState<number>(10);
    const [bookingSearchResult, setBookingSearchResult] = useState<Array<BookingSearchResult>>([]);
    const [num, setNum] = useState(0);

    async function changeStatus(id: number, status: BookingStatus) {
        const methods: Record<BookingStatus, (id: number)=> Promise<AxiosResponse<any, any>>> = {
            [BookingStatus.APPROVED]: apply,
            [BookingStatus.REJECTED]:reject,
            [BookingStatus.RELIEVED]:unbind
        }
        const res = await methods[status](id);

        if(res.status === 201 || res.status === 200) {
            message.success('状态更新成功');
            setNum(Math.random());
        } else {
            message.error(res.data.data);
        }
    }

    const columns: ColumnsType<BookingSearchResult> = [
        {
            title: '会议室名称',
            dataIndex: 'room',
            render(_, record) {
                return record.meeting_room.name
            }
        },
        {
            title: '预定人',
            dataIndex: 'user',
            render(_, record) {
                return record.user.username
            }
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            render(_, record) {
                return dayjs(new Date(record.start_time)).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            render(_, record) {
                return dayjs(new Date(record.end_time)).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            onFilter: (value, record) => {
                return record.status === value
            },
            filters: [
                {
                    text: '申请中',
                    value: 1,
                },
                {
                  text: '审批通过',
                  value: 2,
                },
                {
                  text: '审批驳回',
                  value: 3,
                },
               
                {
                    text: '已解除',
                    value: 4
                },
              ],
              render: (_, record) => {
                return {
                    1: '申请中',
                    2: '审批通过',
                    3: '审批驳回',
                    4: '已解除',
                }[record.status]
              }
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render(_, record) {
                return dayjs(new Date(record.create_time)).format('YYYY-MM-DD hh:mm:ss')
            }
        },
        {
            title: '备注',
            dataIndex: 'remark'
        },
        {
            title: '描述',
            dataIndex: 'description'
        },
        {
            title: '操作',
            render: (_, record) => (
                <div>
                    <Popconfirm
                        title="通过申请"
                        description="确认通过吗？"
                        onConfirm={() => changeStatus(record.id, BookingStatus.APPROVED)}
                        okText="Yes"
                        cancelText="No"
                    >  
                        <a href="#">通过</a>
                    </Popconfirm>
                    <br/>
                    <Popconfirm
                        title="驳回申请"
                        description="确认驳回吗？"
                        onConfirm={() => changeStatus(record.id, BookingStatus.REJECTED)}
                        okText="Yes"
                        cancelText="No"
                    >  
                        <a href="#">驳回</a>
                    </Popconfirm>
                    <br/>
                    <Popconfirm
                        title="解除申请"
                        description="确认解除吗？"
                        onConfirm={() => changeStatus(record.id, BookingStatus.RELIEVED)}
                        okText="Yes"
                        cancelText="No"
                    >  
                        <a href="#">解除</a>
                    </Popconfirm>
                    <br/>
                </div>
            )
        }
    ];

    const searchBooking = async (values: SearchBooking) => {
        const res = await bookingList(values, offset, limit);

        const { data } = res.data;
        if(res.status === 201 || res.status === 200) {
            setBookingSearchResult(data.bookings.map((item: BookingSearchResult) => {
                return {
                    key: item.id,
                    ...item
                }
            }))
        } else {
            message.error(data || '系统繁忙，请稍后再试');
        }
    }

    const [form ]  = useForm();

    useEffect(() => {
        searchBooking({
            username: form.getFieldValue('username'),
            meetingRoomName: form.getFieldValue('meetingRoomName'),
            meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
            rangeStartDate: form.getFieldValue('rangeStartDate'),
            rangeStartTime: form.getFieldValue('rangeStartTime'),
            rangeEndDate: form.getFieldValue('rangeEndDate'),
            rangeEndTime: form.getFieldValue('rangeEndTime')
        });
    }, [offset, limit, num]);

    const changePage = function(offset: number, limit: number) {
        setPageNo(offset);
        setPageSize(limit);
    }

    return <div id="bookingManage-container">
        <div className="bookingManage-form">
            <Form
                form={form}
                onFinish={searchBooking}
                name="search"
                layout='inline'
                colon={false}
            >
                <Form.Item label="预定人" name="username">
                    <Input />
                </Form.Item>

                <Form.Item label="会议室名称" name="meetingRoomName">
                    <Input />
                </Form.Item>

                <Form.Item label="预定开始日期" name="rangeStartDate">
                    <DatePicker/>
                </Form.Item>

                <Form.Item label="预定开始时间" name="rangeStartTime">
                    <TimePicker  showSecond={false}/>
                </Form.Item>

                <Form.Item label="预定结束日期" name="rangeEndDate">
                    <DatePicker/>
                </Form.Item>

                <Form.Item label="预定结束时间" name="rangeEndTime">
                    <TimePicker showSecond={false}/>
                </Form.Item>

                <Form.Item label="位置" name="meetingRoomPosition">
                    <Input />
                </Form.Item>

                <Form.Item label=" ">
                    <Button type="primary" htmlType="submit">
                        搜索预定申请
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div className="bookingManage-table">
            <Table columns={columns} dataSource={bookingSearchResult} pagination={ {
                current: offset,
                pageSize: limit,
                onChange: changePage
            }}/>
        </div>
    </div>
}