import { Spinner } from "../components/Spinner";
import { UserCard } from "../components/Card";
import { CardContainer } from "../components/CardContainer";

import { useInfScrollFetch } from "../hooks/useInfScrollFetch";

export default function ScrollBased() {
    const { scrollContainerRef, isPending, data } = useInfScrollFetch<User[], HTMLDivElement>({
        url: "http://localhost:3000/users?take=15",
        offset: 10,
    });

    return (
        <div className="w-full h-screen flex flex-col justify-center">
            <div>
                <CardContainer ref={scrollContainerRef}>
                    {data &&
                        data.data.map((user) => (
                            <UserCard key={user.id} id={user.id} name={user.name} email={user.email} />
                        ))}
                    {isPending && <Spinner />}
                </CardContainer>
            </div>
        </div>
    );
}
