import { api } from './api';

export type Name = string;

export interface NamesResponse {
  page: number;
  size: number;
  total: number;
  total_pages: number;
  data: Name[];
}

export const namesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNames: build.query<NamesResponse, { page: number }>({
      query: ({ page = 1 }) => `/api/names?page=${page}`,
      providesTags: ['Names'],
    }),
  }),
});

export const { useGetNamesQuery } = namesApi;
