import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import ScrollBased from "./pages/ScrollBased";
import { Layout } from "./components/Layout";
import { Fragment } from "react/jsx-runtime";
import { ToastContainer } from "react-toastify";

export default function App() {
    return (
        <Fragment>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <RouterProvider
                router={createBrowserRouter(
                    createRoutesFromElements(
                        <Route path="/" element={<Layout />}>
                            <Route index element={<ScrollBased />} />
                        </Route>,
                    ),
                )}
            />
        </Fragment>
    );
}
