import * as React from 'react';
import { SmallCartProductProps } from '../../../../models/Props';
import { APP_ENV } from '../../../../env';
import { CloseCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

const imagesUrl = APP_ENV.SERVER_HOST + APP_ENV.IMAGES_FOLDER;

export const SmallCartProduct: React.FC<SmallCartProductProps> = ({ cartProduct, onCountClick = () => { } }) => {
  const firstImage = cartProduct.product.images.find(x => x.priority === 0)?.name;
  return (
    <div className='d-flex gap-3'>
      <img
        src={imagesUrl + "/150_" + firstImage}
        alt={firstImage}
        style={{
          objectFit: "cover",
          aspectRatio: "16/12",
          height: 48,
          borderRadius: 2
        }} />
      <div className='d-flex flex-column gap-1 w-100'>
        <span className=' fs-6 text-muted'>{cartProduct.product.name}</span>
        <div className='d-flex  justify-content-between '>
          <span>{cartProduct.product.price.toFixed(2)} .грн</span>
          <div className='d-flex gap-2'>
            <PlusCircleOutlined className='text-success' onClick={() => onCountClick(cartProduct.count + 1, cartProduct.product.id)} />
            <span>{cartProduct.count}</span>
            {cartProduct.count == 1
              ? <CloseCircleOutlined className='text-danger' onClick={() => onCountClick(0, cartProduct.product.id)} />
              : <MinusCircleOutlined className='text-danger' onClick={() => onCountClick(cartProduct.count - 1, cartProduct.product.id)} />}
          </div>
        </div>
      </div>
    </div>
  );
}
