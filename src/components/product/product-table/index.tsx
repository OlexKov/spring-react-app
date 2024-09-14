import { Button, Image, message, Pagination, Space, Table, TableColumnsType, TableProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { ICategory } from '../../../models/Category';
import { useNavigate } from 'react-router-dom';
import { paginatorConfig } from '../../../helpers/constants';
import { APP_ENV } from '../../../env';
import { IProduct } from '../../../models/Product';
import { productService } from '../../../services/productService';
import { IProductImage } from '../../../models/ProductImage';
import { SearchData } from '../../../models/SearchData';
import { categoryService } from '../../../services/categoryService';



interface filterData {
  text: string,
  value: string
}

const imageFolder = `${APP_ENV.SERVER_HOST}${APP_ENV.IMAGES_FOLDER}`
const ProductTable: React.FC = () => {
  const defaultSortTable = "id"
  const navigate = useNavigate();
  const [data, setData] = useState<IProduct[]>()
  const [filters, setFilters] = useState<filterData[]>([])
  const [search, setSearch] = useState<SearchData>({
    page: paginatorConfig.pagination.defaultCurrent,
    size: paginatorConfig.pagination.defaultPageSize,
    name: '',
    description: '',
    sort: defaultSortTable,
    categories: undefined,
    sortDir: ''
  })
  const [total, setTotal] = useState<number>(0)

  const columns: TableColumnsType<IProduct> = [
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
      key: 'category',
      dataIndex: 'categoryName',
      showSorterTooltip: { target: 'full-header' },
      filterSearch: true,
      filters: filters,
      filteredValue: search.categories?.length !== 0 ? search.categories : filters.map(x => x.value),
      sorter: true
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: true
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
      width: 110,
      sorter: true
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      render: (price: number) => <span> {price.toPrecision(4)}</span>,
      sorter: true
    },
    {
      title: 'Discount',
      key: 'discount',
      dataIndex: 'discount',
      render: (discount: number) => <span> {discount.toPrecision(4)}</span>,
      sorter: true
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
    (async () => {
      const result = await categoryService.get(1, 0)
      if (result.status == 200) {
        const flt = result.data.itemsList.map(x => ({ value: x.name.toLocaleLowerCase(), text: x.name }))
        setFilters(flt);
        setSearch({ ...search, categories: flt.map(x => x.value) })
      }
    })()
  }, [])


  useEffect(() => {
    if (search.categories) {
      (async () => {
        await getData()
      })()
    }
  }, [search]);

  const getData = async () => {
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

  const onChange: TableProps<IProduct>['onChange'] = (_pagination, filters, sorter, extra) => {
    if (extra.action === "sort") {
      let sortDir;
      let sortField;

      if (Array.isArray(sorter)) {
        sortDir = sorter[0].order;
        sortField =sorter[0].order? sorter[0].columnKey : defaultSortTable;
      } else {
        sortDir = sorter.order;
        sortField = sorter.order? sorter.columnKey : defaultSortTable;
      }
      
      setSearch({ ...search, sort: sortField, sortDir: sortDir })
    }
    else {
      setSearch({ ...search, categories: filters.category ? filters.category as string[] : [] })
    }

  };



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
        onChange={onChange}
        showSorterTooltip={{ target: 'sorter-icon' }}
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