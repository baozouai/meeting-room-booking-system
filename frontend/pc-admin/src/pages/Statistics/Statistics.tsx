import { Button, DatePicker, Form, Select, message } from "antd";
import "./statistics.css";
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from "react";
import { meetingRoomUsedCount, userBookingCount } from "../../interfaces/interfaces";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "antd/es/form/Form";

interface UserBookingData {
    user_id: string;
    username: string;
    count: string;
}
interface MeetingRoomUsedData {
    meeting_room_name: string;
    meeting_room_id: number;
    count: string;
}

interface FormValues {
    start_date?: Dayjs
    end_date?: Dayjs
}

export function Statistics() {
    const [initValues] = useState(() => ({
        start_date: dayjs().startOf('month'),
        // end_date为月底
        end_date: dayjs().endOf('month')
    }))
    const [userBookingData, setUserBookingData] = useState<Array<UserBookingData>>();
    const [meetingRoomUsedData, setMeetingRoomUsedData] = useState<Array<MeetingRoomUsedData>>();
    const [chartType, setChartType] = useState<'pie' | 'bar'>('bar');
    const containerRef = useRef<HTMLDivElement>(null);
    const containerRefChart = useRef<echarts.ECharts>(null);
    const containerRef2 = useRef<HTMLDivElement>(null);
    const containerRef2Chart = useRef<echarts.ECharts>(null);
    const [form] = useForm<FormValues>();

    async function getStatisticData(values: FormValues) {
        const start_date = dayjs(values.start_date).format('YYYY-MM-DD');
        const end_date = dayjs(values.end_date).format('YYYY-MM-DD');

        const res = await userBookingCount(start_date, end_date);
        
        const { data } = res.data;
        if(res.status === 201 || res.status === 200) {
            setUserBookingData(data);
        } else {
            message.error(data || '系统繁忙，请稍后再试');
        }

        const res2 = await meetingRoomUsedCount(start_date, end_date);
        
        const { data: data2 } = res2.data;
        if(res2.status === 201 || res2.status === 200) {
            setMeetingRoomUsedData(data2);
        } else {
            message.error(data2 || '系统繁忙，请稍后再试');
        }
    }

    useEffect(() => {
        getStatisticData(initValues)
    }, [initValues])

    useEffect(() => {
        if (!containerRefChart.current) containerRefChart.current = echarts.init(containerRef.current);
        const myChart = containerRefChart.current!;
        if(!userBookingData) {
            return;
        }
        


        myChart.setOption({
            title: {
                text: '用户预定情况'
            },
            tooltip: {},
            xAxis: {
                data: userBookingData?.map(item => item.username)
            },
            yAxis: {},
            series: [
                {
                    name: '预定次数',
                    type: chartType,
                    data: userBookingData?.map(item => {
                        return {
                            name: item.username,
                            value: item.count
                        }
                    })
                }
            ]
        });
    }, [userBookingData, form, chartType]);

    useEffect(() => {
        if (!containerRef2Chart.current) containerRef2Chart.current = echarts.init(containerRef2.current);
        const myChart = containerRef2Chart.current!;

        if(!meetingRoomUsedData) {
            return;
        }
    
        myChart.setOption({
            title: {
                text: '会议室使用情况'
            },
            tooltip: {},
            xAxis: {
                data: meetingRoomUsedData?.map(item => item.meeting_room_name)
            },
            yAxis: {},
            series: [
                {
                    name: '使用次数',
                    type: chartType,
                    data: meetingRoomUsedData?.map(item => {
                        return {
                            name: item.meeting_room_name,
                            value: item.count
                        }
                    })
                }
            ]
        });
    }, [meetingRoomUsedData, form, chartType]);


    return <div id="statistics-container">
        <div className="statistics-form">
            <Form
                form={form}
                initialValues={initValues}
                onFinish={getStatisticData}
                name="search"
                layout='inline'
                colon={false}
            >
                <Form.Item label="开始日期" name="start_date">
                    <DatePicker />
                </Form.Item>

                <Form.Item label="结束日期" name="end_date">
                    <DatePicker />
                </Form.Item>

                <Form.Item label="图表类型" name="chartType" initialValue="bar">
                    <Select onChange={setChartType}>
                        <Select.Option value="pie">饼图</Select.Option>
                        <Select.Option value="bar">柱形图</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div className="statistics-chart" ref={containerRef}></div>
        <div className="statistics-chart" ref={containerRef2}></div>
    </div>
}