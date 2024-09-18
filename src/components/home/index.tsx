import * as React from 'react';
import Product from '../product';
import { IProduct } from '../../models/Product';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';




const HomePage: React.FC = () => {
  const [data, setData] = useState<IProduct[]>()
  const [total, setTotal] = useState<number>(0)
  useEffect(() => {
    
      (async () => {
            await getData()
      })()
    
  }, []);

  const getData = async () => {
    const result = await productService.get(1,5)
    if (result.status == 200) {
      setData(result.data.itemsList)
      setTotal(result.data.totalElements)
    }
  }
  return (
  <>
  <h1>Welcome to home page !!! {total}</h1>
  <div className='mx-auto d-flex flex-column gap-4 w-75'>
   {
       data?.map(x=><Product product={x}/>)
   }
  </div>
  
  </>);
};

export default HomePage;
