import { configureStore } from '@reduxjs/toolkit';
import { isDev } from './utils/env';
import authReducer from './features/Auth/authSlice';
import { api } from './services/api';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: isDev,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
