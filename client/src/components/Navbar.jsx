import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-blue-600">ClinicQ</span>
        <div className="flex items-center gap-3 text-sm">
          <span>
            {user.name} · {user.role}
          </span>
          <button onClick={logout} className="border rounded px-3 py-1">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
