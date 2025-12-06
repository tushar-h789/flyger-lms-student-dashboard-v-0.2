import { baseApi } from "../api/baseApi";

export const LiveClassApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all online classes
    getLiveClasses: builder.query({
      query: () => ({
        url: "/live_class",
        method: "GET",
        providesTags: ["LiveClass"],
      }),
    }),

    // Get single online class by ID
    getLiveClass: builder.query({
      query: (id) => ({
        url: `/live_class/${id}`,
        method: "GET",
        providesTags: ["LiveClass"],
      }),
      providesTags: ["LiveClass"],
    }),

    // Create new online class
    // createLiveClass: builder.mutation({
    //   query: (data) => ({
    //     url: "/live_class/create",
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["LiveClass"],
    // }),

    // Update online class
    // updateLiveClass: builder.mutation({
    //   query: (data) => ({
    //     url: `/live_class/${data?.id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["LiveClass"],
    // }),

    // // Delete online class
    // deleteLiveClass: builder.mutation({
    //   query: (id) => ({
    //     url: `/live_class/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["LiveClass"],
    // }),

    // Start online class
    // startLiveClass: builder.mutation({
    //   query: (data) => ({
    //     url: `/online-classes/${data?.id}/start`,
    //     method: "PATCH",
    //     body: data,
    //   }),
    //   invalidatesTags: ["LiveClass"],
    // }),

    // End online class
    // endLiveClass: builder.mutation({
    //   query: (data) => ({
    //     url: `/online-classes/${data?.id}/end`,
    //     method: "PATCH",
    //     body: data,
    //   }),
    //   invalidatesTags: ["LiveClass"],
    // }),
  }),
});

export const {
  useGetLiveClassesQuery,
  useGetLiveClassQuery,
} = LiveClassApi;
