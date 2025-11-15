import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const navigate = useNavigate();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("https://todo-vz4h.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error: any) {
      setErr(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
        <div className="flex justify-center items-center w-full">
               <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0nOf8qSK9p1Eqjl1QNmvibzrzvZ4UujhVnQ&s"
            alt="ToDo App Logo"
            className="w-32 h-22 mb-6 object-cover rounded-4xl"
          />
        </div>
         

        <h2 className="text-3xl font-bold">Login</h2>
        <p className="text-gray-500">to get started</p>

        <form onSubmit={handleLogin} className="mt-4 space-y-5">
          {err && <p className="text-red-500 text-sm">{err}</p>}

          <input
            type="email"
            placeholder="shivam@gmail.com"
            className="w-full px-4 py-3 rounded-xl border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Link to="/forgot-password" className="text-blue-700 text-sm hover:underline">
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full py-3 cursor-pointer rounded-xl bg-blue-700 text-white text-lg mt-2"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          New User? <Link to="/register" className="text-black font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}
