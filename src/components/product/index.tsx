import { Button, Divider } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ProductTable from './product-table';

const ProductPage: React.FC = () => {

  return (
    <div className=' mx-auto w-75 '  >
      <div className='d-flex justify-content-between'>
        <h4 className='text-muted'>Product table</h4>
        <Link to={'/create-product'}>
          <Button type="primary">Create new product</Button>
        </Link>
      </div>
      <Divider />
      <ProductTable />

    </div>
  );

}


export default ProductPage;


