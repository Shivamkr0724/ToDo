import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }

    const res = await fetch(`https://todo-vz4h.onrender.com/auth/reset/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErr(data.message || "Something went wrong");
      return;
    }

    setMsg("Password updated successfully! Redirecting to login...");

    // 🔥 Redirect to login after 1 second
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded-lg shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        {err && <p className="text-red-500 text-sm mb-2">{err}</p>}
        {msg && <p className="text-green-600 text-sm mb-2">{msg}</p>}

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border p-3 rounded mb-3"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer">
          Update Password
        </button>
      </form>
    </div>
  );
}
