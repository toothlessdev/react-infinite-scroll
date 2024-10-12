import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import ScrollBased from "./pages/ScrollBased";
import { Layout } from "./components/Layout";

export default function App() {
    return (
        <RouterProvider
            router={createBrowserRouter(
                createRoutesFromElements(
                    <Route path="/" element={<Layout />}>
                        <Route index element={<ScrollBased />} />
                    </Route>
                )
            )}
        />
    );
}
