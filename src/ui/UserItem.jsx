import { Link } from "react-router";

export default function UserItem({ user, children }) {
  return (
    <Link to={`/profile/${user.username}`} className="list-row">
      {user.avatar_url !== null ? (
        <div className="avatar">
          <div className="size-10 rounded-full">
            <img referrerPolicy="no-referrer" src={user.avatar_url} />
          </div>
        </div>
      ) : (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content size-10 rounded-full">
            <span className="text-xl font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <div className="list-col-grow flex flex-col items-start justify-center">
        <div className="font-semibold">{user.full_name}</div>
        <div className="text-xs lowercase opacity-60">@{user.username}</div>
      </div>
      <div className="flex w-fit flex-col justify-center gap-1.5">
        {children}
      </div>
    </Link>
  );
}
