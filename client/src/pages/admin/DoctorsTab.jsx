import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getErrorMessage } from "../../utils/errors";
import { inputClass, primaryButton, cardClass, DAYS } from "../../utils/ui";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  clinicId: "",
  specialization: "",
  startTime: "09:00",
  endTime: "13:00",
  slotMinutes: 15,
  avgConsultMinutes: 10,
};
const defaultDays = [1, 2, 3, 4, 5, 6];

export default function DoctorsTab() {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [workingDays, setWorkingDays] = useState(defaultDays);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.all([api.get("/clinics"), api.get("/doctors")])
      .then(([c, d]) => {
        if (ignore) return;
        setClinics(c.data.clinics);
        setDoctors(d.data.doctors);
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

  const toggleDay = (day) =>
    setWorkingDays((days) =>
      days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
    );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (workingDays.length === 0) {
      setError("Choose at least one working day");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        workingDays: [...workingDays].sort((a, b) => a - b),
        slotMinutes: Number(form.slotMinutes),
        avgConsultMinutes: Number(form.avgConsultMinutes),
      };
      if (!payload.phone) delete payload.phone;

      await api.post("/doctors", payload);
      setForm(emptyForm);
      setWorkingDays(defaultDays);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const clinicName = (id) =>
    clinics.find((c) => c._id === id)?.name || "Unknown clinic";
  const activeClinics = clinics.filter((c) => c.isActive);

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className={`${cardClass} space-y-3`}>
        <h2 className="font-semibold">Add a doctor</h2>
        <p className="text-sm text-gray-600">
          This also creates the doctor's login. Share the email and password
          with them.
        </p>

        <input
          name="name"
          placeholder="Doctor's full name"
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

        <input
          name="specialization"
          placeholder="Specialization (e.g. General Physician)"
          value={form.specialization}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <div>
          <p className="text-sm mb-1">Working days</p>
          <div className="flex flex-wrap gap-3">
            {DAYS.map((label, day) => (
              <label key={label} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={workingDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <label className="flex-1 text-sm">
            Start
            <input
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
          <label className="flex-1 text-sm">
            End
            <input
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex gap-3">
          <label className="flex-1 text-sm">
            Slot length (min)
            <input
              name="slotMinutes"
              type="number"
              min="5"
              max="60"
              value={form.slotMinutes}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
          <label className="flex-1 text-sm">
            Avg consultation (min)
            <input
              name="avgConsultMinutes"
              type="number"
              min="1"
              max="120"
              value={form.avgConsultMinutes}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
        </div>

        <button type="submit" disabled={submitting} className={primaryButton}>
          {submitting ? "Saving..." : "Add doctor"}
        </button>
      </form>

      <div className={cardClass}>
        <h2 className="font-semibold mb-3">Doctors</h2>
        {doctors === null && <p>Loading...</p>}
        {doctors?.length === 0 && (
          <p className="text-gray-500">No doctors yet.</p>
        )}
        <ul className="divide-y">
          {doctors?.map((d) => (
            <li key={d._id} className="py-3">
              <p className="font-medium">
                {d.user?.name}{" "}
                <span className="text-gray-500 font-normal">
                  · {d.specialization}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {clinicName(d.clinic)} ·{" "}
                {d.workingDays.map((n) => DAYS[n]).join(", ")} · {d.startTime}{" "}
                to {d.endTime}
              </p>
              <p className="text-sm text-gray-600">{d.user?.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
