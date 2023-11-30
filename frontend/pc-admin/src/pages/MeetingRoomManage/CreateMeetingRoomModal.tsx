import {  Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import { createMeetingRoom, getEquipments } from "../../interfaces/interfaces";

interface CreateMeetingRoomModalProps {
    isOpen: boolean;
    handleClose: () => void
}
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export interface CreateMeetingRoom {
    name: string;
    capacity: number;
    location: string;
    equipment_ids?: number[];
    description: string;
}

export function CreateMeetingRoomModal(props: CreateMeetingRoomModalProps) {

    const [form] = useForm<CreateMeetingRoom>();
    const [equipmentOptions, setEquipmentOptions] = useState<{label: string, value: number}[]>([])

    useEffect(() => {
        getEquipments().then(({data}) => {
            const equipments = data.data as {name: string, id: number}[]

           const newEquipmentOptions =  equipments.map(({name, id}) => {
                return {
                    label: name,
                    value: id
                }
            })

            setEquipmentOptions(newEquipmentOptions)
        })
    }, [])
    const handleOk = useCallback(async function() {
        const values = form.getFieldsValue();

        values.description = values.description || '';

        const res = await createMeetingRoom(values);

        if(res.status === 201 || res.status === 200) {
            message.success('创建成功');
            form.resetFields();
            props.handleClose();
        } else {
            message.error(res.data.data);
        }
    }, []);
    console.log(equipmentOptions)

    return <Modal title="创建会议室" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()} okText={'创建'}>
        <Form
            form={form}
            colon={false}
            {...layout}
        >
            <Form.Item
                label="会议室名称"
                name="name"
                rules={[
                    { required: true, message: '请输入会议室名称!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="位置"
                name="location"
                rules={[
                    { required: true, message: '请输入会议室位置!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="容纳人数"
                name="capacity"
                rules={[
                    { required: true, message: '请输入会议室容量!' },
                ]}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item
                label="设备"
                name="equipment_ids"
            >
                <Select showSearch mode="multiple" options={equipmentOptions} onChange={console.log}/>
            </Form.Item>
            <Form.Item
                label="描述"
                name="description"
            >
                <TextArea/>
            </Form.Item>
        </Form>
    </Modal>
}