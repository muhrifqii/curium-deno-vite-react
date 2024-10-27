import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, Token, User } from '../../services/auth';
import { RootState } from '../../store';

type State = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
};

const initialState: State = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokenReceived(state, { payload }: PayloadAction<Token>) {
      console.log('tokenReceived', payload);
      state.accessToken = payload.access_token;
      state.refreshToken = payload.refresh_token;
      state.isLoggedIn = true;
    },
    loggedOut() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.user = payload.user;
        state.isLoggedIn = true;
      },
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.access_token;
        state.refreshToken = payload.refresh_token;
        state.isLoggedIn = true;
      },
    );
  },
});

export const { loggedOut } = authSlice.actions;
export default authSlice.reducer;

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
