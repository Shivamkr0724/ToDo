import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("https://todo-vz4h.onrender.com/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-3 rounded mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded cursor-pointer">
          Send Reset Link
        </button>

        {/* SUCCESS MESSAGE */}
        {msg && (
          <p className="text-green-600 text-sm mt-3 text-center">{msg}</p>
        )}

        {/* ⭐ ALWAYS SHOW LOGIN LINK */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </form>
    </div>
  );
}
