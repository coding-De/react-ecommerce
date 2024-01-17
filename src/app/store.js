import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import productReducer from '../features/product-list/productListSlice';
import authReducer from '../features/auth/AuthSlice'
import cartReducer from '../features/Cart/EcomCartSlice'
import userReducer from '../features/user/userSlice'
import orderReducer from '../features/order/orderSlice'
export const store = configureStore({
  reducer: {
    product: productReducer,
    auth:authReducer,
    cart:cartReducer,
    order: orderReducer,
    user: userReducer,
  },
  middleware: [
    ...getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['product/fetchCategory/fulfilled'],
            ignoredPaths: ['cart']
        }
    }),
],
});
