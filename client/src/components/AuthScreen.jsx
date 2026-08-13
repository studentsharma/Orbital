// import { useState } from "react";

// const initialFields = { username: "", email: "", password: "" };

// export default function AuthScreen({
//   mode,
//   onSubmit,
//   pending,
//   error,
//   onToggle,
// }) {
//   const [fields, setFields] = useState(initialFields);
//   const isLogin = mode === "login";

//   const submit = (event) => {
//     event.preventDefault();
//     onSubmit(fields);
//   };

//   return (
//     <main className="grid min-h-screen lg:grid-cols-2">
//       <section className="relative hidden overflow-hidden bg-ink p-14 lg:block">
//         <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-violet/80 blur-3xl" />
//         <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
//         <div className="relative flex h-full flex-col justify-between text-white">
//           <div className="text-2xl font-black tracking-tight">
//             orbital<span className="text-violet-300">.</span>
//           </div>
//           <div>
//             <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
//               Find your orbit
//             </p>
//             <h1 className="max-w-lg text-5xl font-black leading-tight">
//               A calmer place to share what matters.
//             </h1>
//           </div>
//           <p className="text-sm text-slate-300">
//             Built for the conversations that stay with you.
//           </p>
//         </div>
//       </section>
//       <section className="flex items-center justify-center p-6 sm:p-10">
//         <form className="w-full max-w-md" onSubmit={submit}>
//           <div className="mb-10 lg:hidden text-2xl font-black">
//             orbital<span className="text-violet">.</span>
//           </div>
//           <p className="mb-2 text-sm font-bold uppercase tracking-widest text-violet">
//             Welcome {isLogin ? "back" : "to Orbital"}
//           </p>
//           <h2 className="text-3xl font-black">
//             {isLogin ? "Sign in to your orbit" : "Create your account"}
//           </h2>
//           <p className="mt-3 text-slate-500">
//             {isLogin
//               ? "Your community is waiting for you."
//               : "Start sharing your perspective today."}
//           </p>
//           <div className="mt-8 space-y-4">
//             {!isLogin && (
//               <label className="block">
//                 <span className="mb-2 block text-sm font-semibold">
//                   Username
//                 </span>
//                 <input
//                   className="field"
//                   required
//                   value={fields.username}
//                   onChange={(e) =>
//                     setFields({ ...fields, username: e.target.value })
//                   }
//                   placeholder="yourname"
//                 />
//               </label>
//             )}
//             <label className="block">
//               <span className="mb-2 block text-sm font-semibold">Email</span>
//               <input
//                 className="field"
//                 required
//                 type="email"
//                 value={fields.email}
//                 onChange={(e) =>
//                   setFields({ ...fields, email: e.target.value })
//                 }
//                 placeholder="you@example.com"
//               />
//             </label>
//             <label className="block">
//               <span className="mb-2 block text-sm font-semibold">Password</span>
//               <input
//                 className="field"
//                 required
//                 minLength="6"
//                 type="password"
//                 value={fields.password}
//                 onChange={(e) =>
//                   setFields({ ...fields, password: e.target.value })
//                 }
//                 placeholder="••••••••"
//               />
//             </label>
//           </div>
//           {error && (
//             <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
//               {error}
//             </p>
//           )}
//           <button className="button-primary mt-6 w-full" disabled={pending}>
//             {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
//           </button>
//           <p className="mt-6 text-center text-sm text-slate-500">
//             {isLogin ? "New here?" : "Already have an account?"}{" "}
//             <button
//               type="button"
//               className="font-bold text-violet"
//               onClick={onToggle}
//             >
//               {isLogin ? "Create an account" : "Sign in"}
//             </button>
//           </p>
//         </form>
//       </section>
//     </main>
//   );
// }


import { useState } from "react";

const initialFields = { username: "", email: "", password: "" };

export default function AuthScreen({
  mode,
  onSubmit,
  pending,
  error,
  onToggle,
}) {
  const [fields, setFields] = useState(initialFields);
  const isLogin = mode === "login";

  const submit = (event) => {
    event.preventDefault();
    onSubmit(fields);
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-ink p-8 md:p-14 lg:block">
        <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-violet/80 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl md:h-96 md:w-96" />
        <div className="relative flex h-full flex-col justify-between text-white">
          <div className="text-xl font-black tracking-tight md:text-2xl">
            orbital<span className="text-violet-300">.</span>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-violet-200 md:text-sm">
              Find your orbit
            </p>
            <h1 className="max-w-lg text-3xl font-black leading-tight md:text-4xl xl:text-5xl">
              A calmer place to share what matters.
            </h1>
          </div>
          <p className="text-sm text-slate-300">
            Built for the conversations that stay with you.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-4 xs:p-6 sm:p-10">
        <form className="w-full max-w-md" onSubmit={submit}>
          <div className="mb-8 text-xl font-black sm:mb-10 sm:text-2xl lg:hidden">
            orbital<span className="text-violet">.</span>
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet sm:text-sm">
            Welcome {isLogin ? "back" : "to Orbital"}
          </p>
          <h2 className="text-2xl font-black sm:text-3xl">
            {isLogin ? "Sign in to your orbit" : "Create your account"}
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            {isLogin
              ? "Your community is waiting for you."
              : "Start sharing your perspective today."}
          </p>
          <div className="mt-6 space-y-4 sm:mt-8">
            {!isLogin && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Username
                </span>
                <input
                  className="field w-full"
                  required
                  value={fields.username}
                  onChange={(e) =>
                    setFields({ ...fields, username: e.target.value })
                  }
                  placeholder="yourname"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <input
                className="field w-full"
                required
                type="email"
                value={fields.email}
                onChange={(e) =>
                  setFields({ ...fields, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <input
                className="field w-full"
                required
                minLength="6"
                type="password"
                value={fields.password}
                onChange={(e) =>
                  setFields({ ...fields, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 break-words">
              {error}
            </p>
          )}
          <button className="button-primary mt-6 w-full" disabled={pending}>
            {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-bold text-violet"
              onClick={onToggle}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}