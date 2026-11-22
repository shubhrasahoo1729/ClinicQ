import { useAuth } from "../context/AuthContext";

export default function Placeholder({ title }) {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2">
        Signed in as {user.name} ({user.role})
      </p>
      <button onClick={logout} className="mt-4 border rounded px-3 py-2">
        Log out
      </button>
    </div>
  );
}
