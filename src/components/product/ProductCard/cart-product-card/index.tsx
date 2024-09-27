import * as React from 'react';
import { CartProductViewProps} from '../../../../models/Props';
import { DateTime } from '../../../../helpers/DateTime';
import { APP_ENV } from '../../../../env';
import { Tag } from 'antd';
import { CloseOutlined, MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';


const imagesUrl = APP_ENV.SERVER_HOST + APP_ENV.IMAGES_FOLDER;
const CartProductView: React.FC< CartProductViewProps> = ({ cartProduct, onDelete,  onCountChange }) => {

  const date = new DateTime(cartProduct.product.creationTime);
  const firstImage = cartProduct.product.images.find(x => x.priority === 0)?.name
  const onCardDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
        onDelete(cartProduct.product.id)
    }
  }

  const onCardCountCahnge = (e: any,count:number) => {
    e.stopPropagation();
    if (onCountChange) {
        if(count > 0){
            onCountChange(cartProduct.product.id,count)
        }
    }
  }
  
  return (
    <div  className='d-flex gap-2 bg-white p-2 product-view'>
      <img
        src={imagesUrl + "/150_" + firstImage}
        alt={firstImage}
        style={{
          objectFit: "cover",
          aspectRatio: "16/12",
          height: 180,
          borderRadius: 5
        }} />
      <div className='d-flex flex-column justify-content-between w-100 p-1'>
        <div className='d-flex flex-column gap-1'>
          <div className='d-flex justify-content-between'>
            <span className='fs-4' >{cartProduct.product.name}</span>
            <div style={{ marginBottom: 10 }} className='d-flex gap-0 flex-column'>
              <span style={{ fontSize: 19, fontWeight: 'bold' }}>{cartProduct.product.price === 0 ? 'Безкоштовно' : cartProduct.product.price.toFixed(2) + ' грн.'} </span>
            </div>
          </div>
          {cartProduct.product.discount > 0 &&
            <Tag style={{
              width: 'fit-content',
              fontSize: 16,
              fontWeight: 'lighter'
              , padding: "2px 5px 2px 5px",
              borderWidth: 0,
              backgroundColor: 'lightgreen'
            }}>-{cartProduct.product.discount.toFixed(2)} грн.</Tag>}

        </div>
        <div className='d-flex justify-content-between'>
          <div style={{ fontSize: 13 }} className='d-flex  gap-2 text-start mt-auto'>
            {date.isToday
              ? <span>Сьогодні о {date.Time}</span>
              : <span>{date.Date}</span>}
          </div>
          <div className='d-flex gap-4'>
            <PlusCircleOutlined className='text-success' onClick={(e)=>onCardCountCahnge(e,cartProduct.count+1)}/>
            <span>{cartProduct.count}</span>
            <MinusCircleOutlined className='text-danger' onClick={(e)=>onCardCountCahnge(e,cartProduct.count-1)}/>
          </div>
          <CloseOutlined  onClick={onCardDelete} />
        </div>
      </div>
    </div>
  )
}

export default CartProductView;


