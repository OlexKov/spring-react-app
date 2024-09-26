import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BasketProduct } from '../../../../models/BasketProduct';
import { storageService } from '../../../../services/storageService';
import { IProduct } from '../../../../models/Product';
import { RootState } from '../index'

export interface BasketProductData {
    id: number,
    count: number
}
const basket: BasketProduct[] = storageService.getLocalBasket();
const basketSlice = createSlice({
    name: 'basketProducts',
    initialState: {
        basket,
    },
    reducers: {
        addToBasket: (state, action: PayloadAction<IProduct>) => {
            let product = state.basket.find(x => x.product.id === action.payload.id)
            if (product) {
                product.count++;
            }
            else {
                state.basket.push(({ product: action.payload, count: 1 }));
            }
            storageService.setLocalBasket(state.basket);
        },
        removeFromBasket: (state, action: PayloadAction<number>) => {
            let product = state.basket.find(x => x.product.id === action.payload)
            if (product) {
                state.basket = state.basket.filter(x => x.product.id !== action.payload);
                storageService.setLocalBasket(state.basket);
            }
        },
        setCount: (state, action: PayloadAction<BasketProductData>) => {
            let bproduct = state.basket.find(x => x.product.id === action.payload.id);
            if (bproduct) {
                if (action.payload.count <= 0) {
                    state.basket = state.basket.filter(x => x.product.id !== action.payload.id);
                }
                else{
                    bproduct.count = action.payload.count;
                }
                storageService.setLocalBasket(state.basket);
            }
        }
    },

})
export const { addToBasket, removeFromBasket, setCount } = basketSlice.actions
export default basketSlice.reducer

export const getTotalPrice = (state: RootState) => {
    let total = 0;
    state.backetStore.basket.forEach(x => {
        total += (x.product.price - x.product.discount) * x.count
    })
    return total;
};
export const getTotalDiscount = (state: RootState) => {
    let total = 0;
    state.backetStore.basket.forEach(x => {
        total += x.product.discount * x.count
    })
    return total;
};