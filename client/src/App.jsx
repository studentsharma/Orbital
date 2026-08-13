// import { useCallback, useEffect, useState } from "react";
// import {
//   addComment,
//   createPost,
//   deletePost,
//   dislikePost,
//   editPost,
//   getCurrentUser,
//   getFollowers,
//   getFollowing,
//   getGlobalFeed,
//   getUserPosts,
//   likePost,
//   login,
//   register,
//   resendVerificationCode,
// } from "./api/orbitalApi";
// import api, { getErrorMessage } from "./api/client";
// import AuthScreen from "./components/AuthScreen";
// import Avatar from "./components/Avatar";
// import Composer from "./components/Composer";
// import ConnectionsModal from "./components/ConnectionsModal";
// import FollowersList from "./components/FollowersList";
// import PostCard from "./components/PostCard";
// import ProfilePage from "./components/ProfilePage";
// import UserSearch from "./components/UserSearch";

// const savedUser = () => {
//   try {
//     return JSON.parse(sessionStorage.getItem("orbital-user"));
//   } catch {
//     return null;
//   }
// };

// export default function App() {
//   const [user, setUser] = useState(savedUser);
//   const [mode, setMode] = useState("login");
//   const [view, setView] = useState("feed");
//   const [profile, setProfile] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [discoverPosts, setDiscoverPosts] = useState([]);
//   const [followers, setFollowers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pending, setPending] = useState(false);
//   const [connections, setConnections] = useState(null);
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");
//   const userId = user?.user_id || user?.id;
//   const saveUser = (value) => {
//     setUser(value);
//     sessionStorage.setItem("orbital-user", JSON.stringify(value));
//   };
//   const loadFeed = useCallback(async () => {
//     if (!userId) return;
//     setLoading(true);
//     try {
//       const { data } = await getGlobalFeed();
//       setPosts(data.posts || []);
//       setDiscoverPosts(data.posts || []);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);
//   const openProfile = useCallback(async (value) => {
//     setView("profile");
//     setProfile(value);
//     setPosts([]);
//     setLoading(true);
//     try {
//       const { data } = await getUserPosts(value.userId);
//       setPosts(data.posts || []);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//   useEffect(() => {
//     if (!userId) return;
//     loadFeed();
//     getCurrentUser()
//       .then(({ data }) => data.user && saveUser({ ...user, ...data.user }))
//       .catch(() => {});
//     getFollowers()
//       .then(({ data }) => setFollowers(data.followers || []))
//       .catch(() => setFollowers([]));
//   }, [userId, loadFeed]);
//   const authenticate = async (fields) => {
//     setPending(true);
//     setError("");
//     try {
//       const { data } =
//         mode === "login"
//           ? await login({ email: fields.email, password: fields.password })
//           : await register(fields);
//       let current = data.user || { username: fields.username };
//       if (mode === "register") {
//         try {
//           const result = await api.post("/api/user/create-user-profile", {
//             username: fields.username,
//           });
//           current = { ...current, ...result.data.user };
//         } catch (err) {
//           if (err.response?.status !== 409) throw err;
//         }
//       } else {
//         try {
//           const result = await getCurrentUser();
//           current = { ...current, ...result.data.user };
//         } catch {}
//       }
//       saveUser(current);
//       setNotice(data.message || "You are signed in.");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPending(false);
//     }
//   };
//   const updatePost = (post) =>
//     setPosts((items) =>
//       items.map((item) => (item._id === post._id ? post : item)),
//     );
//   const action = async (work) => {
//     setPending(true);
//     try {
//       const { data } = await work();
//       if (data.post) updatePost(data.post);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPending(false);
//     }
//   };
//   const publish = async (values) => {
//     setPending(true);
//     try {
//       const body = new FormData();
//       body.append("caption", values.caption);
//       body.append("authorName", values.authorName);
//       if (values.image) body.append("image", values.image);
//       const { data } = await createPost(body);
//       setPosts((items) => [data.post, ...items]);
//       setDiscoverPosts((items) => [data.post, ...items]);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPending(false);
//     }
//   };
//   const remove = async (id) => {
//     if (!window.confirm("Delete this post?")) return;
//     await action(async () => {
//       const result = await deletePost(id);
//       setPosts((items) => items.filter((item) => item._id !== id));
//       return result;
//     });
//   };
//   const myProfile = () =>
//     openProfile({ ...user, userId, username: user.username });
//   const switchFeed = () => {
//     setView("feed");
//     setProfile(null);
//     loadFeed();
//   };
//   const showConnections = async (type) => {
//     setPending(true);
//     try {
//       const { data } =
//         type === "followers" ? await getFollowers() : await getFollowing();
//       setConnections({
//         title: type === "followers" ? "Followers" : "Following",
//         users: data[type] || [],
//       });
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPending(false);
//     }
//   };
//   const signOut = () => {
//     sessionStorage.removeItem("orbital-user");
//     setUser(null);
//     setPosts([]);
//     setDiscoverPosts([]);
//     setFollowers([]);
//     setMode("login");
//   };
//   if (!user)
//     return (
//       <AuthScreen
//         mode={mode}
//         onSubmit={authenticate}
//         pending={pending}
//         error={error}
//         onToggle={() => setMode(mode === "login" ? "register" : "login")}
//       />
//     );
//   const postActions = {
//     busy: pending,
//     onLike: (id) => action(() => likePost(id)),
//     onDislike: (id) => action(() => dislikePost(id)),
//     onComment: (postId, content) =>
//       action(() => addComment({ postId, content })),
//     onEdit: (postId, caption) => action(() => editPost({ postId, caption })),
//     onDelete: remove,
//     onProfile: openProfile,
//   };
//   return (
//     <main className="min-h-screen">
//       {connections && (
//         <ConnectionsModal
//           {...connections}
//           onClose={() => setConnections(null)}
//           onProfile={(person) => {
//             setConnections(null);
//             openProfile(person);
//           }}
//         />
//       )}
//       <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-cloud/90 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
//           <button className="text-2xl font-black" onClick={switchFeed}>
//             orbital<span className="text-violet">.</span>
//           </button>
//           <div className="order-3 w-full sm:order-none sm:w-auto">
//             <UserSearch posts={discoverPosts} onSelect={openProfile} />
//           </div>
//           <nav className="flex items-center gap-2">
//             <button className="button px-3 py-2 text-sm" onClick={switchFeed}>
//               Discover
//             </button>
//             <button className="button px-3 py-2 text-sm" onClick={myProfile}>
//               Profile
//             </button>
//             <Avatar user={user} name={user.username} onClick={myProfile} />
//             <button
//               className="hidden text-sm font-semibold text-slate-500 sm:block"
//               onClick={signOut}
//             >
//               Sign out
//             </button>
//           </nav>
//         </div>
//       </header>
//       <div className="mx-auto grid max-w-6xl gap-7 px-5 py-8 lg:grid-cols-[15rem_minmax(0,42rem)_16rem]">
//         <aside className="hidden lg:block">
//           <div className="card p-5">
//             <Avatar user={user} name={user.username} onClick={myProfile} />
//             <h2 className="mt-3 text-xl font-black">{user.username}</h2>
//             <button
//               className="mt-4 text-sm font-bold text-violet"
//               onClick={myProfile}
//             >
//               View profile
//             </button>
//           </div>
//         </aside>
//         <section>
//           {error && (
//             <p className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
//               {error}
//             </p>
//           )}
//           {view === "profile" ? (
//             <ProfilePage
//               profile={profile}
//               posts={posts}
//               currentUser={user}
//               loading={loading}
//               {...postActions}
//               onBack={switchFeed}
//               onConnections={showConnections}
//               onSendVerification={() =>
//                 action(() => resendVerificationCode(user.email))
//               }
//             />
//           ) : (
//             <>
//               <div className="mb-6">
//                 <p className="text-sm font-bold uppercase tracking-widest text-violet">
//                   Discover
//                 </p>
//                 <h1 className="mt-1 text-3xl font-black">
//                   Signals from every orbit.
//                 </h1>
//               </div>
//               <Composer user={user} onCreate={publish} pending={pending} />
//               <div className="mt-6 space-y-5">
//                 {loading ? (
//                   <div className="card p-8 text-center text-slate-400">
//                     Loading the global feed...
//                   </div>
//                 ) : (
//                   posts.map((post) => (
//                     <PostCard
//                       key={post._id}
//                       post={post}
//                       currentUser={user}
//                       {...postActions}
//                     />
//                   ))
//                 )}
//               </div>
//             </>
//           )}
//         </section>
//         <aside className="hidden lg:block">
//           <FollowersList followers={followers} onProfile={openProfile} />
//         </aside>
//       </div>
//     </main>
//   );
// }



