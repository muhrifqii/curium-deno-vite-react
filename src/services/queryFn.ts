import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  retry,
  FetchBaseQueryError,
  BaseQueryApi,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/env';
import { Mutex } from 'async-mutex';
import { RootState } from '../store';

const mutex = new Mutex();

const aBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// https://github.com/reduxjs/redux-toolkit/issues/2153
const retryWithRefreshToken = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
  resultError: FetchBaseQueryError,
) => {
  const rToken = (api.getState() as RootState).auth.refreshToken;
  if (!rToken) {
    retry.fail(resultError);
  }
  const refreshResult = await aBaseQuery(
    { url: '/refreshToken', method: 'POST' },
    api,
    extraOptions,
  );
  if (refreshResult.data) {
    // store the new token
    api.dispatch({ type: 'auth/tokenReceived', payload: refreshResult.data });
    // retry the initial query
    return await aBaseQuery(args, api, extraOptions);
  } else {
    // bail out of re-tries immediately if unauthorized
    api.dispatch({ type: 'auth/loggedOut' });
    retry.fail(resultError);
  }
};

const aBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await aBaseQuery(args, api, extraOptions);
  console.log('result', result);
  if (result.error?.status === 401) {
    // checking whether the mutex is locked or not
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await aBaseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        result = await retryWithRefreshToken(
          args,
          api,
          extraOptions,
          result.error,
        );
      } finally {
        // release must be called
        release();
      }
    }
  }
  return result;
};

export const baseQuery = retry(aBaseQueryWithReauth, {
  maxRetries: 3,
});
