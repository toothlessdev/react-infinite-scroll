declare type User = {
    id: number;
    name: string;
    email: string;
};

declare type PaginatedResponse<T extends Record<string, unknown>[]> = {
    data: T;
    pageInfo: {
        size: number;
        lastCursor: number | null;
        nextUrl: string | null;
    };
};

declare type Scroll = {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
};
