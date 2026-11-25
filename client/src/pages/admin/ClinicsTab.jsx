import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errors";
import { inputClass, primaryButton, cardClass } from "../../utils/ui";

const emptyForm = {
  name: "",
  address: "",
  phone: "",
  openTime: "09:00",
  closeTime: "18:00",
};

export default function ClinicsTab() {
  const [clinics, setClinics] = useState(null); // null means "still loading"
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch the list on first load, and again whenever reloadKey changes
  useEffect(() => {
    let ignore = false;
    api
      .get("/clinics")
      .then((res) => {
        if (!ignore) setClinics(res.data.clinics);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.phone) delete payload.phone;
      await api.post("/clinics", payload);
      setForm(emptyForm);
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(clinic) {
    setError("");
    try {
      await api.patch(`/clinics/${clinic._id}`, { isActive: !clinic.isActive });
      reload();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className={`${cardClass} space-y-3`}>
        <h2 className="font-semibold">Add a clinic</h2>
        <input
          name="name"
          placeholder="Clinic name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
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
        <div className="flex gap-3">
          <label className="flex-1 text-sm">
            Opens
            <input
              name="openTime"
              type="time"
              value={form.openTime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
          <label className="flex-1 text-sm">
            Closes
            <input
              name="closeTime"
              type="time"
              value={form.closeTime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
        </div>
        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? "Saving..." : "Add clinic"}
        </button>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold mb-3">Clinics</h2>
        {clinics === null && <p>Loading...</p>}
        {clinics?.length === 0 && (
          <p className="text-gray-500">No clinics yet.</p>
        )}
        <ul className="divide-y">
          {clinics?.map((c) => (
            <li
              key={c._id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium">
                  {c.name}
                  {!c.isActive && (
                    <span className="ml-2 text-xs text-red-600">
                      (inactive)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {c.address} · {c.openTime} to {c.closeTime}
                </p>
              </div>
              <button
                onClick={() => toggleActive(c)}
                className="border rounded px-3 py-1 text-sm"
              >
                {c.isActive ? "Deactivate" : "Activate"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
