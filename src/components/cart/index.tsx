import * as React from 'react';
import user from '../../store/userStore'
import { observer } from 'mobx-react';
import { accountService } from '../../services/accountService';
import CartProductView from '../product/ProductCard/cart-product-card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/redux/cart';
import { CartProduct } from '../../models/CartProduct';
import { getTotalDiscount, getTotalPrice, removeFromCart, setCount } from '../../store/redux/cart/redusers/CartReduser';

const CartPage: React.FC = observer(() => {
    const cart: CartProduct[] = useSelector((state: RootState) => state.cartStore.cart);
    const totalPrice: number = useSelector((state: RootState) => getTotalPrice(state));
    const totalDiscount: number = useSelector((state: RootState) => getTotalDiscount(state));
    const dispatcher = useDispatch();

    const onCountChange = async (id: number, count: number) => {
        if (user.isAuthorized && !user.isAdmin) {
            await accountService.setCount(id, count)
        }
        dispatcher(setCount(({ id: id, count: count })))
    }

    const onCardDelete = async (id: number) => {
        if (user.isAuthorized && !user.isAdmin) {
            await accountService.removeFromCart(id)
        }
        dispatcher(removeFromCart(id));
    }

    return (
        <div className='w-75 d-flex flex-column  gap-3 mx-auto'>
            <h1 className=''>Cart page !!! </h1>
            <h3 className=' text-muted'>You have {cart.length} product{cart.length == 1 ? "" : "s"} in cart</h3>
            <div className='d-flex flex-column gap-3'>
                {cart?.map(x => <CartProductView cartProduct={x} onCountChange={onCountChange} onDelete={onCardDelete} />)}
            </div>
            {cart.length>0 &&
            <div style={{right:30}} className="d-flex flex-column gap-2 p-2 position-absolute border rounded-3  bg-danger-subtle shadow">
                <span className="text-danger fs-3">Total price: {totalPrice.toFixed(2)} .грн</span>
                <span className="text-success fs-3">Discount: {totalDiscount.toFixed(2)} .грн</span>
            </div>}
        </div>);
});

export default CartPage;