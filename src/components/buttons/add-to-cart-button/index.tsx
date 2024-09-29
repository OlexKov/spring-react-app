import { observer } from "mobx-react";
import { ProductButtonProps } from "../../../models/Props";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import user from "../../../store/userStore"
import { AxiosResponse } from "axios";
import { addToCart, removeFromCart } from "../../../store/redux/cart/redusers/CartReduser";
import { Button, message } from "antd";
import { accountService } from "../../../services/accountService";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { CartProduct } from "../../../models/CartProduct";
import { RootState } from "../../../store/redux/cart";

export const CartButton: React.FC<ProductButtonProps> = observer(({ product, onChange = () => { }, hidden = false }) => {
    const cart: CartProduct[] = useSelector((state: RootState) => state.cartStore.cart);
    const dispatcher = useDispatch();
    const isInCart = (): boolean =>  cart.find(x=>x.product.id === product?.id) !== undefined;
    const [inCart, setInCart] = useState<boolean>(isInCart())
    useEffect(() => {
        setInCart(isInCart())
    }, [user.isAuthorized,cart])
    const cartClick = async (e: any) => {
        e.stopPropagation();
        setInCart(!inCart)
        if (product) {
            if (user.isAuthorized) {
                let result: AxiosResponse<number, any> | undefined = undefined;
                if (inCart) {
                    result = await accountService.removeFromCart(product.id)
                }
                else {
                    result = await accountService.addToCart(product.id)
                }
                if (result?.status !== 200) {
                    setInCart(!inCart)
                    return;
                }
            }
            inCart ? dispatcher(removeFromCart(product.id)) : dispatcher(addToCart(product))
        }
        onChange(product?.id, !inCart)
        message.success(inCart ? 'Продукт видалено з кошика' : 'Продукт додано до кошика')
    }
    return (
        <Button
            onClick={cartClick}
            icon={<ShoppingCartOutlined />}
            hidden={hidden}
        >
            {inCart ? "Видалити з корзини" : "Додати в корзину"}
        </Button>
    )
})
