import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartProduct } from '../../../../models/CartProduct';
import { storageService } from '../../../../services/storageService';
import { IProduct } from '../../../../models/Product';
import { RootState } from '../index'
import user from '../../../userStore'

export interface CartProductData {
    id: number,
    count: number
}
const cart: CartProduct[] = storageService.getLocalCart();
const cartSlice = createSlice({
    name: 'cartProducts',
    initialState: {
        cart,
    },
    reducers: {
        addToCart: (state, action: PayloadAction<IProduct>) => {
            let product = state.cart.find(x => x.product.id === action.payload.id)
            if (product) {
                product.count++;
            }
            else {
                state.cart.push(({ product: action.payload, count: 1 }));
            }
           if(!user.isAuthorized){
               storageService.setLocalCart(state.cart);
           } 
        },
        addToCartAll: (state, action: PayloadAction<CartProduct[]>) => {
            state.cart = Array.from(new Set(action.payload));
           if(!user.isAuthorized){
               storageService.setLocalCart(state.cart);
           } 
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            let product = state.cart.find(x => x.product.id === action.payload)
            if (product) {
                state.cart = state.cart.filter(x => x.product.id !== action.payload);
                if(!user.isAuthorized){
                    storageService.setLocalCart(state.cart);
                } 
            }
        },
        setCount: (state, action: PayloadAction<CartProductData>) => {
            let bproduct = state.cart.find(x => x.product.id === action.payload.id);
            if (bproduct) {
                if (action.payload.count <= 0) {
                    state.cart = state.cart.filter(x => x.product.id !== action.payload.id);
                }
                else{
                    bproduct.count = action.payload.count;
                }
                if(!user.isAuthorized){
                    storageService.setLocalCart(state.cart);
                } 
            }
        },
        clearCart: (state) => {
            state.cart = [];
        }

    },

})
export const { addToCart, removeFromCart, setCount,addToCartAll,clearCart } = cartSlice.actions
export default cartSlice.reducer

export const getTotalPrice = (state: RootState) => {
    let total = 0;
    state.cartStore.cart.forEach(x => {
        total += (x.product.price - x.product.discount) * x.count
    })
    return total;
};
export const getTotalDiscount = (state: RootState) => {
    let total = 0;
    state.cartStore.cart.forEach(x => {
        total += x.product.discount * x.count
    })
    return total;
};