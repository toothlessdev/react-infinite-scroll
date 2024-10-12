import { forwardRef } from "react";

export interface CardContainerProps {
    children?: React.ReactNode;
}

export const CardContainer = forwardRef<HTMLDivElement, CardContainerProps>(({ children }, ref) => {
    return (
        <div ref={ref} className="w-[800px] h-[500px] mx-auto overflow-scroll border-gray-200 border-2 rounded-lg">
            {children}
        </div>
    );
});
