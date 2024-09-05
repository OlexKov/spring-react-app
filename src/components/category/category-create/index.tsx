/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button,  Divider, Form, Input, message, Space, Upload } from 'antd'
import React, { useEffect} from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { categoryService } from '../../../services/categoryService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';

const CategoryCreation: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form] = useForm();
 
    useEffect(()=>{
        const id = searchParams.get("id")
         if(id){
            (async()=>{
                const result = await categoryService.getById(Number(id))
                if(result.status === 200){
                    form.setFieldsValue({
                        id:result.data.id,
                        name:result.data.name,
                        description:result.data.description,
                        file:[{
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: `${ import.meta.env.VITE_APP_SERVER_HOST}${ import.meta.env.VITE_APP_IMAGES_FOLDER}/300_${result.data.image}`}]
                    })
                }
            })()
        }
        
    },[])

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
        formData.file = formData.file[0].originFileObj;
        console.log(formData)
        if(!formData.id){
            const result = await categoryService.create(formData);
            if(result.status == 200){
                message.success(`Category ${formData.name} successfully added`)
                navigate(-1);
            }
        }
        else{
            const result = await categoryService.update(formData);
            if(result.status == 200){
                message.success(`Category ${formData.name} successfully updated`)
                navigate(-1);
            }
        }
        
    };

   
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    return (
        <>
            <div className='w-75 mx-auto'>
                <h3>{searchParams.get("id")?'Edit':'New'} category</h3>
                <Divider />
                <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    onFinish={onFinish}
                    className=' d-flex flex-column'
                    validateMessages={validateMessages}
                    
                >
                    <Form.Item
                        label="Image"
                        valuePropName="fileList"
                        name="file"
                        getValueFromEvent={normFile}
                        rules={[{ required: true }]}>
                        <Upload
                            listType="picture-card"
                            accept="image/png, image/jpeg, image/webp"
                            maxCount={1}
                        >
                            <button style={{ border: 0, padding: 0, background: 'transparent' }} type="button" />
                            <div className='d-flex flex-column align-items-center'>
                                <PlusOutlined />
                                <span>Upload</span>
                            </div>

                        </Upload>
                    </Form.Item>

                    <Form.Item name='name' label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item hidden name='id'>
                        <Input />
                    </Form.Item>

                    <Form.Item name='description' label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 20 }}>
                        <Space>
                            <Button type="default" onClick={()=>navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Space>

                    </Form.Item>
                </Form>
            </div>

        </>

    )
}

export default CategoryCreation