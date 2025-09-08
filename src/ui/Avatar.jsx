import React from "react";

export default function Avatar({ user, className }) {
  return (
    <>
      {user.avatar_url !== null ? (
        <div className="avatar">
          <div className={className || "size-10 rounded-full"}>
            <img referrerPolicy="no-referrer" src={user.avatar_url} />
          </div>
        </div>
      ) : (
        <div className="avatar avatar-placeholder">
          <div
            className={`bg-neutral text-neutral-content ${className || "size-10 rounded-full"}`}
          >
            <span className="text-xl font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
