import { useCallback, useEffect, useState } from "react";
import AuthScreen from "./components/AuthScreen";
import Composer from "./components/Composer";
import PostCard from "./components/PostCard";
import { addComment, createPost, deletePost, dislikePost, editPost, getUserPosts, likePost, login, register } from "./api/orbitalApi";
import api, { getErrorMessage } from "./api/client";

const storedUser = () => { try { return JSON.parse(sessionStorage.getItem("orbital-user")); } catch { return null; } };

export default function App() {
  const [user, setUser] = useState(storedUser); const [mode, setMode] = useState("login"); const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(false); const [pending, setPending] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const saveUser = (nextUser) => { setUser(nextUser); sessionStorage.setItem("orbital-user", JSON.stringify(nextUser)); };
  const userId = user?.user_id || user?.id;
  const loadPosts = useCallback(async () => {
    if (!userId) return; setLoading(true);
    try { const { data } = await getUserPosts(userId); setPosts(data.posts || []); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); }
  }, [userId]);
  useEffect(() => { loadPosts(); }, [loadPosts]);

  const authenticate = async (fields) => {
    setPending(true); setError("");
    try {
      const { data } = mode === "login" ? await login({ email: fields.email, password: fields.password }) : await register(fields);
      if (mode === "register") {
        try { await api.post("/api/user/create-user-profile", { username: fields.username }); } catch (profileError) { if (profileError.response?.status !== 409) throw profileError; }
      }
      saveUser(data.user || { username: fields.username });
      setNotice(data.message || "You are signed in.");
    } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); }
  };
  const updatePost = (post) => setPosts((current) => current.map((item) => item._id === post._id ? post : item));
  const handleCreate = async (values) => { setPending(true); setError(""); try { const formData = new FormData(); formData.append("caption", values.caption); formData.append("authorName", values.authorName); if (values.image) formData.append("image", values.image); const { data } = await createPost(formData); setPosts((current) => [data.post, ...current]); setNotice("Post published."); } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); } };
  const action = async (work) => { setPending(true); setError(""); try { const { data } = await work(); if (data.post) updatePost(data.post); } catch (err) { setError(getErrorMessage(err)); } finally { setPending(false); } };
  const removePost = async (postId) => { if (!window.confirm("Delete this post?")) return; await action(async () => { const response = await deletePost(postId); setPosts((items) => items.filter((item) => item._id !== postId)); return response; }); };
  const signOut = () => { sessionStorage.removeItem("orbital-user"); setUser(null); setPosts([]); setMode("login"); setNotice("Signed out locally. The backend does not currently expose a logout route."); };

  if (!user) return <AuthScreen mode={mode} onSubmit={authenticate} pending={pending} error={error} onToggle={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} />;
  return <main className="min-h-screen"><header className="sticky top-0 z-10 border-b border-slate-200/70 bg-cloud/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><div className="text-2xl font-black">orbital<span className="text-violet">.</span></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold">{user.username}</p><p className="text-xs text-slate-400">Your orbit</p></div><div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet font-black text-white">{user.username?.[0]?.toUpperCase()}</div><button className="button-soft px-3 py-2 text-sm" onClick={signOut}>Sign out</button></div></div></header>
    <div className="mx-auto grid max-w-6xl gap-7 px-5 py-8 lg:grid-cols-[15rem_minmax(0,42rem)_16rem]"><aside className="hidden lg:block"><div className="card p-5"><p className="text-xs font-bold uppercase tracking-widest text-violet">Your space</p><h1 className="mt-2 text-xl font-black">{user.username}</h1><p className="mt-3 text-sm leading-6 text-slate-500">Share a thought, a snapshot, or a moment worth keeping.</p><div className="mt-5 border-t border-slate-100 pt-4 text-sm"><span className="font-black">{posts.length}</span> <span className="text-slate-500">posts published</span></div></div></aside>
      <section><div className="mb-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-violet">Your orbit</p><h2 className="mt-1 text-3xl font-black">Share your signal.</h2></div>{(error || notice) && <div className={`mb-5 rounded-2xl px-4 py-3 text-sm ${error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{error || notice}<button className="float-right font-bold" onClick={() => { setError(""); setNotice(""); }}>×</button></div>}<Composer user={user} onCreate={handleCreate} pending={pending} /><div className="mt-6 space-y-5">{loading ? <div className="card p-8 text-center text-slate-400">Loading your posts…</div> : posts.length ? posts.map((post) => <PostCard key={post._id} post={post} currentUser={user} busy={pending} onLike={(id) => action(() => likePost(id))} onDislike={(id) => action(() => dislikePost(id))} onComment={(postId, content) => action(() => addComment({ postId, content }))} onEdit={(postId, caption) => action(() => editPost({ postId, caption }))} onDelete={removePost} />) : <div className="card p-10 text-center"><div className="text-3xl">✦</div><h3 className="mt-3 text-lg font-black">Your orbit is ready.</h3><p className="mt-2 text-sm text-slate-500">Your published posts will appear here.</p></div>}</div></section>
      <aside className="hidden lg:block"><div className="card p-5"><p className="text-sm font-black">A note about your feed</p><p className="mt-3 text-sm leading-6 text-slate-500">The current backend returns posts for one user at a time, so this screen shows your posts. A global or following feed will need a matching backend endpoint.</p></div></aside>
    </div></main>;
}
