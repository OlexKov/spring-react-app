
import React, { useEffect, useState } from 'react'
import user from '../../store/userStore'
//import { accountService } from '../../services/accountService'
import { message } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { FavoriteButtonProps } from '../../models/Props'

const FavoriteButton: React.FC<FavoriteButtonProps> = observer(({ product, onChange = () => { } }) => {
    const [favorite, setFavorite] = useState<boolean>(false)

    useEffect(() => {
        if (user.isAuthorized) {
          //  setFavorite(product?.isFavorite || false);
        }
        else {
          //  if (storageService.isLocalFavorites() && product) {
          //      setFavorite(storageService.getLocalFavorites().find(x=>x.id === product.id) !== undefined)
           // }
           // else
           //     setFavorite(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.isAuthorized, product])

    const favoriteClick = async (e: any) => {
        e.stopPropagation();
        setFavorite(!favorite)
        if (product) {
            if (user.isAuthorized) {
               // const result = await accountService.toggleFavorite(product.id)
               // if (result.status !== 200) {
              //      setFavorite(!favorite)
              //      return
              //  }
            }
            else {
               // storageService.toggleFavorites(({id:product.id,price:product.price,date:product.date}))
            }
        }
        onChange(product?.id,!favorite)
        message.success(favorite ? 'Оголошення видалено з обраних' : 'Оголошення додано до обраних')
    }
    return (
        <>
            {favorite
                ? <HeartFilled className=' ms-3 fs-5 text-danger' onClick={favoriteClick} />
                : <HeartOutlined className=' ms-3 fs-5' onClick={favoriteClick} />}
        </>

    )
})

export default FavoriteButton
