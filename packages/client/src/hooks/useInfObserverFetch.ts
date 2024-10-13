import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type useInfObserverOptions = {
    url: string;
    rootMargin: string;
    threshold: number;
};

export const useInfObserverFetch = <
    D extends Record<string, unknown>[],
    C extends HTMLElement = HTMLElement,
    T extends HTMLElement = HTMLElement,
>({
    url,
    rootMargin = "0px",
    threshold = 0.5,
}: useInfObserverOptions) => {
    const targetRef = useRef<T>(null);
    const scrollContainerRef = useRef<C>(null);
    const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [data, setData] = useState<PaginatedResponse<D> | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const [nextUrl, setNextUrl] = useState<string | null>(url);

    const fetchPaginatedData = useCallback(async () => {
        if (!nextUrl || isPending) return;

        try {
            setIsPending(true);
            const response = await fetch(nextUrl);
            const responseData = (await response.json()) as PaginatedResponse<D>;

            setData((prevData) => {
                return {
                    data: prevData ? [...prevData.data, ...responseData.data] : responseData.data,
                    pageInfo: responseData.pageInfo,
                } as PaginatedResponse<D>;
            });
            setNextUrl(responseData.pageInfo.nextUrl);
        } catch (error) {
            setIsError(true);
            setError(error as Error);
        } finally {
            setIsPending(false);
        }
    }, [isPending, nextUrl]);

    const observerOptions: IntersectionObserverInit = useMemo(() => {
        return {
            root: scrollContainerRef.current,
            rootMargin,
            threshold,
        };
    }, [rootMargin, threshold]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.warn("Element 가 화면에 보임!");
                    fetchPaginatedData();
                }
            });
        },
        [fetchPaginatedData],
    );

    // [1] 초기 데이터 로딩
    useEffect(() => {
        fetchPaginatedData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // [2] IntersectionObserver 설정
    useEffect(() => {
        if (!targetRef.current || !scrollContainerRef.current) return;
        const target = targetRef.current;

        intersectionObserverRef.current = new IntersectionObserver(observerCallback, observerOptions);
        intersectionObserverRef.current.observe(target);

        return () => {
            intersectionObserverRef.current?.unobserve(target);
        };
    }, [observerCallback, observerOptions]);

    return {
        isPending,
        isError,
        data,
        error,
        targetRef,
        scrollContainerRef,
        nextUrl,
    };
};
