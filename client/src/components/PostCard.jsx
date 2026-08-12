import { useState } from "react";

const timeAgo = (date) => { const seconds = Math.floor((Date.now() - new Date(date)) / 1000); if (seconds < 60) return "just now"; if (seconds < 3600) return `${Math.floor(seconds / 60)}m`; if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`; return new Date(date).toLocaleDateString(); };

export default function PostCard({ post, currentUser, onLike, onDislike, onComment, onDelete, onEdit, busy }) {
  const [comment, setComment] = useState(""); const [editing, setEditing] = useState(false); const [caption, setCaption] = useState(post.caption);
  const mine = String(post.userId) === String(currentUser.user_id || currentUser.id);
  const liked = post.likes?.includes(String(currentUser.user_id || currentUser.id)); const disliked = post.dislikes?.includes(String(currentUser.user_id || currentUser.id));
  const submitComment = async (e) => { e.preventDefault(); if (!comment.trim()) return; await onComment(post._id, comment); setComment(""); };
  const saveEdit = async () => { await onEdit(post._id, caption); setEditing(false); };
  return <article className="card overflow-hidden">
    <div className="p-5"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet to-indigo-400 font-black text-white">{post.authorName?.[0]?.toUpperCase()}</div><div><h3 className="font-bold">{post.authorName}</h3><p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p></div></div>{mine && <div className="flex gap-2 text-sm font-semibold"><button onClick={() => setEditing(!editing)} className="text-violet">Edit</button><button onClick={() => onDelete(post._id)} className="text-rose-500">Delete</button></div>}</div>
      {editing ? <div className="mt-4"><textarea className="field min-h-24" value={caption} onChange={(e) => setCaption(e.target.value)} /><div className="mt-2 flex gap-2"><button className="button-primary py-2 text-sm" onClick={saveEdit}>Save</button><button className="button-soft py-2 text-sm" onClick={() => { setCaption(post.caption); setEditing(false); }}>Cancel</button></div></div> : post.caption && <p className="mt-4 whitespace-pre-wrap text-slate-700">{post.caption}</p>}</div>
    {post.media?.[0]?.url && <img src={post.media[0].url} alt="Post attachment" className="max-h-[34rem] w-full object-cover" />}
    <div className="p-5"><div className="flex gap-5 text-sm"><button disabled={busy} onClick={() => onLike(post._id)} className={liked ? "font-bold text-violet" : "text-slate-500"}>♥ {post.likes?.length || 0}</button><button disabled={busy} onClick={() => onDislike(post._id)} className={disliked ? "font-bold text-rose-500" : "text-slate-500"}>✕ {post.dislikes?.length || 0}</button><span className="text-slate-500">◌ {post.comments?.length || 0} comments</span></div>
      {post.comments?.length > 0 && <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">{post.comments.map((item) => <div key={item._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm"><span className="mr-2 font-bold text-violet">{String(item.userId) === String(currentUser.user_id || currentUser.id) ? "You" : "Member"}</span>{item.content}</div>)}</div>}
      <form className="mt-4 flex gap-2" onSubmit={submitComment}><input className="field py-2 text-sm" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment…" /><button className="button-primary px-4 py-2 text-sm" disabled={busy}>Send</button></form>
    </div>
  </article>;
}
