import * as React from 'react';
import { ProductViewProps } from '../../../../models/Props';
import { DateTime } from '../../../../helpers/DateTime';
import { APP_ENV } from '../../../../env';
import { Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FavoriteButton from '../../../favorite-button';

const imagesUrl = APP_ENV.SERVER_HOST + APP_ENV.IMAGES_FOLDER;
const HorisontalProduct: React.FC<ProductViewProps> = ({ product, onEdit, onClick = () => { }, onFavoriteChange = () => { } }) => {

  const date = new DateTime(product.creationTime);
  const firstImage = product.images.find(x => x.priority === 0)?.name
  const onCardEdit = (e: any) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(product.id)
    }
  }
  return (
    <div className='d-flex gap-2 bg-white p-2 product-view' onClick={() => onClick(product.id)}>
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
            <span className='fs-4' >{product.name}</span>
            <div style={{ marginBottom: 10 }} className='d-flex gap-0 flex-column'>
              <span style={{ fontSize: 19, fontWeight: 'bold' }}>{product.price === 0 ? 'Безкоштовно' : product.price.toFixed(2) + ' грн.'} </span>
            </div>
          </div>
          {product.discount > 0 &&
            <Tag style={{
              width: 'fit-content',
              fontSize: 16,
              fontWeight: 'lighter'
              , padding: "2px 5px 2px 5px",
              borderWidth: 0,
              backgroundColor: 'lightgreen'
            }}>-{product.discount.toFixed(2)} грн.</Tag>}

        </div>
        <div className='d-flex justify-content-between'>
          <div style={{ fontSize: 13 }} className='d-flex  gap-2 text-start mt-auto'>
            {date.isToday
              ? <span>Сьогодні о {date.Time}</span>
              : <span>{date.Date}</span>}
          </div>
          {onEdit
            ? <EditOutlined className='ms-3 fs-4 text-danger' onClick={onCardEdit} />
            : <FavoriteButton product={product} onChange={onFavoriteChange} />
          }
        </div>
      </div>
    </div>
)}

export default HorisontalProduct;


