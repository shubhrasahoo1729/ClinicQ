import { useState } from "react";
import Navbar from "../../components/Navbar";
import ClinicsTab from "./ClinicsTab";
import DoctorsTab from "./DoctorsTab";
import StaffTab from "./StaffTab";

const tabs = [
  { key: "clinics", label: "Clinics", Component: ClinicsTab },
  { key: "doctors", label: "Doctors", Component: DoctorsTab },
  { key: "staff", label: "Receptionists", Component: StaffTab },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("clinics");
  const ActiveTab = tabs.find((t) => t.key === active).Component;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 space-y-4">
        <nav className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-4 py-2 rounded ${
                active === t.key ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <ActiveTab />
      </main>
    </div>
  );
}
