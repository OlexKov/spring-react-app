import { Button, Image, message, Pagination, Space, Table, TableProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { ICategory } from '../../../models/Category';
import { useNavigate } from 'react-router-dom';
import { paginatorConfig } from '../../../helpers/constants';
import { APP_ENV } from '../../../env';
import { IProduct } from '../../../models/Product';
import { productService } from '../../../services/productService';
import { IProductImage } from '../../../models/ProductImage';
import { SearchData } from '../../../models/SearchData';


const imageFolder = `${APP_ENV.SERVER_HOST}${APP_ENV.IMAGES_FOLDER}`
const ProductTable: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IProduct[]>()
  const [search, setSearch] = useState<SearchData>({
    page: paginatorConfig.pagination.defaultCurrent,
    size: paginatorConfig.pagination.defaultPageSize,
    name: '',
    description: '',
    sort: 'id',
    category: ''
  })
  const [total, setTotal] = useState<number>(0)

  const columns: TableProps<IProduct>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (element: IProductImage[]) => <Image alt={`Image`} width={100} src={`${imageFolder}/150_${element.find(x => x.priority === 0)?.name}`} />
    },

    {
      title: 'Category',
      key: 'categoryName',
      dataIndex: 'categoryName',

    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },

    {
      title: 'Date',
      key: 'date',
      dataIndex: 'creationTime',
      render: (date: string) => <span> {date.slice(0, 10)}</span>,
      width: 110
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      render: (price: number) => <span> {price.toPrecision(4)}</span>
    },
    {
      title: 'Discount',
      key: 'discount',
      dataIndex: 'discount',
      render: (discount: number) => <span> {discount.toPrecision(4)}</span>
    },
    {
      title: 'Actions',
      key: 'action',
      render: (element: ICategory) =>
        <Space>
          <Button onClick={() => deleteCategory(element.id)} danger type="primary">Delete</Button>
          <Button onClick={() => navigate(`/create-product?id=${element.id}`)} type='primary'>Edit</Button>
        </Space>
    },
  ];

  useEffect(() => {
    (async () => { await getData() })()
  }, [search]);

  const getData = async () => {
    console.log(search)
    const result = await productService.search(search)
    if (result.status == 200) {
      setData(result.data.itemsList)
      setTotal(result.data.totalElements)
    }
  }

  const deleteCategory = async (id: number) => {
    const result = await productService.delete(id)
    if (result.status == 200) {
      const product = data?.find(x => x.id === id);
      message.success(`Product "${product?.name}" successfully deleted`)
      if (data?.length === 1 && search.page > 1) {
        const newPage = search.page;
        setSearch({ ...search, page: newPage })
      }
      else {
        await getData();
      }
    }
  }

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setSearch({ ...search, page: currentPage, size: pageSize })
    window.scrollTo(0, 0)
  }
  return (
    <div className=' mx-auto'  >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
      />
      {total > 0 &&
        <Pagination
          align="center"
          showSizeChanger
          showQuickJumper
          pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
          locale={paginatorConfig.pagination.locale}
          showTotal={paginatorConfig.pagination.showTotal}
          current={search.page}
          total={total}
          pageSize={search.size}
          onChange={onPaginationChange}
          className='mt-4' />
      }
    </div>
  )
}

export default ProductTable