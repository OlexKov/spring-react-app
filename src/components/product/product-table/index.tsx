import { Button, Divider, Image, Input, message, Pagination, Space, Table, TableColumnsType, TableColumnType, TableProps } from 'antd';
import React, { useEffect, useState } from 'react'
import { ICategory } from '../../../models/Category';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { paginatorConfig } from '../../../helpers/constants';
import { APP_ENV } from '../../../env';
import { IProduct } from '../../../models/Product';
import { productService } from '../../../services/productService';
import { IProductImage } from '../../../models/ProductImage';
import { SearchData } from '../../../models/SearchData';
import { categoryService } from '../../../services/categoryService';
import { SearchOutlined } from '@ant-design/icons';
import { getQueryString } from '../../../helpers/common-methods';
import { FilterData } from '../../../models/FilterData';
import { DeleteDialog } from '../../common-components/DeleteDialog';
import { DateTime } from '../../../helpers/DateTime';



const imageFolder = `${APP_ENV.SERVER_HOST}${APP_ENV.IMAGES_FOLDER}`
const ProductTable: React.FC = () => {
  const defaultSortTable = "id"
  const navigate = useNavigate();
  const [data, setData] = useState<IProduct[]>()
  const [filters, setFilters] = useState<FilterData[]>([])
  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useSearchParams('');
  const mainElement = document.querySelector('main') as HTMLElement;


  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<SearchData>({
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    name: searchParams.get("name") || '',
    description: searchParams.get("description") || '',
    sort: searchParams.get("sort") || defaultSortTable,
    categories: searchParams.get("categories") ? (JSON.parse(searchParams.get("categories") || "") as string[]) : undefined,
    sortDir: searchParams.get("sortDir") || ''
  })


  const getColumnSearchProps = (dataIndex: string): TableColumnType<IProduct> => ({
    filterDropdown: ({ close }) => (
      <div style={{ padding: 8 }} >
        <Input
          value={searchText}
          placeholder={`Search ${dataIndex}`}
          onPressEnter={() => handleSearch(dataIndex)}
          onChange={(e) => { setSearchText(e.target.value) }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilterDropdownOpenChange: (open: boolean) => {
      if (open) {
        dataIndex === "name" ? setSearchText(search.name) : setSearchText(search.description);
      }
    }

  });


  const columns: TableColumnsType<IProduct> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      filteredValue: null
    },
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (element: IProductImage[]) => <Image alt={`Image`} width={100} src={`${imageFolder}/150_${element.find(x => x.priority === 0)?.name}`} />,
      filteredValue: null
    },
    {
      title: 'Category',
      key: 'category.name',
      dataIndex: 'categoryName',
      showSorterTooltip: { target: 'full-header' },
      filterSearch: true,
      filters: filters,
      filteredValue: search.categories ? search.categories : filters.map(x => x.value),
      sorter: true
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      sorter: true,
      ...getColumnSearchProps('name'),
      filteredValue: null
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
      filteredValue: null
    },

    {
      title: 'Date',
      key: 'creationTime',
      dataIndex: 'creationTime',
      render: (date: string) =>
         <div className='d-flex flex-column gap-2 text-center'> {new DateTime(date).ShortDate} {new DateTime(date).FullTime}</div>,
      width: 110,
      sorter: true,
      filteredValue: null
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      render: (price: number) => <span> {price.toFixed(2)}</span>,
      sorter: true,
      filteredValue: null
    },
    {
      title: 'Discount',
      key: 'discount',
      dataIndex: 'discount',
      render: (discount: number) => <span> {discount.toFixed(2)}</span>,
      sorter: true,
      filteredValue: null
    },
    {
      title: 'Actions',
      key: 'action',
      render: (element: ICategory) =>
        <div className='d-flex gap-2'>
          <DeleteDialog title={"Are you sure?"}
            description={`Delete "${element.name}" category?`}
            onSubmit={async () => deleteProduct(element.id)} />
          <Button onClick={() => navigate(`create?id=${element.id}`)} type='primary'>Edit</Button>
        </div>
    },
  ];

  useEffect(() => {
    if (mainElement !== null) { mainElement.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [data])

  useEffect(() => {
    (async () => {
      const result = await categoryService.get(1, 0)
      if (result.status == 200) {
        const flt = result.data.itemsList.map(x => ({ value: x.name.toLocaleLowerCase(), text: x.name }))
        setFilters(flt);
        if (!search.categories) {
          setSearch({ ...search, categories: flt.map(x => x.value) })
        }
      }
    })()
  }, [])


  useEffect(() => {
    if (search.categories) {
      (async () => {
        setSearchParams(getQueryString(search))
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

  const deleteProduct = async (id: number): Promise<void> => {
    const result = await productService.delete(id)
    if (result.status == 200) {
      const product = data?.find(x => x.id === id);
      message.success(`Product "${product?.name}" successfully deleted`)
      if (data?.length === 1 && search.page > 1) {
        setSearch({ ...search, page: search.page - 1 })
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
        sortField = sorter[0].order ? sorter[0].columnKey : defaultSortTable;
      } else {
        sortDir = sorter.order;
        sortField = sorter.order ? sorter.columnKey : defaultSortTable;
      }
      setSearch({ ...search, sort: sortField, sortDir: sortDir })
    }
    else {
      setSearch({ ...search, page: 1, categories: filters["category.name"] ? filters["category.name"] as string[] : [] })
    }

  };

  const handleReset = (dataIndex: string) => {
    dataIndex === "name" ? setSearch({ ...search, name: '' }) : setSearch({ ...search, description: '' })
    setSearchText('');
  };

  const handleSearch = async (dataIndex: string) => {
    dataIndex === "name" ? setSearch({ ...search, page: 1, name: searchText }) : setSearch({ ...search, page: 1, description: searchText })
  };

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setSearch({ ...search, page: currentPage, size: pageSize })
  }

  return (

    <div className=' mx-auto w-75 '  >
      <div className='d-flex justify-content-between'>
        <h4 className='text-muted'>Product table</h4>
        <Link to={'create'}>
          <Button type="primary">Create new product</Button>
        </Link>
      </div>
      <Divider />
      <div className=' mx-auto'  >
        <div className=' mx-auto'  >
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            onChange={onChange}
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
      </div>
    </div>
  )
}

export default ProductTable