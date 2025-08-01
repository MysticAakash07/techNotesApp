import { apiSlice } from "../../app/api/apiSlice";
import { logout } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/auth",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		sendLogout: builder.mutation({
			query: () => ({
				url: "auth/logout",
				method: "POST",
				credentials: "include",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					// const { data } =
					await queryFulfilled;
					// console.log(data)
					dispatch(logout());
					setTimeout(() => dispatch(apiSlice.util.resetApiState()), 1000);
				} catch (err) {
					console.log(err);
				}
			},
		}),
		refresh: builder.mutation({
			query: () => ({
				url: "auth/refresh",
				method: "GET",
			}),
		}),
	}),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
	authApiSlice;
