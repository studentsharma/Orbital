// import Avatar from "./Avatar";

// export default function FollowersList({ followers, onProfile }) {
//   return <div className="card p-5"><p className="text-sm font-black">Followers</p>{followers.length ? <div className="mt-4 space-y-3">{followers.slice(0, 6).map((follower) => <button key={follower.user_id} className="flex w-full items-center gap-3 text-left" onClick={() => onProfile({ userId: follower.user_id, username: follower.username, avatar_url: follower.avatar_url })}><Avatar user={follower} name={follower.username} onClick={() => {}} /><div className="min-w-0"><p className="truncate text-sm font-bold">{follower.username}</p><p className="text-xs text-slate-400">Follows you</p></div></button>)}</div> : <p className="mt-3 text-sm leading-6 text-slate-500">No followers yet. Share your profile and make some friends.</p>}</div>;
// }


import Avatar from "./Avatar";

export default function FollowersList({ followers, onProfile }) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="text-sm font-black">Followers</p>
      {followers.length ? (
        <div className="mt-4 space-y-3">
          {followers.slice(0, 6).map((follower) => (
            <button
              key={follower.user_id}
              className="flex w-full items-center gap-2.5 text-left sm:gap-3"
              onClick={() =>
                onProfile({
                  userId: follower.user_id,
                  username: follower.username,
                  avatar_url: follower.avatar_url,
                })
              }
            >
              <Avatar user={follower} name={follower.username} onClick={() => {}} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{follower.username}</p>
                <p className="text-xs text-slate-400">Follows you</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          No followers yet. Share your profile and make some friends.
        </p>
      )}
    </div>
  );
}