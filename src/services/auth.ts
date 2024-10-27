import { api } from './api';

export interface User {
  username: string;
  full_name: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse extends Token {
  user: User;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      LoginResponse,
      { username: string; password: string }
    >({
      query: (credential) => ({
        url: '/login',
        method: 'POST',
        body: credential,
      }),
    }),
    refreshToken: build.mutation<Token, { refresh_token: string }>({
      query: ({ refresh_token }) => {
        return {
          url: '/refreshToken',
          method: 'POST',
          body: new URLSearchParams({ refresh_token }), // x-www-form-urlencoded
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
