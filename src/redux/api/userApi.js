import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";
import { BASE_URL } from "./constant";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
          },
     }),

    tagTypes: ["User", "AdminUsers", "AdminUser"], 
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => `/me`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }){
                try {
                    const { data } = await queryFulfilled
                    dispatch(setUser(data))
                    dispatch(setIsAuthenticated(true))
                    dispatch(setLoading(false))
                } catch (error) {
                    dispatch(setLoading(false))
                    console.log(error);
                }
            },
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query(body) {
                return {
                    url: "/me/update",
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ['User'],
        }),
        uploadAvatar: builder.mutation({
            query(body) {
                return {
                    url: "/me/upload_avatar",
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ['User'],
        }),
        updatePassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/update",
                    method: "PUT",
                    body,
                };
            },
        }),

        getAdminUsers: builder.query({
            query: () => `/admin/users`,
            providesTags: ["AdminUsers"]
        }),

        getUserDetails: builder.query({
            query: (id) => `/admin/users/${id}`,
            providesTags: ["AdminUser"]
        }),

        updateUser: builder.mutation({
            query({id, body}) {
                return {
                    url: `/admin/users/${id}`,
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["AdminUsers"]
        }),

        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/admin/users/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["AdminUsers"]
        }),
    }),
});

export const { 
    useGetMeQuery, 
    useUpdateProfileMutation, 
    useUploadAvatarMutation, 
    useUpdatePasswordMutation,
    useGetAdminUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;