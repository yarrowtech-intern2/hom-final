// import React, { useEffect, useMemo, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const cn = (...a) => a.filter(Boolean).join(" ");

// function useAdminToken() {
//   return localStorage.getItem("ADMIN_TOKEN") || "";
// }

// export default function AdminDashboard() {
//   const nav = useNavigate();
//   const token = useAdminToken();

//   const [tab, setTab] = useState("applications"); // applications | contacts

//   // shared
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(false);

//   // applications
//   const [apps, setApps] = useState([]);
//   const [status, setStatus] = useState("");
//   const [appsTotal, setAppsTotal] = useState(0);

//   // contacts
//   const [contacts, setContacts] = useState([]);
//   const [contactsTotal, setContactsTotal] = useState(0);

//   const apiBase = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (!token) nav("/admin123");
//   }, [token, nav]);

//   useEffect(() => {
//   const prevBody = document.body.style.overflow;
//   const prevHtml = document.documentElement.style.overflow;

//   document.body.style.overflow = "auto";
//   document.documentElement.style.overflow = "auto";

//   return () => {
//     document.body.style.overflow = prevBody;
//     document.documentElement.style.overflow = prevHtml;
//   };
// }, []);


//   const headers = useMemo(() => ({ "x-admin-token": token }), [token]);

//   async function fetchApplications() {
//     setLoading(true);
//     try {
//       const url = new URL(`${apiBase}/api/job-applications`);
//       if (q) url.searchParams.set("q", q);
//       if (status) url.searchParams.set("status", status);
//       url.searchParams.set("limit", "50");

//       const res = await fetch(url.toString(), { headers });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to load applications");

//       setApps(data.items || []);
//       setAppsTotal(data.total || 0);
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function fetchContacts() {
//     setLoading(true);
//     try {
//       const url = new URL(`${apiBase}/api/admin/contacts`);
//       if (q) url.searchParams.set("q", q);
//       url.searchParams.set("limit", "50");

//       const res = await fetch(url.toString(), { headers });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to load contacts");

//       setContacts(data.items || []);
//       setContactsTotal(data.total || 0);
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!token) return;
//     if (tab === "applications") fetchApplications();
//     else fetchContacts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tab]);

//   async function onSearch(e) {
//     e.preventDefault();
//     if (tab === "applications") fetchApplications();
//     else fetchContacts();
//   }

//   function logout() {
//     localStorage.removeItem("ADMIN_TOKEN");
//     nav("/admin123");
//   }

//   async function downloadResume(appId) {
//     try {
//       const res = await fetch(`${apiBase}/api/job-applications/${appId}/resume`, {
//         headers,
//       });
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || "Resume download failed");
//       }
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `resume-${appId}`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       toast.error(e.message);
//     }
//   }

//   async function updateStatus(appId, nextStatus) {
//     try {
//       const res = await fetch(`${apiBase}/api/job-applications/${appId}/status`, {
//         method: "PATCH",
//         headers: { ...headers, "Content-Type": "application/json" },
//         body: JSON.stringify({ status: nextStatus }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to update status");
//       toast.success("Status updated");
//       fetchApplications();
//     } catch (e) {
//       toast.error(e.message);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-black text-white pt-24">
//       <div className="sticky top-0 z-10 border-b border-white/10 bg-black backdrop-blur">
//         <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between ">
//           <div>
//             <h1 className="text-lg font-semibold">Admin Dashboard</h1>
//             <p className="text-xs text-white/60">
//               Manage Contacts & Job Applications
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setTab("applications")}
//               className={cn("rounded-xl px-4 py-2 text-sm font-semibold border border-white/10",
//                 tab === "applications" ? "bg-white text-slate-900" : "bg-white/5 hover:bg-white/10")}
//             >
//               Applications
//             </button>
//             <button
//               onClick={() => setTab("contacts")}
//               className={cn("rounded-xl px-4 py-2 text-sm font-semibold border border-white/10",
//                 tab === "contacts" ? "bg-white text-slate-900" : "bg-white/5 hover:bg-white/10")}
//             >
//               Contacts
//             </button>
//             <button
//               onClick={logout}
//               className="rounded-xl px-4 py-2 text-sm font-semibold bg-rose-500/90 hover:bg-rose-500"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="mx-auto max-w-6xl px-4 pb-4">
//           <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder={tab === "applications" ? "Search name/email/role..." : "Search name/email/message..."}
//               className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
//             />

//             {tab === "applications" && (
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
//               >
//                 <option value="">All Status</option>
//                 <option value="NEW">NEW</option>
//                 <option value="IN_REVIEW">IN_REVIEW</option>
//                 <option value="SHORTLISTED">SHORTLISTED</option>
//                 <option value="REJECTED">REJECTED</option>
//                 <option value="HIRED">HIRED</option>
//               </select>
//             )}

//             <button className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold">
//               {loading ? "Loading..." : "Search"}
//             </button>
//           </form>

