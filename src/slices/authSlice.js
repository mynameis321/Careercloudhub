import { createSlice } from "@reduxjs/toolkit";

const initalState = {
    signupData: null,
    loading: false,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    tokenExpiry: localStorage.getItem("tokenExpiry") ? JSON.parse(localStorage.getItem("tokenExpiry")) : null
}

const authSlice = createSlice({
    name: "auth",
    initialState: initalState,
    reducers:{
        setSignupData(state, value) {
            // console.log(value.payload);
            state.signupData = value.payload;
            // console.log(state.signupData);
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state , value) {
            state.token = value.payload;
        },
        setTokenExpiry(state , value) {
            state.tokenExpiry = value.payload;
        }
    }
});

export const { setSignupData, setLoading, setToken, setTokenExpiry } = authSlice.actions;
export default authSlice.reducer;