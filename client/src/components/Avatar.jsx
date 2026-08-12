export default function Avatar({ user, name, size = "md", onClick }) {
  const label = name || user?.username || "Member";
  const dimensions = size === "lg" ? "h-24 w-24 text-3xl" : "h-11 w-11 text-sm";
  const image = user?.avatar_url || user?.avatarUrl;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet to-indigo-400 font-black text-white ${dimensions}`}
      aria-label={`View ${label}'s profile`}
    >
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        label[0]?.toUpperCase()
      )}
    </button>
  );
}
