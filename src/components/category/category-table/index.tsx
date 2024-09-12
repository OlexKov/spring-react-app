import { Button, Divider, Image, message, Pagination, Space, Table, TableProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { ICategory } from '../../models/ICategory';
import { Link, useNavigate } from 'react-router-dom';
import { paginatorConfig } from '../../../helpers/constants';
import { categoryService } from '../../../services/categoryService';
import { APP_ENV } from '../../../env';


const imageFolder = `${APP_ENV.SERVER_HOST}${APP_ENV.IMAGES_FOLDER}`
interface PagintionData {
  page: number,
  pageSize: number
}
const CategoryTable: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ICategory[]>()
  const [pagination, setPagination] = useState<PagintionData>({ page: 1, pageSize: paginatorConfig.pagination.defaultPageSize })
  const [total, setTotal] = useState<number>(0)

  const columns: TableProps<ICategory>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (element: ICategory) => <Image alt={`${imageFolder}/150_${element}`} width={100} src={`${imageFolder}/150_${element}`} />
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
      render: (date: string) => <span> {date.slice(0, 10)}</span>
    },
    {
      title: 'Actions',
      key: 'action',
      render: (element: ICategory) =>
        <Space>
          <Button onClick={() => deleteCategory(element.id)} danger type="primary">Delete</Button>
          <Button onClick={() => navigate(`/create?id=${element.id}`)} type='primary'>Edit</Button>
        </Space>
    },
  ];

  useEffect(() => {
    (async () => { await getData() })()
  }, [pagination]);

  const getData = async () => {
    const result = await categoryService.get(pagination.page, pagination.pageSize)
    if (result.status == 200) {
      console.log(result.data)
      setData(result.data.itemsList)
      setTotal(result.data.totalElements)
    }
  }

  const deleteCategory = async (id: number) => {
    const result = await categoryService.delete(id)
    if (result.status == 200) {
      const category = data?.find(x => x.id === id);
      message.success(`Category "${category?.name}" successfully deleted`)
      if (data?.length === 1 && pagination.page > 1) {
        const newPage = pagination.page - 1;
        setPagination({ ...pagination, page: newPage })
      }
      else{
        await getData();
      }
    }
  }

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setPagination({ ...pagination, page: currentPage, pageSize: pageSize })
    window.scrollTo(0, 0)
  }
  return (
    <div className=' mx-auto w-75 '  >
      <div className='d-flex justify-content-between'>
        <h4 className='text-muted'>Category table</h4>
        <Link to={'/create'}>
          <Button type="primary">Create new category</Button>
        </Link>
      </div>

      <Divider />
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
          current={pagination.page}
          total={total}
          pageSize={pagination.pageSize}
          onChange={onPaginationChange}
          className='mt-4' />
      }
    </div>
  )
}

export default CategoryTable