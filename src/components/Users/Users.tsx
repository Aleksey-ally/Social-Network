import AvatarUnknownUser from "../../imgs//UnknownUser.png";
import {UsersType} from "redux/usersReducer";
import s from "./Users.module.css";

export type UsersPropsType = {
    usersData: UsersType
    onClickFollow: (userId: number) => void
    onClickPageHandler: (page: number) => void
}

export type BaseResponseType<D = {}> = {
    data: D;
};

export const Users = ({usersData, onClickFollow, onClickPageHandler}: UsersPropsType) => {


    const pagesCount = Math.ceil(usersData.totalUsersCount / usersData.pageSize)
    const pages: number[] = []

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i)
    }

    return (
        <div>
            <div>
                {pages.map(p =>
                    <span className={usersData.currentPage === p ? s.selectedPage : ""}
                          onClick={() => onClickPageHandler(p)}>
                        {p}
                    </span>
                )}
            </div>
            {usersData.users.map(u => (
                <div key={u.id}>
                    <span>
                        <div>
                            <img className={s.userAvatar}
                                 src={u.photos.small == null ? AvatarUnknownUser : u.photos.small} alt="#"/>
                        </div>
                        <div>
                            <button onClick={() => onClickFollow(u.id)}>{u.followed ? "Follow" : "Unfollow"}</button>
                        </div>
                    </span>
                    <span>
                        <span>
                            <div>{u.name}</div>
                            <div>{u.status}</div>
                        </span>
                        <span>
                            <div>{u.location.country}</div>
                            <div>{u.location.city}</div>
                        </span>
                    </span>
                </div>
            ))}
        </div>
    )
}