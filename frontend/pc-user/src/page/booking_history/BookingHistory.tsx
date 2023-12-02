import { BookingHistoryList } from '@/interface/interfaces'
import { Table, TableColumnType } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import './index.css'

interface Booking {
    id: number
    meeting_room: {
        name: string
    },
    start_time: number,
    end_time: number,
    remark?: string
}
interface HistoryBookResponse {
     bookings: Booking[]
    totalCount: number
}
export function BookingHistory() {
    const [{bookings, totalCount }, setHistoryList] = useState<HistoryBookResponse>({ bookings: [], totalCount: 0})
    const [pagination, setPagination] = useState(() => ({
        current: 1,
        pageSize: 1,
    }))
    const { current, pageSize } = pagination

    
    const getHistoryList = useCallback(() => {

        BookingHistoryList({
            offset: current - 1,
            limit: pageSize
        }).then(({ data }) => {
            const { bookings, totalCount } = data.data as{ bookings: Booking[], totalCount: number}
            setHistoryList({ bookings, totalCount })
        })
    }, [current, pageSize])

    useEffect(() => {
        getHistoryList()
    }, [pagination, getHistoryList])

    const columns: TableColumnType<Booking>[] = [
        {
            title: '会议室名称',
            dataIndex: 'meeting_room',
            render(_, { meeting_room}) {
                return meeting_room.name
            }
        },
        {
            title: '开始时间',
            dataIndex: 'start_time',
            width: 200,
            render(_, record) {
                return dayjs(new Date(record.start_time)).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '结束时间',
            dataIndex: 'end_time',
            width: 200,
            render(_, record) {
                return dayjs(new Date(record.end_time)).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '备注',
            width: 300,
            dataIndex: 'remark'
        },
    ]
    const changePage = useCallback(function(current: number, pageSize: number) {
        setPagination({
            current,
            pageSize
        })
    }, []);
    return (
        <div className='BookingHistory'>
            <Table size='large' rowKey='id'  columns={columns} dataSource={bookings} pagination={ {
                current,
                pageSize,
                onChange: changePage,
                total: totalCount,
            }}/>
        </div>
    )
}