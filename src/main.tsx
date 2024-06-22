import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext.tsx";
import Chunker from "./components/Chunker.tsx";
import JournalPage from "./components/JournalPage.tsx";
import Prompts from "./components/Prompts.tsx";
import Layout from "./components/Layout.tsx";
import Priorities from "./Priorities/Priorities.tsx";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/chunker",
        element: <Chunker />,
      },
      {
        path: "/priorities",
        element: <Priorities />,
      },
      {
        path: "/priorities/:id",
        element: <Priorities />,
      },
      {
        path: "/",
        element: <JournalPage />,
      },
      {
        path: "/journals",
        element: <JournalPage />,
      },
      {
        path: "/journals/:id",
        element: <JournalPage />,
      },
      {
        path: "/prompts",
        element: <Prompts />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  </React.StrictMode>,
);
