import { useEffect, useRef, useState, useCallback } from "react";

import { Spinner } from "../components/Spinner";
import { UserCard } from "../components/Card";
import { CardContainer } from "../components/CardContainer";
import { API_BASE_URL } from "../constants/env";

export default function ScrollBased() {
    const containerRef = useRef<HTMLDivElement>(null);

    const [nextUrl, setNextUrl] = useState<string | null>(API_BASE_URL + "/users?take=20");
    const [isPending, setIsPending] = useState<boolean>(false);
    const [data, setData] = useState<PaginatedResponse<User[]> | null>(null);

    const fetchData = useCallback(async () => {
        if (!nextUrl || isPending) return;

        setIsPending(true);
        const response = await fetch(nextUrl);
        const data = (await response.json()) as PaginatedResponse<User[]>;

        setData((prevData) => {
            return {
                data: prevData ? [...prevData.data, ...data.data] : data.data,
                pageInfo: data.pageInfo,
            };
        });
        setNextUrl(data.pageInfo.nextUrl);
        setIsPending(false);
    }, [isPending, nextUrl]);

    // [1] 초기 데이터 로딩
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // [2] 스크롤 이벤트 핸들러 설정
    useEffect(() => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            /* 
            ❗️ 절대 scrollTop, scrollHeight, clientHeight 를 리액트의 상태로 저장 후,
            ❗️ scrollEventHandler 외부에서 API 호출하면 안됨!
            ❗️ 상태가 변경되면서 재렌더링이 일어나고 스크롤이 초기화되기 때문
            */
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            console.table({ scrollTop, scrollHeight, clientHeight });

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                console.warn("스크롤 하단 도달!");
                // ❗️ API 호출중이 아니고, 다음 페이지가 존재하면 API 호출
                if (!isPending && nextUrl) fetchData();
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [fetchData, isPending, nextUrl]);

    return (
        <div className="w-full h-screen flex flex-col justify-center">
            <div>
                <CardContainer ref={containerRef}>
                    {data && data.data.map((user) => <UserCard key={user.id} id={user.id} name={user.name} email={user.email} />)}
                    {isPending && <Spinner />}
                </CardContainer>
            </div>
        </div>
    );
}
