import { useMemo, useState } from "react";
import Avatar from "./Avatar";

export default function UserSearch({ posts, onSelect }) {
  const [query, setQuery] = useState("");
  const users = useMemo(() => {
    const uniqueUsers = new Map();
    posts.forEach((post) => {
      if (post.userId && post.authorName) uniqueUsers.set(String(post.userId), { userId: post.userId, username: post.authorName });
    });
    return [...uniqueUsers.values()].filter((user) => user.username.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6);
  }, [posts, query]);

  return <div className="relative w-full max-w-sm"><label className="sr-only" htmlFor="user-search">Find people</label><input id="user-search" className="field py-2.5 pl-10 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people in the feed…" /><span className="pointer-events-none absolute left-4 top-3 text-slate-400">⌕</span>{query.trim() && <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-card">{users.length ? users.map((user) => <button key={user.userId} type="button" className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-violet/5" onClick={() => { onSelect(user); setQuery(""); }}><Avatar name={user.username} onClick={() => {}} /><span className="font-bold">{user.username}</span></button>) : <p className="px-3 py-3 text-sm text-slate-500">No matching authors in the loaded feed.</p>}</div>}</div>;
}
