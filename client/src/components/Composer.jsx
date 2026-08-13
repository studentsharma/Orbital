// import { useRef, useState } from "react";
// import Avatar from "./Avatar";

// export default function Composer({ user, onCreate, pending }) {
//   const [caption, setCaption] = useState("");
//   const [image, setImage] = useState(null);
//   const [imageError, setImageError] = useState("");
//   const inputRef = useRef(null);
//   const submit = async (event) => {
//     event.preventDefault();
//     if (!caption.trim() && !image) return;
//     await onCreate({ caption, authorName: user.username, image });
//     setCaption("");
//     setImage(null);
//     setImageError("");
//     if (inputRef.current) inputRef.current.value = "";
//   };
//   const selectImage = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       setImage(null);
//       setImageError("Image must be 5 MB or smaller.");
//       event.target.value = "";
//       return;
//     }

//     setImage(file);
//     setImageError("");
//   };
//   return (
//     <form className="card p-5" onSubmit={submit}>
//       <div className="flex gap-3">
//         <Avatar user={user} name={user.username} onClick={() => {}} />
//         <textarea
//           className="min-h-16 w-full resize-none bg-transparent pt-2 outline-none placeholder:text-slate-400"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           maxLength="2200"
//           placeholder={`What's on your mind, ${user.username}?`}
//         />
//       </div>
//       {image && (
//         <div className="mt-3 flex items-center justify-between rounded-2xl bg-violet/5 px-4 py-3 text-sm">
//           <span className="truncate">📷 {image.name}</span>
//           <button
//             type="button"
//             onClick={() => {
//               setImage(null);
//               inputRef.current.value = "";
//             }}
//             className="font-bold text-violet"
//           >
//             Remove
//           </button>
//         </div>
//       )}
//       {imageError && (
//         <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
//           {imageError}
//         </p>
//       )}
//       <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
//         <label className="button-soft cursor-pointer text-sm">
//           📷 Add image
//           <input
//             ref={inputRef}
//             className="hidden"
//             type="file"
//             accept="image/*"
//             onChange={selectImage}
//           />
//         </label>
//         <button
//           className="button-primary text-sm"
//           disabled={pending || (!caption.trim() && !image)}
//         >
//           {pending ? "Posting…" : "Publish post"}
//         </button>
//       </div>
//     </form>
//   );
// }


import { useRef, useState } from "react";
import Avatar from "./Avatar";

export default function Composer({ user, onCreate, pending }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const inputRef = useRef(null);
  const submit = async (event) => {
    event.preventDefault();
    if (!caption.trim() && !image) return;
    await onCreate({ caption, authorName: user.username, image });
    setCaption("");
    setImage(null);
    setImageError("");
    if (inputRef.current) inputRef.current.value = "";
  };
  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImage(null);
      setImageError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setImageError("");
  };
  return (
    <form className="card p-3 sm:p-5" onSubmit={submit}>
      <div className="flex gap-2 sm:gap-3">
        <Avatar user={user} name={user.username} onClick={() => {}} />
        <textarea
          className="min-h-16 w-full min-w-0 resize-none bg-transparent pt-2 text-sm outline-none placeholder:text-slate-400 sm:text-base"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength="2200"
          placeholder={`What's on your mind, ${user.username}?`}
        />
      </div>
      {image && (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-violet/5 px-3 py-2.5 text-sm sm:px-4 sm:py-3">
          <span className="min-w-0 truncate">📷 {image.name}</span>
          <button
            type="button"
            onClick={() => {
              setImage(null);
              inputRef.current.value = "";
            }}
            className="shrink-0 font-bold text-violet"
          >
            Remove
          </button>
        </div>
      )}
      {imageError && (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 break-words">
          {imageError}
        </p>
      )}
      <div className="mt-4 flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 xs:flex-row xs:items-center xs:justify-between xs:gap-0">
        <label className="button-soft w-fit cursor-pointer text-sm">
          📷 Add image
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={selectImage}
          />
        </label>
        <button
          className="button-primary w-full text-sm xs:w-auto"
          disabled={pending || (!caption.trim() && !image)}
        >
          {pending ? "Posting…" : "Publish post"}
        </button>
      </div>
    </form>
  );
}