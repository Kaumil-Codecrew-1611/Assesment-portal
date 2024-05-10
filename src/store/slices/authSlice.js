import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../axios/axiosInstance'
import { showToast } from "../../plugin/toastUtils";

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutUser: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logoutUser } = authSlice.actions;

export const loginAsync = (credentials) =>
    async (dispatch) => {
        dispatch(loginStart());
        try {
            const response = await axiosInstance.post(`/login`, {
                company_email: credentials.email,
                password: credentials.password,
            });
            const { data } = response;
            dispatch(loginSuccess(data))
        } catch (error) {
            dispatch(loginFailure(error.message));
            showToast(error.response.data.error, "error")
            throw error
        }
    };

export default authSlice.reducer;