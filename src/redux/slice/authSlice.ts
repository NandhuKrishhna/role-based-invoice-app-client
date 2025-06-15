import type { Auth_State, Auth_User } from "@/utils/types/auth.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";



const initialState: Auth_State = {
    currentUser: null,
};
export const authslice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Auth_User>) => {
            state.currentUser = action.payload;
        },
        setLogout: (state) => {
            state.currentUser = null;
        }
    },
});

export const { setCredentials, setLogout } = authslice.actions;

export default authslice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectCurrentToken = (state: RootState) => state.auth.currentUser?.accessToken;
