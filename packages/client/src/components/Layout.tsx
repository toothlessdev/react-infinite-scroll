import { NavLink, Outlet } from "react-router-dom";

export const Layout = () => {
    return (
        <main className="">
            <nav className="fixed top-0 z-50 w-full h-[50px] bg-gray-900">
                <ul className="max-w-[1000px] h-full mx-auto px-5 flex items-center justify-center gap-5">
                    <li>
                        <NavLink to="/" className="text-white">
                            Scroll-Based
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/" className="text-white">
                            Intersection-Observer
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/" className="text-white">
                            useInfiniteQuery
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </main>
    );
};
