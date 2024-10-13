import { useCallback, useEffect, useRef, useState } from "react";

type useInfScrollFetchOptions = {
    url: string;
    offset?: number;
};

export const useInfScrollFetch = <D extends Record<string, unknown>[], E extends HTMLElement = HTMLElement>({
    url,
    offset = 0,
}: useInfScrollFetchOptions) => {
    const scrollContainerRef = useRef<E>(null);

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

    // [1] 초기 데이터 로딩
    useEffect(() => {
        fetchPaginatedData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // [2] 스크롤 이벤트 핸들러 설정
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            /* 
            ❗️ 절대 scrollTop, scrollHeight, clientHeight 를 리액트의 상태로 저장 후,
            ❗️ scrollEventHandler 외부에서 API 호출하면 안됨!
            ❗️ 상태가 변경되면서 재렌더링이 일어나고 스크롤이 초기화되기 때문
            */
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            console.table({ scrollTop, scrollHeight, clientHeight });

            if (scrollTop + clientHeight >= scrollHeight - offset) {
                // ❗️ API 호출중이 아니고, 다음 페이지가 존재하면 API 호출
                if (!isPending && nextUrl) fetchPaginatedData();
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [fetchPaginatedData, isPending, nextUrl, offset]);

    return {
        scrollContainerRef,
        isPending,
        isError,
        error,
        data,
    };
};
