import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect } from "react";
import { findMeetingRoom, updateMeetingRoom } from "../../interfaces/interfaces";
import { useGetEquipments } from "@/hooks";

interface UpdateMeetingRoomModalProps {
    id: number;
    isOpen: boolean;
    handleClose: () => void
    onOk: () => void
}
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

export interface UpdateMeetingRoom {
    id: number;
    name: string;
    capacity: number;
    location: string;
    equipment_ids: number[];
    description: string;
}

export function UpdateMeetingRoomModal({id, isOpen, handleClose, onOk}: UpdateMeetingRoomModalProps) {

    const [form] = useForm<UpdateMeetingRoom>();
    const [equipments, getEquipments] = useGetEquipments({include_used: true, meeting_room_id: id})

   

    useEffect(() => {
        if (isOpen) {
            getEquipments()
        }
    }, [isOpen, getEquipments])
    const handleOk = useCallback(async function() {
        const values = form.getFieldsValue();

        values.description = values.description || '';
        values.equipment_ids = values.equipment_ids || [];

        const res = await updateMeetingRoom({
            ...values,
            id: form.getFieldValue('id')
        });

        if(res.status === 201 || res.status === 200) {
            message.success('更新成功');
            handleClose();
            onOk()
        } else {
            message.error(res.data.data);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return
        async function query() {
            if(!id) {
                return;
            }
            const res = await findMeetingRoom(id);
            
            const { data } = res;
            if(res.status === 200 || res.status === 201) {
                form.setFieldValue('id', data.data.id);
                form.setFieldValue('name', data.data.name);
                form.setFieldValue('location', data.data.location);
                form.setFieldValue('capacity', data.data.capacity);
                form.setFieldValue('equipment_ids', data.data.equipments?.map(({ id }: { id: number}) => id));
                form.setFieldValue('description', data.data.description);
            } else {
                message.error(res.data.data);
            }
        }
        
        query();
    }, [id, isOpen]);

    return <Modal title="更新会议室" open={isOpen} onOk={handleOk} onCancel={() => handleClose()} okText={'更新'}>
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
                <Select mode='multiple' options={equipments}/>
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