import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    token: null,
};

export const userSlice = createSlice({
    initialState,
    name: "userSlice",
    reducers: {
        setUser(state, action){
            state.user = action.payload;
            state.token = action.payload.token;
        },
        setIsAuthenticated(state, action){
            state.isAuthenticated = action.payload;
        },
        clearUserState: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        setLoading(state, action){
            state.loading = action.payload;
        },
    },
});

export const { setIsAuthenticated, setUser, clearUserState, setLoading } = userSlice.actions;

export default userSlice.reducer;