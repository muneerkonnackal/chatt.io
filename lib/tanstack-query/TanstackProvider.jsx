"use client";
import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function TanstackProviders({ children }) {
    const queryClient = new QueryClient();
    // const queryClient = new QueryClient({
    //     queryCache: new QueryCache({
    //         onError: (error, query) => {
    //             // 🎉 only show error toasts if we already have data in the cache
    //             // which indicates a failed background update
    //             if (query.state.data !== undefined) {
    //                 toast.error(Something went wrong: ${error.message});
    //             }
    //         },
    //     }),
    // });
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}