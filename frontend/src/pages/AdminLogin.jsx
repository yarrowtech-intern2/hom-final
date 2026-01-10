import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return toast.error("Enter admin token");

    setLoading(true);
    try {
      // Optional: verify token by calling a protected endpoint
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job-applications?limit=1`, {
        headers: { "x-admin-token": token.trim() },
      });

      if (!res.ok) throw new Error("Invalid admin token");

      localStorage.setItem("ADMIN_TOKEN", token.trim());
      toast.success("Welcome Admin");
      nav("/admin1234");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold text-white">Admin Login</h1>
        <p className="mt-1 text-sm text-white/60">Enter admin access token.</p>

        <input
          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
          placeholder="ADMIN_ACCESS_TOKEN"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-white text-slate-900 py-3 font-semibold disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}
