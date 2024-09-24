import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { userApi } from "./userApi";
import { BASE_URL } from "./constant";
import { setIsAuthenticated, setUser, clearUserState } from "../features/userSlice";
import { redirect } from 'react-router-dom'; // Pour rediriger l'utilisateur
import toast from "react-hot-toast";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL,

        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const token = state?.user?.token || localStorage.getItem('token'); 

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },

        // timeout: 30000,
        // retry: 3,
        //credentials: 'include',
     }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query(body){
                return {
                    url: "/register",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }){
                try {
                    const { data } = await queryFulfilled;
                    // Stocker le token JWT dans le localStorage
                    localStorage.setItem('token', data?.token);

                    // set user state
                    dispatch(setUser({ user: data?.token, token: data?.token }))
                    dispatch(setIsAuthenticated(true))

                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log("Registration error:", error);
                }
            }
        }),

        login: builder.mutation({
            query(body){
                return {
                    url: "/login",
                    method: "POST",
                    body,
                };
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }){
                try {
                    const { data } = await queryFulfilled;
                    console.log(data);

                    // Stocker le token JWT dans le localStorage
                    localStorage.setItem('token', data?.token);


                    // set user state
                    dispatch(setUser({ user: data, token: data?.token }))
                    dispatch(setIsAuthenticated(true))

                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log("login error:", error);
                }
            }
        }),
        logout: builder.query({
            query: () => "/logout",
            async onQueryStarted(args, { dispatch }) {
                try {
                    // Supprimer le token JWT du localStorage lors de la déconnexion
                    localStorage.removeItem('token');
                    dispatch(setIsAuthenticated(false));
                    dispatch(setUser(null));
                }catch (error) {
                    console.log("Logout error:", error);
                }
            }
        }),
    }),


    // Gestion globale des erreurs
    extraOptions: {
        onError: async (error, { dispatch }) => {
            if (error?.status === 401) {
                console.error("Token expiré ou invalide.");
                
                // Effacez l'état utilisateur et le token
                localStorage.removeItem('token');
                dispatch(clearUserState());
                dispatch(setIsAuthenticated(false));

                // Redirection vers la page de connexion
                redirect('/login');
            }else if (error?.status === 504) {
                toast.error("Le serveur a mis trop de temps à répondre. Veuillez réessayer plus tard.");
            }
        },
    }
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApi;