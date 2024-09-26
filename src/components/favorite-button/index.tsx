import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import user from '../../store/userStore'
import { message } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { ProductButtonProps } from '../../models/Props'
import { accountService } from '../../services/accountService';
import { storageService } from '../../services/storageService';


const FavoriteButton: React.FC<ProductButtonProps> = observer(({ product, onChange = () => { } }) => {
  
    useEffect(() => {
        setFavorite(isFavorite())
    }, [user.isAuthorized])

    const isFavorite = (): boolean => {
        if (user.isAuthorized) {
            return product?.favoriteInUsers.includes(user.id || 0) || false;
        }
        else {
            if (storageService.isLocalFavorites() && product) {
                return storageService.getLocalFavorites().includes(product.id)
            }
            else
                return false
        }
    }
    const [favorite, setFavorite] = useState<boolean>(isFavorite())
    const favoriteClick = async (e: any) => {
        e.stopPropagation();
        setFavorite(!favorite)
        if (product) {
            if (user.isAuthorized) {
                let result: AxiosResponse<number, any> | undefined = undefined;
                if (favorite) {
                    result = await accountService.removeFavorite(product.id)
                }
                else {
                    result = await accountService.addFavorite(product.id)
                }
                if (result?.status !== 200) {
                    setFavorite(!favorite)
                    return;
                }
            }
            else {
                storageService.toggleFavorites(product.id)
            }
            favorite ? user.favCount-- : user.favCount++;
        }
        onChange(product?.id, !favorite)
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
