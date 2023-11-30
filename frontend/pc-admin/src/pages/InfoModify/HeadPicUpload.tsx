import {  PlusOutlined } from "@ant-design/icons";
import {  Upload } from "antd";
import { useEffect, useState } from "react";

interface HeadPicUploadProps {
    value?: string;
    onChange?: (file: File) => void
}



const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function HeadPicUpload({ value, onChange }: HeadPicUploadProps) {
    const [avatarUrl, setAvatarUrl] = useState(value)
    useEffect(() => {
      if (value && !(value instanceof File)) {
        setAvatarUrl(value)
      }
    }, [value])

    const uploadButton = (
        <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
    <Upload
        name='avatar'
        accept=".png,.jpeg,.jpg,.gif"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={async (file) => {
            const url = await getBase64(file as unknown as File)
            setAvatarUrl(url);
            onChange && onChange(file)
            return false
        }}
  >
    { avatarUrl ? <img src={`${avatarUrl}`} alt="avatar" style={{ width: '90%' }} />: uploadButton}
  </Upload>)
}