import { useCallback, useEffect, useState } from "react";
import { addComment, createPost, deletePost, dislikePost, editPost, getCurrentUser, getFollowers, getFollowing, getGlobalFeed, getUserPosts, likePost, login, register, resendVerificationCode } from "./api/orbitalApi";
import api, { getErrorMessage } from "./api/client";
import AuthScreen from "./components/AuthScreen";
import Avatar from "./components/Avatar";
import Composer from "./components/Composer";
import ConnectionsModal from "./components/ConnectionsModal";
import FollowersList from "./components/FollowersList";
import PostCard from "./components/PostCard";
import ProfilePage from "./components/ProfilePage";
import UserSearch from "./components/UserSearch";

const savedUser = () => { try { return JSON.parse(sessionStorage.getItem("orbital-user")); } catch { return null; } };

export default function App() {
  const [user, setUser] = useState(savedUser);
  const [mode, setMode] = useState("login"); const [view, setView] = useState("feed"); const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]); const [discoverPosts, setDiscoverPosts] = useState([]); const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false); const [pending, setPending] = useState(false); const [connections, setConnections] = useState(null); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const userId = user?.user_id || user?.id;
  const saveUser = (value) => { setUser(value); sessionStorage.setItem("orbital-user", JSON.stringify(value)); };
  const loadFeed = useCallback(async () => { if (!userId) return; setLoading(true); try { const { data } = await getGlobalFeed(); setPosts(data.posts || []); setDiscoverPosts(data.posts || []); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, [userId]);
  const openProfile = useCallback(async (value) => { setView("profile"); setProfile(value); setPosts([]); setLoading(true); try { const { data } = await getUserPosts(value.userId); setPosts(data.posts || []); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { if (!userId) return; loadFeed(); getCurrentUser().then(({ data }) => data.user && saveUser({ ...user, ...data.user })).catch(() => {}); getFollowers().then(({ data }) => setFollowers(data.followers || [])).catch(() => setFollowers([])); }, [userId, loadFeed]);
  const authenticate = async (fields) => { setPending(true); setError(""); try { const { data } = mode === "login" ? await login({ email: fields.email, password: fields.password }) : await register(fields); let current = data.user || { username: fields.username }; if (mode === "register") { try { const result = await api.post("/api/user/create-user-profile", { username: fields.username }); current = { ...current, ...result.data.user }; } catch (err) { if (err.response?.status !== 409) throw err; } } else { try { const result = await getCurrentUser(); current = { ...current, ...result.data.user }; } catch {} } saveUser(current); setNotice(data.message || "You are signed in."); } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); } };
  const updatePost = (post) => setPosts((items) => items.map((item) => item._id === post._id ? post : item));
  const action = async (work) => { setPending(true); try { const { data } = await work(); if (data.post) updatePost(data.post); } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); } };
  const publish = async (values) => { setPending(true); try { const body = new FormData(); body.append("caption", values.caption); body.append("authorName", values.authorName); if (values.image) body.append("image", values.image); const { data } = await createPost(body); setPosts((items) => [data.post, ...items]); setDiscoverPosts((items) => [data.post, ...items]); } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); } };
  const remove = async (id) => { if (!window.confirm("Delete this post?")) return; await action(async () => { const result = await deletePost(id); setPosts((items) => items.filter((item) => item._id !== id)); return result; }); };
  const myProfile = () => openProfile({ ...user, userId, username: user.username });
  const switchFeed = () => { setView("feed"); setProfile(null); loadFeed(); };
  const showConnections = async (type) => { setPending(true); try { const { data } = type === "followers" ? await getFollowers() : await getFollowing(); setConnections({ title: type === "followers" ? "Followers" : "Following", users: data[type] || [] }); } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); } };
  const signOut = () => { sessionStorage.removeItem("orbital-user"); setUser(null); setPosts([]); setDiscoverPosts([]); setFollowers([]); setMode("login"); };
  if (!user) return <AuthScreen mode={mode} onSubmit={authenticate} pending={pending} error={error} onToggle={() => setMode(mode === "login" ? "register" : "login")} />;
  const postActions = { busy: pending, onLike: (id) => action(() => likePost(id)), onDislike: (id) => action(() => dislikePost(id)), onComment: (postId, content) => action(() => addComment({ postId, content })), onEdit: (postId, caption) => action(() => editPost({ postId, caption })), onDelete: remove, onProfile: openProfile };
  return (
    <main className="min-h-screen">
      {connections && (
        <ConnectionsModal
          {...connections}
          onClose={() => setConnections(null)}
          onProfile={(person) => {
            setConnections(null);
            openProfile(person);
          }}
        />
      )}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-cloud/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4">
          <button className="text-xl font-black sm:text-2xl" onClick={switchFeed}>
            orbital<span className="text-violet">.</span>
          </button>
          <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:px-4 md:px-8">
            <UserSearch posts={discoverPosts} onSelect={openProfile} />
          </div>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button className="button px-2.5 py-2 text-xs sm:px-3 sm:text-sm" onClick={switchFeed}>
              Discover
            </button>
            <button className="button hidden px-3 py-2 text-sm xs:block" onClick={myProfile}>
              Profile
            </button>
            <Avatar user={user} name={user.username} onClick={myProfile} />
            <button
              className="hidden text-sm font-semibold text-slate-500 sm:block"
              onClick={signOut}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-5 px-3 py-5 sm:gap-7 sm:px-5 sm:py-8 lg:grid-cols-[15rem_minmax(0,42rem)_16rem]">
        <aside className="hidden lg:block">
          <div className="card p-5">
            <Avatar user={user} name={user.username} onClick={myProfile} />
            <h2 className="mt-3 text-xl font-black">{user.username}</h2>
            <button className="mt-4 text-sm font-bold text-violet" onClick={myProfile}>
              View profile
            </button>
          </div>
        </aside>
        <section className="min-w-0">
          {error && (
            <p className="mb-5 break-words rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          {view === "profile" ? (
            <ProfilePage
              profile={profile}
              posts={posts}
              currentUser={user}
              loading={loading}
              {...postActions}
              onBack={switchFeed}
              onConnections={showConnections}
              onSendVerification={() => action(() => resendVerificationCode(user.email))}
            />
          ) : (
            <>
              <div className="mb-5 sm:mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-violet sm:text-sm">
                  Discover
                </p>
                <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                  Signals from every orbit.
                </h1>
              </div>
              <Composer user={user} onCreate={publish} pending={pending} />
              <div className="mt-6 space-y-4 sm:space-y-5">
                {loading ? (
                  <div className="card p-6 text-center text-slate-400 sm:p-8">
                    Loading the global feed...
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} currentUser={user} {...postActions} />
                  ))
                )}
              </div>
            </>
          )}
        </section>
        <aside className="hidden lg:block">
          <FollowersList followers={followers} onProfile={openProfile} />
        </aside>
      </div>
    </main>
  );
}