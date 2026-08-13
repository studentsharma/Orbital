// import Avatar from "./Avatar";
// import PostCard from "./PostCard";

// export default function ProfilePage({
//   profile,
//   posts,
//   currentUser,
//   loading,
//   busy,
//   onBack,
//   onLike,
//   onDislike,
//   onComment,
//   onEdit,
//   onDelete,
//   onProfile,
//   onSendVerification,
//   onConnections,
// }) {
//   const ownProfile =
//     String(profile.userId) === String(currentUser.user_id || currentUser.id);
//   return (
//     <section>
//       <button className="mb-5 text-sm font-bold text-violet" onClick={onBack}>
//         ← Back to feed
//       </button>
//       <div className="card overflow-hidden">
//         <div className="h-28 bg-gradient-to-r from-violet via-indigo-500 to-cyan-400" />
//         <div className="px-6 pb-6">
//           <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
//             <Avatar
//               user={profile}
//               name={profile.username}
//               size="lg"
//               onClick={() => {}}
//             />
//             {ownProfile && (
//               <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-bold text-violet">
//                 Your profile
//               </span>
//             )}
//           </div>
//           <h1 className="mt-4 text-2xl font-black">{profile.username}</h1>
//           {profile.bio && (
//             <p className="mt-2 max-w-xl text-slate-600">{profile.bio}</p>
//           )}
//           <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
//             <span>
//               <b>{posts.length}</b>{" "}
//               <span className="text-slate-500">posts</span>
//             </span>
//             {ownProfile && (
//               <>
//                 <button className="text-left hover:text-violet" onClick={() => onConnections("followers")}>
//                   <b>{profile.followers_count || 0}</b>{" "}
//                   <span className="text-slate-500">followers</span>
//                 </button>
//                 <button className="text-left hover:text-violet" onClick={() => onConnections("following")}>
//                   <b>{profile.following_count || 0}</b>{" "}
//                   <span className="text-slate-500">following</span>
//                 </button>
//                 {currentUser.email && (
//                   <button
//                     className="button-soft ml-auto px-3 py-2 text-sm"
//                     disabled={busy}
//                     onClick={onSendVerification}
//                   >
//                     {busy ? "Sending…" : "Send verification email"}
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       {!ownProfile && (
//         <p className="mt-5 rounded-2xl bg-violet/5 px-4 py-3 text-sm text-slate-600">
//           This profile’s public posts are shown below. More profile details
//           become available when the user service provides a public
//           profile-by-user-ID endpoint.
//         </p>
//       )}
//       <div className="mt-6 space-y-5">
//         {loading ? (
//           <div className="card p-8 text-center text-slate-400">
//             Loading posts…
//           </div>
//         ) : posts.length ? (
//           posts.map((post) => (
//             <PostCard
//               key={post._id}
//               post={post}
//               currentUser={currentUser}
//               busy={busy}
//               onLike={onLike}
//               onDislike={onDislike}
//               onComment={onComment}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               onProfile={onProfile}
//             />
//           ))
//         ) : (
//           <div className="card p-10 text-center text-slate-500">
//             No posts yet.
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }



import Avatar from "./Avatar";
import PostCard from "./PostCard";

export default function ProfilePage({
  profile,
  posts,
  currentUser,
  loading,
  busy,
  onBack,
  onLike,
  onDislike,
  onComment,
  onEdit,
  onDelete,
  onProfile,
  onSendVerification,
  onConnections,
}) {
  const ownProfile =
    String(profile.userId) === String(currentUser.user_id || currentUser.id);
  return (
    <section className="px-3 sm:px-0">
      <button className="mb-4 text-sm font-bold text-violet sm:mb-5" onClick={onBack}>
        ← Back to feed
      </button>
      <div className="card overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-violet via-indigo-500 to-cyan-400 sm:h-28" />
        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-8 flex flex-wrap items-end justify-between gap-3 sm:-mt-12 sm:gap-4">
            <Avatar
              user={profile}
              name={profile.username}
              size="lg"
              onClick={() => {}}
            />
            {ownProfile && (
              <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-bold text-violet">
                Your profile
              </span>
            )}
          </div>
          <h1 className="mt-4 truncate text-xl font-black sm:text-2xl">
            {profile.username}
          </h1>
          {profile.bio && (
            <p className="mt-2 max-w-xl break-words text-sm text-slate-600 sm:text-base">
              {profile.bio}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm sm:gap-4">
            <span>
              <b>{posts.length}</b>{" "}
              <span className="text-slate-500">posts</span>
            </span>
            {ownProfile && (
              <>
                <button className="text-left hover:text-violet" onClick={() => onConnections("followers")}>
                  <b>{profile.followers_count || 0}</b>{" "}
                  <span className="text-slate-500">followers</span>
                </button>
                <button className="text-left hover:text-violet" onClick={() => onConnections("following")}>
                  <b>{profile.following_count || 0}</b>{" "}
                  <span className="text-slate-500">following</span>
                </button>
                {currentUser.email && (
                  <button
                    className="button-soft w-full px-3 py-2 text-sm sm:ml-auto sm:w-auto"
                    disabled={busy}
                    onClick={onSendVerification}
                  >
                    {busy ? "Sending…" : "Send verification email"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {!ownProfile && (
        <p className="mt-5 rounded-2xl bg-violet/5 px-4 py-3 text-sm text-slate-600">
          This profile’s public posts are shown below. More profile details
          become available when the user service provides a public
          profile-by-user-ID endpoint.
        </p>
      )}
      <div className="mt-6 space-y-4 sm:space-y-5">
        {loading ? (
          <div className="card p-6 text-center text-slate-400 sm:p-8">
            Loading posts…
          </div>
        ) : posts.length ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              busy={busy}
              onLike={onLike}
              onDislike={onDislike}
              onComment={onComment}
              onEdit={onEdit}
              onDelete={onDelete}
              onProfile={onProfile}
            />
          ))
        ) : (
          <div className="card p-8 text-center text-slate-500 sm:p-10">
            No posts yet.
          </div>
        )}
      </div>
    </section>
  );
}