import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errors";
import { inputClass, primaryButton, cardClass } from "../../utils/ui";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  clinicId: "",
};

export default function StaffTab() {
  const [clinics, setClinics] = useState([]);
  const [staff, setStaff] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.all([api.get("/clinics"), api.get("/staff/receptionists")])
      .then(([c, s]) => {
        if (ignore) return;
        setClinics(c.data.clinics);
        setStaff(s.data.staff);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.phone) delete payload.phone;
      await api.post("/staff/receptionists", payload);
      setForm(emptyForm);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const activeClinics = clinics.filter((c) => c.isActive);

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className={`${cardClass} space-y-3`}>
        <h2 className="font-semibold">Add a receptionist</h2>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="email"
          type="email"
          placeholder="Login email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="phone"
          placeholder="Phone (10 digits, optional)"
          value={form.phone}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="password"
          type="password"
          placeholder="Starting password (8+ chars, letter and number)"
          value={form.password}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <select
          name="clinicId"
          value={form.clinicId}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Select clinic</option>
          {activeClinics.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? "Saving..." : "Add receptionist"}
        </button>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold mb-3">Receptionists</h2>
        {staff === null && <p>Loading...</p>}
        {staff?.length === 0 && (
          <p className="text-gray-500">No receptionists yet.</p>
        )}
        <ul className="divide-y">
          {staff?.map((s) => (
            <li key={s._id} className="py-3">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-600">
                {s.email} · {s.clinic?.name || "No clinic"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
