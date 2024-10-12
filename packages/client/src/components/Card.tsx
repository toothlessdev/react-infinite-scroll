import { toast } from "react-toastify";
import closeIcon from "../assets/close.svg";
import { API_BASE_URL } from "../constants/env";

export interface UserCardProps {
    id: number;
    name: string;
    email: string;
}

export const UserCard = ({ id, name, email }: UserCardProps) => {
    const handleDelete = async () => {
        toast.promise(
            fetch(API_BASE_URL + `/users/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }).then((res) => res.json()),
            {
                pending: "삭제중...",
                success: "삭제 완료!",
                error: "삭제 실패!",
            }
        );
    };

    return (
        <div className="flex justify-between m-2 p-2 px-4 border-[1px] rounded-md border-gray-200">
            <h2 className="text-lg ">
                <span className="mr-3">{id}</span>
                <span>{name}</span>
            </h2>
            <div className="flex gap-3">
                <h2 className="text-lg">{email}</h2>
                <button onClick={handleDelete}>
                    <img className="h-[20px] object-contain" src={closeIcon} />
                </button>
            </div>
        </div>
    );
};
