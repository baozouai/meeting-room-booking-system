import { Form, Modal, DatePicker, Input, ModalProps } from "antd"
import { FC } from "react"
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Item } = Form
const { TextArea } = Input

export interface BookingModalValues {
  range_time: [Date, Date]
  remark?: string
}
export interface BookModalProps extends Pick<ModalProps, 'onCancel' | 'open'> {
  onOk: (values: BookingModalValues) => void
  onCancel: () => void
}
export const BookModal: FC<BookModalProps> = ({
  open,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm<BookingModalValues>()

  const _onOk = () => {
    form.validateFields().then(values => {
      onOk(values)
    })
  }
  return <Modal width={500} open={open} title='预定会议室' onOk={_onOk} onCancel={() => onCancel()}>
          <Form form={form} name='range_time'>
            <Item rules={[
              {
                required: true,
                message: '请选择时间范围'
              }
            ]} label='时间范围' name='range_time'>
                <RangePicker format='YYYY-MM-DD HH:mm' showTime={
                  {
                    minuteStep: 30
                  }
                } showSecond={false} disabledDate={(date) => {
                  return date <= dayjs()
                }}
                disabledTime={(current, type) => {
                  const numArr: number[] = []
                  if (type === 'start') {
                    // 如果是开始时间，禁用当前时刻之前的时间
                    return {
                      disabledHours: () => current && current.isSame(dayjs(), 'day') ? Array.from({ length: dayjs().hour()}).map((_, i) => i) : numArr,
                      disabledMinutes: () => current && current.isSame(dayjs(), 'hour') ? Array.from({ length: dayjs().minute()}).map((_, i) => i) : numArr,
                      disabledSeconds: () => current && current.isSame(dayjs(), 'minute') ? Array.from({ length: dayjs().second()}).map((_, i) => i) : numArr,
                    };
                  }
                  return {
                    disabledHours: () => numArr,
                    disabledMinutes: () => numArr,
                    disabledSeconds: () => numArr,
                  };
                }}
                />
            </Item>  
            <Item label='备注' name='remark'>
              <TextArea placeholder="请输入备注"/>
            </Item>
          </Form>
  </Modal>
}