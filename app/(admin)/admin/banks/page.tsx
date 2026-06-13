import { Button } from "@/components/ui/button";
import { banks } from "@/constants/banks";

export default function AdminBanksPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Banks & NBFCs</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage partner institutions on the platform</p>
        </div>
        <Button type="button" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
          + Add Institution
        </Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Partners", value: banks.length },
          { label: "Small Finance Banks", value: banks.filter(b => b.type === "Small Finance Bank").length },
          { label: "NBFCs", value: banks.filter(b => b.type === "NBFC").length },
          { label: "Private / PSU Banks", value: banks.filter(b => b.type === "Private Bank" || b.type === "Public Sector Bank").length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {banks.map(bank => (
          <div key={bank.id} className="bg-white rounded-2xl border shadow-sm p-5 card-hover" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shrink-0" style={{ background: "var(--primary)" }}>
                {bank.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{bank.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{bank.type}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${bank.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {bank.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              {[
                { label: "Rating", value: `${bank.rating} (${bank.ratingAgency})` },
                { label: "Est.", value: bank.established },
                { label: "HQ", value: bank.hq },
              ].map(({ label, value }) => (
                <div key={label} className="p-2 rounded-lg" style={{ background: "var(--bg-light)" }}>
                  <p style={{ color: "var(--text-secondary)" }}>{label}</p>
                  <p className="font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{bank.description}</p>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1 text-xs font-semibold py-2 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)", color: "var(--primary)" }}>
                Edit
              </Button>
              <Button type="button" variant="outline" className="flex-1 text-xs font-semibold py-2 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--border)", color: bank.isActive ? "var(--danger)" : "var(--success)" }}>
                {bank.isActive ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
