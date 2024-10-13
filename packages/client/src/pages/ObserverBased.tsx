import { UserCard } from "../components/Card";
import { CardContainer } from "../components/CardContainer";
import { Spinner } from "../components/Spinner";
import { useInfObserverFetch } from "../hooks/useInfObserverFetch";

export default function ObserverBased() {
    const { data, scrollContainerRef, targetRef, nextUrl } = useInfObserverFetch<
        User[],
        HTMLDivElement,
        HTMLDivElement
    >({
        url: "http://localhost:3000/users?take=15",
        rootMargin: "0px",
        threshold: 0.5,
    });

    return (
        <div className="w-full h-screen flex flex-col justify-center">
            <CardContainer ref={scrollContainerRef}>
                {data &&
                    data.data.map((user) => {
                        return <UserCard key={user.id} id={user.id} name={user.name} email={user.email} />;
                    })}
                {nextUrl && <Spinner ref={targetRef} />}
            </CardContainer>
        </div>
    );
}
