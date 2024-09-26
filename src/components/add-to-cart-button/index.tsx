import { observer } from "mobx-react";
import { ProductButtonProps } from "../../models/Props";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import user from "../../store/userStore"
import { storageService } from "../../services/storageService";
import { AxiosResponse } from "axios";
import { addToCart, removeFromCart } from "../../store/redux/cart/redusers/CartReduser";
import { message } from "antd";
import { accountService } from "../../services/accountService";

export const CartButton: React.FC<ProductButtonProps> = observer(({ product, onChange = () => { } }) => {

    const dispatcher = useDispatch();
    useEffect(() => {
        setInCart(isInCart())
    }, [user.isAuthorized])

    const isInCart = (): boolean => {
        if (user.isAuthorized) {
            return product?.favoriteInUsers.includes(user.id || 0) || false;
        }
        else {
            if (storageService.isLocalCart() && product) {
                return storageService.getLocalCart().find(x=>x.product.id===product.id)!== undefined
            }
            else
                return false
        }
    }
    const [inCart, setInCart] = useState<boolean>(isInCart())
    const cartClick = async (e: any) => {
        e.stopPropagation();
        setInCart(!inCart)
        if (product) {
            if (user.isAuthorized) {
                let result: AxiosResponse<number, any> | undefined = undefined;
                if (inCart) {
                    result = await accountService.removeFavorite(product.id)
                }
                else {
                    result = await accountService.addFavorite(product.id)
                }
                if (result?.status !== 200) {
                    setInCart(!inCart)
                    return;
                }
            }
            else {
                 inCart? dispatcher(removeFromCart(product.id)): dispatcher(addToCart(product))
            }
        }
        onChange(product?.id, !inCart)
        message.success(inCart ? 'Продукт видалено з кошика' : 'Продукт додано до кошика')
    }
    return (
        <>
            {/* {inCart
                ? <HeartFilled className=' ms-3 fs-5 text-danger' onClick={favoriteClick} />
                : <HeartOutlined className=' ms-3 fs-5' onClick={favoriteClick} />} */}
        </>

    )
})
