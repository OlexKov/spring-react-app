/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, Form, Input, message, Modal, Space, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { categoryService } from '../../../services/categoryService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { APP_ENV } from '../../../env';

const CategoryCreation: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form] = useForm();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        const id = searchParams.get("id")
        if (id) {
            (async () => {
                const result = await categoryService.getById(Number(id))
                if (result.status === 200) {
                    form.setFieldsValue({
                        id: result.data.id,
                        name: result.data.name,
                        description: result.data.description,
                        file: [{
                            uid: '-1',
                            name: `Image`,
                            status: 'done',
                            url: `${APP_ENV.SERVER_HOST}${APP_ENV.IMAGES_FOLDER}/300_${result.data.image}`
                        }] 
                    })
                }
            })()
        }
    }, [])

    const layout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 24 },
    };


    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };


    const onFinish = async (formData: any) => {
        formData.file = formData.file[0].originFileObj
        let messagePart:string|undefined = undefined;
        if (!formData.id) {
            const result = await categoryService.create(formData);
            if (result.status == 200) {
                messagePart = 'added'
            }
        }
        else {
            const result = await categoryService.update(formData);
            if (result.status == 200) {
                messagePart = 'updated'
            }
        }
        if(messagePart){
            message.success(`Category ${formData.name} successfully ${messagePart}`)
            navigate(-1);
        }
    };

    return (
        <>
            <div className='w-75 mx-auto'>
                <h3>{searchParams.get("id") ? 'Edit' : 'New'} category</h3>
                <Divider />
                <Form
                    layout='vertical'
                    form={form}
                    name="nest-messages"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        label="Image"
                        valuePropName="fileList"
                        name="file"
                        getValueFromEvent={(e: UploadChangeParam) => {
                            if (Array.isArray(e)) {
                                return e;
                              }
                              return e && e.fileList;
                        }}
                        rules={[{ required: true }]}>
                        <Upload
                            listType="picture-card"
                            accept="image/png, image/jpeg, image/webp"
                            maxCount={1}
                            
                            beforeUpload={() => false}
                            onPreview={(file: UploadFile) => {
                                if (!file.url && !file.preview) {
                                    file.preview = URL.createObjectURL(file.originFileObj as RcFile);
                                }
                                setPreviewImage(file.url || (file.preview as string));
                                setPreviewOpen(true);
                                setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
                            }}
                        >
                            <button style={{ border: 0, padding: 0, background: 'transparent' }} type="button" />
                            <div className='d-flex flex-column align-items-center'>
                                <PlusOutlined />
                                <span>Upload</span>
                            </div>

                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name='name'
                        label="Name"
                        rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item hidden name='id'>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='description'
                        label="Description"
                        rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
                        <Space>
                            <Button type="default" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Space>

                    </Form.Item>
                </Form>
            </div>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>

    )
}

export default CategoryCreation