//           <div className="mt-2 text-xs text-white/50">
//             {tab === "applications" ? `${appsTotal} applications` : `${contactsTotal} contacts`}
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-6xl px-4 py-6">
//         {tab === "applications" ? (
//           <div className="overflow-hidden rounded-2xl border border-white/10">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-white/5 text-white/70">
//                 <tr>
//                   <th className="p-3">Role</th>
//                   <th className="p-3">Candidate</th>
//                   <th className="p-3">Email</th>
//                   <th className="p-3">Phone</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">CV</th>
//                   {/* <th className="p-3">Actions</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {apps.map((a) => (
//                   <tr key={a._id} className="border-t border-white/10">
//                     <td className="p-3">{a.role}</td>
//                     <td className="p-3">{a.fullName}</td>
//                     <td className="p-3">{a.email}</td>
//                     <td className="p-3">{a.phone || "—"}</td>
//                     <td className="p-3">
//                       <span className="rounded-lg bg-white/10 px-2 py-1 text-xs">{a.status}</span>
//                     </td>
//                     <td className="p-3">
//                       {a.resumePath ? (
//                         <button
//                           onClick={() => downloadResume(a._id)}
//                           className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500"
//                         >
//                           Download
//                         </button>
//                       ) : (
//                         <span className="text-white/40 text-xs">No CV</span>
//                       )}
//                     </td>
//                     {/* <td className="p-3">
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           onClick={() => updateStatus(a._id, "IN_REVIEW")}
//                           className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
//                         >
//                           Review
//                         </button>
//                         <button
//                           onClick={() => updateStatus(a._id, "SHORTLISTED")}
//                           className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
//                         >
//                           Shortlist
//                         </button>
//                         <button
//                           onClick={() => updateStatus(a._id, "REJECTED")}
//                           className="rounded-lg bg-rose-500/80 px-3 py-1.5 text-xs hover:bg-rose-500"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     </td> */}
//                   </tr>
//                 ))}

//                 {!apps.length && (
//                   <tr>
//                     <td className="p-6 text-center text-white/50" colSpan={7}>
//                       No applications found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-2xl border border-white/10">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-white/5 text-white/70">
//                 <tr>
//                   <th className="p-3">Name</th>
//                   <th className="p-3">Email</th>
//                   <th className="p-3">Phone</th>
//                   <th className="p-3">Message</th>
//                   <th className="p-3">Created</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contacts.map((c) => (
//                   <tr key={c._id} className="border-t border-white/10">
//                     <td className="p-3">{c.name || c.fullName || "—"}</td>
//                     <td className="p-3">{c.email}</td>
//                     <td className="p-3">{c.phone || "—"}</td>
//                     <td className="p-3 max-w-[520px] truncate" title={c.message || ""}>
//                       {c.message || "—"}
//                     </td>
//                     <td className="p-3 text-white/60">
//                       {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
//                     </td>
//                   </tr>
//                 ))}

//                 {!contacts.length && (
//                   <tr>
//                     <td className="p-6 text-center text-white/50" colSpan={5}>
//                       No contacts found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











































import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const cn = (...a) => a.filter(Boolean).join(" ");

