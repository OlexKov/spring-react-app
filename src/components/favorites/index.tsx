import * as React from 'react';
import HorisontalProduct from '../product/ProductCard/horizontal-product';
import { IProduct } from '../../models/Product';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { Pagination } from 'antd';
import { paginatorConfig } from '../../helpers/constants';
import { useSearchParams } from 'react-router-dom';
import { getQueryString } from '../../helpers/common-methods';
import user from '../../store/userStore'
import { observer } from 'mobx-react';
import { AxiosResponse } from 'axios';
import { IPaginationResponse } from '../../models/PaginarionResponse';
import { PagintionData } from '../../models/PaginationData';
import { storageService } from '../../services/storageService';
import { accountService } from '../../services/accountService';


const FavoritesPage: React.FC = observer(() => {
  const [data, setData] = useState<IProduct[]>()
  const [total, setTotal] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams('');
  const mainElement = document.querySelector('main') as HTMLElement;
  const [pagination, setPagination] = useState<PagintionData>({
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    pageSize: Number(searchParams.get("pageSize")) || paginatorConfig.pagination.defaultPageSize,
  })

  useEffect(() => {
    if (mainElement !== null) { mainElement.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [data])


  useEffect(() => {
    (async () => {
      setSearchParams(getQueryString(pagination))
      await getData()
    })()
  }, [pagination]);


  const getData = async () => {
    let result: AxiosResponse<IPaginationResponse<IProduct>, any> | undefined = undefined;
    if (user.isAuthorized) {
      result = await accountService.getFavorites(pagination.page, pagination.pageSize)
    }
    else if (storageService.isLocalFavorites()) {
      result = await productService.getByIds(pagination.page, pagination.pageSize, storageService.getLocalFavorites())
    }

    if (result?.status === 200) {
      setData(result.data.itemsList)
      setTotal(result.data.totalElements)
    }
  }

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setPagination({ ...pagination, page: currentPage, pageSize: pageSize })
  }

  const onFavoriteChange = async () => {
    if (data?.length === 1 && pagination.page > 1) {
      const newPage = pagination.page - 1;
      setPagination({ ...pagination, page: newPage })
    }
    else {
      await getData();
    }
  }

  return (
    <div className='w-75 f-flex flex-column gap-5  mx-auto'>
      <h1 className=''>Favorite product page !!! </h1>
      <h3 className=' text-muted'>We found {total} product{total == 1 ? "" : "s"}</h3>
      <div className='d-flex flex-column gap-3'>
        {data?.map(x => <HorisontalProduct key={x.id} onFavoriteChange={onFavoriteChange} product={x} />)}
      </div>
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
    </div>);
});

export default FavoritesPage;