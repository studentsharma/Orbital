import { useRef, useState } from "react";

export default function Composer({ user, onCreate, pending }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);
  const submit = async (event) => {
    event.preventDefault();
    if (!caption.trim() && !image) return;
    await onCreate({ caption, authorName: user.username, image });
    setCaption(""); setImage(null); if (inputRef.current) inputRef.current.value = "";
  };
  return <form className="card p-5" onSubmit={submit}>
    <div className="flex gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet text-sm font-black text-white">{user.username?.[0]?.toUpperCase()}</div><textarea className="min-h-16 w-full resize-none bg-transparent pt-2 outline-none placeholder:text-slate-400" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength="2200" placeholder={`What's on your mind, ${user.username}?`} /></div>
    {image && <div className="mt-3 flex items-center justify-between rounded-2xl bg-violet/5 px-4 py-3 text-sm"><span className="truncate">📷 {image.name}</span><button type="button" onClick={() => { setImage(null); inputRef.current.value = ""; }} className="font-bold text-violet">Remove</button></div>}
    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><label className="button-soft cursor-pointer text-sm">📷 Add image<input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} /></label><button className="button-primary text-sm" disabled={pending || (!caption.trim() && !image)}>{pending ? "Posting…" : "Publish post"}</button></div>
  </form>;
}