function useAdminToken() {
  return localStorage.getItem("ADMIN_TOKEN") || "";
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const token = useAdminToken();

  const [tab, setTab] = useState("applications"); // applications | contacts

  // shared
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // applications
  const [apps, setApps] = useState([]);
  const [status, setStatus] = useState("");
  const [appsTotal, setAppsTotal] = useState(0);

  // contacts
  const [contacts, setContacts] = useState([]);
  const [contactsTotal, setContactsTotal] = useState(0);

  const apiBase = API_BASE_URL;

  useEffect(() => {
    if (!token) nav("/admin123");
  }, [token, nav]);

  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  const headers = useMemo(() => ({ "x-admin-token": token }), [token]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const url = new URL(`${apiBase}/api/job-applications`);
      if (q) url.searchParams.set("q", q);
      if (status) url.searchParams.set("status", status);
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load applications");

      setApps(data.items || []);
      setAppsTotal(data.total || 0);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchContacts() {
    setLoading(true);
    try {
      const url = new URL(`${apiBase}/api/admin/contacts`);
      if (q) url.searchParams.set("q", q);
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contacts");

      setContacts(data.items || []);
      setContactsTotal(data.total || 0);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    if (tab === "applications") fetchApplications();
    else fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function onSearch(e) {
    e.preventDefault();
    if (tab === "applications") fetchApplications();
    else fetchContacts();
  }

  function logout() {
    localStorage.removeItem("ADMIN_TOKEN");
    nav("/admin123");
  }

  async function downloadResume(appId) {
    try {
      const res = await fetch(`${apiBase}/api/job-applications/${appId}/resume`, {
        headers,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Resume download failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${appId}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function updateStatus(appId, nextStatus) {
    try {
      const res = await fetch(`${apiBase}/api/job-applications/${appId}/status`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      toast.success("Status updated");
      fetchApplications();
    } catch (e) {
      toast.error(e.message);
    }
  }

  const TabButton = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold border border-white/10 transition",
        active ? "bg-white text-slate-900" : "bg-white/5 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-black backdrop-blur">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold">Admin Dashboard</h1>
            <p className="text-[11px] sm:text-xs text-white/60">
              Manage Contacts & Job Applications
            </p>
          </div>

          {/* Mobile friendly action row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%] sm:max-w-none">
            <TabButton active={tab === "applications"} onClick={() => setTab("applications")}>
              Applications
            </TabButton>
            <TabButton active={tab === "contacts"} onClick={() => setTab("contacts")}>
              Contacts
            </TabButton>
            <button
              onClick={logout}
              className="shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold bg-rose-500/90 hover:bg-rose-500 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-3 sm:px-4 pb-4">
          <form
            onSubmit={onSearch}
            className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                tab === "applications"
                  ? "Search name/email/role..."
                  : "Search name/email/message..."
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            />

            {tab === "applications" && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
              >
                <option value="">All Status</option>
                <option value="NEW">NEW</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="HIRED">HIRED</option>
              </select>
            )}

            <button
              className="w-full sm:w-auto rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold active:scale-[0.99] transition"
              type="submit"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>

          <div className="mt-2 text-[11px] sm:text-xs text-white/50">
            {tab === "applications"
              ? `${appsTotal} applications`
              : `${contactsTotal} contacts`}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-5 sm:py-6">
        {/* ===== APPLICATIONS ===== */}
        {tab === "applications" ? (
          <>
            {/* Mobile cards */}
            <div className="grid gap-3 sm:hidden">
              {apps.map((a) => (
                <div
                  key={a._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {a.fullName || "—"}
                      </div>
                      <div className="mt-0.5 text-xs text-white/70 break-words">
                        {a.email || "—"}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        Phone: {a.phone || "—"}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-xl bg-white/10 px-2.5 py-1 text-[11px]">
                      {a.status}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-white/70">
                    <span className="text-white/50">Role:</span>{" "}
                    <span className="text-white">{a.role || "—"}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {a.resumePath ? (
                      <button
                        onClick={() => downloadResume(a._id)}
                        className="w-full rounded-2xl bg-emerald-500/90 px-4 py-2.5 text-sm font-semibold hover:bg-emerald-500 transition"
                      >
                        Download CV
                      </button>
                    ) : (
                      <div className="w-full text-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50">
                        No CV
                      </div>
                    )}
                  </div>

                  {/* keep backend & structure: actions remain commented out like your original */}
                  {/* 
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => updateStatus(a._id, "IN_REVIEW")} className="...">Review</button>
                  </div> 
                  */}
                </div>
              ))}

              {!apps.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
                  No applications found.
                </div>
              )}
            </div>

            {/* Desktop table (unchanged conceptually) */}
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-[860px] w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="p-3">Role</th>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">CV</th>
                      {/* <th className="p-3">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((a) => (
                      <tr key={a._id} className="border-t border-white/10">
                        <td className="p-3">{a.role}</td>
                        <td className="p-3">{a.fullName}</td>
                        <td className="p-3">{a.email}</td>
                        <td className="p-3">{a.phone || "—"}</td>
                        <td className="p-3">
                          <span className="rounded-lg bg-white/10 px-2 py-1 text-xs">
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {a.resumePath ? (
                            <button
                              onClick={() => downloadResume(a._id)}
                              className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-500"
                            >
                              Download
                            </button>
                          ) : (
                            <span className="text-white/40 text-xs">No CV</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {!apps.length && (
                      <tr>
                        <td className="p-6 text-center text-white/50" colSpan={7}>
                          No applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ===== CONTACTS ===== */}

            {/* Mobile cards */}
            <div className="grid gap-3 sm:hidden">
              {contacts.map((c) => (
                <div
                  key={c._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {c.name || c.fullName || "—"}
                      </div>
                      <div className="mt-0.5 text-xs text-white/70 break-words">
                        {c.email || "—"}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        Phone: {c.phone || "—"}
                      </div>
                    </div>

                    <div className="shrink-0 text-[11px] text-white/60 text-right">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                      <div className="text-[10px] text-white/40">
                        {c.createdAt ? new Date(c.createdAt).toLocaleTimeString() : ""}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-[11px] text-white/50 mb-1">Message</div>
                    <div className="text-sm text-white/80 leading-relaxed break-words">
                      {c.message || "—"}
                    </div>
                  </div>
                </div>
              ))}

              {!contacts.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
                  No contacts found.
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-[860px] w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c._id} className="border-t border-white/10">
                        <td className="p-3">{c.name || c.fullName || "—"}</td>
                        <td className="p-3">{c.email}</td>
                        <td className="p-3">{c.phone || "—"}</td>
                        <td className="p-3 max-w-[520px] truncate" title={c.message || ""}>
                          {c.message || "—"}
                        </td>
                        <td className="p-3 text-white/60">
                          {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}

                    {!contacts.length && (
                      <tr>
                        <td className="p-6 text-center text-white/50" colSpan={5}>
                          No contacts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* tiny utility to hide scrollbar on mobile button row */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

