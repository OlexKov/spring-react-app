import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, message, Select,  Spin,  type UploadFile } from 'antd';
import ImageUpload from '../../common-components/ImageUpload';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Error from '../../error'
import { IProduct } from '../../../models/Product';
import { productService } from '../../../services/productService';
import { IProductImage } from '../../../models/ProductImage';
import { APP_ENV } from '../../../env';
import { categoryService } from '../../../services/categoryService';
import { ICategory } from '../../../models/Category';
import { ProductCreationModel } from '../../../models/ProductCreationModel';
import './ProductCreate.css'


const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"))
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [publishing, setPublishing] = useState<boolean>(false)
  const [form] = Form.useForm();
  const [product, setProduct] = useState<IProduct>();
  const [categories, setCategories] = useState<ICategory[]>([])


  const imageFolder = `${APP_ENV.SERVER_HOST}${APP_ENV.IMAGES_FOLDER}`

  useEffect(() => {
    (async () => {
      const categories = await categoryService.get(1, 0);
      console.log(categories.data)
      if (categories.status === 200) {
        setCategories(categories.data.itemsList);
      }
      if (!isNaN(id) && id !== 0) {
        const result = await productService.getById(id);

        if (result.status === 200) {
          setProduct(result.data)
          setFiles(result.data.images
            .sort((a: IProductImage, b: IProductImage) => { return a.priority - b.priority })
            .map(x => ({ url: imageFolder + "/1200_" + x.name, originFileObj: new File([new Blob([''])], x.name, { type: 'old-image' }) }) as UploadFile))
        }
        else {
          setError(true)
        }
        

      } else if (id !== 0) {
        setError(true)
      }
      setLoading(false)

    })()
  }, []);

  useEffect(() => {
    if (id === 0 && product) {
      window.location.reload();
    }
  }, [id])


  const onFinish = async (product: ProductCreationModel) => {
    setPublishing(true);
    product.id = !isNaN(id) ? id : 0
    var formData = new FormData();
    Object.keys(product).forEach(function (key) {
      if (key === 'files') {
        product[key]?.forEach((x) => formData.append(key, x?.originFileObj as Blob))
      }
      else {
        var value = product[key as keyof ProductCreationModel];
        if (value) {
          if (typeof (value) !== 'string')
            formData.append(key, value.toString());
          else
            formData.append(key, value);
        }
      }
    });
    let actionStr = ''
    if (product.id === 0) {
      var create = await productService.create(formData)
      if (create.status === 200) {
        actionStr = 'created'
      }
    } else {
      var update = await productService.update(formData)
      if (update.status === 200) {
         actionStr = 'updated'
      }
    }
    if(actionStr !==''){
      message.success(`Product successfully ${actionStr}`);
      navigate(-1)
    }
    setPublishing(false);
  }



  return (
    <>
      <Spin spinning={loading} size='large' fullscreen />
      {!error && !loading &&
        <div className=' w-75 mx-auto d-flex flex-column align-items-start'>
          <h4 className='text-muted'>New product</h4>
          <Divider />
          <Form
            form={form}
            layout='vertical'
            initialValues={{
              name: product ? product.name : undefined,
              description: product ? product.description : undefined,
              price: product ? product.price : undefined,
              discount: product ? product.discount : undefined,
              files: files,
              categoryId: product ? product.categoryId : undefined
            }}
            onFinish={onFinish}
            className='w-100 my-4  text-start' >
            <Form.Item
              name="name"
              label={<h6>Name</h6>}
              hasFeedback
              rules={[
                {
                  pattern: RegExp('^[A-Z А-Я].*'),
                  message: "Заголовок повинен починатися з великої букви"
                },
                {
                  required: true,
                  message: "Не забудьте заповнити заголовок"
                },
                {
                  min: 16,
                  message: "Введіть щонайменше 16 символів"
                },
              ]}
            >
              <Input size='large' className='p-2 no-border no-border-container' placeholder="Наприклад,iPhone 11 з гарантією" showCount minLength={16} maxLength={500} />
            </Form.Item>
            <div className='w-100 d-flex gap-4 justify-content-between '>
              <Form.Item
                name='price'
                label="Price"
               
                rules={[
                  {
                    required: true,
                    message: "Не забудьте заповнити ціну"
                  }
                ]}>
                <InputNumber addonAfter="грн." size='large' />
              </Form.Item>
              <Form.Item
                name='discount'
                label="Discount"
                
                rules={[
                  {
                    required: true,
                    message: "Не забудьте заповнити ціну"
                  }
                ]}>
                <InputNumber addonAfter="грн." size='large' />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                className='flex-fill'
                rules={[
                  {
                    required: true,
                    message: 'Оберіть країну'
                  },
                ]}
              >
                <Select
                  placeholder="Category"
                  allowClear
                  size='large'
                  options={categories.map(x => ({ label: x.name, value: x.id }))}
                />
              </Form.Item>
            </div>

            <Form.Item
              name='description'
              label="Description"
              rules={[
                {
                  pattern: RegExp('^[A-Z А-Я].*'),
                  message: "Опис повинен починатися з великої букви"
                },
                {
                  required: true,
                  message: "Не забудьте заповнити опис"
                },
                {
                  min: 40,
                  message: "Введіть щонайменше 40 символів"
                },
              ]}>
              <TextArea
                showCount
                maxLength={9000}
                placeholder="Опис"
                style={{ height: 200, resize: 'none' }}
              />
            </Form.Item>


            <div className='white-container'>
              <Form.Item
                name='files'
                label="Photo"
                rules={[
                  {
                    required: true,
                    message: 'Оберіть як мінімум одине фото'
                  },
                ]}>
                <ImageUpload files={files} onChange={setFiles} />
              </Form.Item>
            </div>
            <div className='d-flex justify-content-end'>
              <Button loading={publishing} size='large' htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>}
      {!loading && error && <Error
        status="500"
        title="Упс...виникла помилка"
        subTitle="Помилка звантаження інформації"
      />}
    </>
  )
}

export default ProductCreate