import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './queryFn';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Names'],
  endpoints: () => ({}),
});
