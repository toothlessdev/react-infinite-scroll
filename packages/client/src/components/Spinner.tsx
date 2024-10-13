import { forwardRef } from "react";

export const Spinner = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div ref={ref} className="w-full flex justify-center">
            <span className="loader"></span>
        </div>
    );
});
