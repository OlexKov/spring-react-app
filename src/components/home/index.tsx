import * as React from 'react';
import HorisontalProduct from '../product/ProductCard/horizontal-product';
import { IProduct } from '../../models/Product';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { Pagination } from 'antd';
import { paginatorConfig } from '../../helpers/constants';
import { SearchData } from '../../models/SearchData';
//import { FilterData } from '../../models/FilterData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getQueryString } from '../../helpers/common-methods';
import { categoryService } from '../../services/categoryService';
import user from '../../store/userStore'
import { observer } from 'mobx-react';



const HomePage: React.FC = observer(() => {
  const navigate = useNavigate();
  const defaultSortTable = "id"
  const [data, setData] = useState<IProduct[]>()
  const [total, setTotal] = useState<number>(0)
 // const [filters, setFilters] = useState<FilterData[]>([])
  //const [categorySearchText, setCategorySearchText] = useState('');
  const [searchParams, setSearchParams] = useSearchParams('');
  const mainElement = document.querySelector('main') as HTMLElement;
  const [search, setSearch] = useState<SearchData>({
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    name: searchParams.get("name") || '',
    description: searchParams.get("description") || '',
    sort: searchParams.get("sort") || defaultSortTable,
    categories: searchParams.get("categories") ? (JSON.parse(searchParams.get("categories") || "") as string[]) : undefined,
    sortDir: searchParams.get("sortDir") || ''
  })


  useEffect(() => {
    if (mainElement !== null) { mainElement.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [data])

  useEffect(() => {
    (async () => {
      const result = await categoryService.get(1, 0)
      if (result.status == 200) {
        const flt = result.data.itemsList.map(x => ({ value: x.name.toLocaleLowerCase(), text: x.name }))
        //setFilters(flt);
        if (!search.categories) {
          setSearch({ ...search, categories: flt.map(x => x.value) })
        }
      }
    })()},[])
  


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

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setSearch({ ...search, page: currentPage, size: pageSize })
  }

  return (
    <div className='w-75 f-flex flex-column gap-5  mx-auto'>
      <h1 className=''>Welcome to home page !!! </h1>
      <h3 className=' text-muted'>We found {total} product{total == 1 ? "" : "s"}</h3>
      <div className='d-flex flex-column gap-3'>
        { data?.map(x => <HorisontalProduct key={x.id} onEdit={user.isAdmin?()=>{navigate(`/products/create?id=${x.id}`)}:undefined} product={x} />)}
      </div>
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
    </div>);
});

export default HomePage;
