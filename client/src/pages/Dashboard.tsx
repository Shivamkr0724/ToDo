import { useState, useEffect, useMemo } from "react";
import NoTaskImage from "../assets/empty.png";
import AddTaskModal from "../components/AddTaskModal.tsx";

// ---------------- TYPES ----------------
interface Task {
  _id: string;
  text: string;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------- ICONS ----------------
function IconSearch() {
  return (
    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.121 2.121 0 00-3-3L5 17v3z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 7L5 7M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12" />
    </svg>
  );
}

// ========== DASHBOARD PAGE ==========
export default function Dashboard(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [dark, setDark] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [todos, setTodos] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ⭐ LOGOUT
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  // Fetch todos
  useEffect(() => {
    async function fetchTodos() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/todo", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });

        if (res.status === 401) return handleLogout();

        const data: Task[] = await res.json();
        setTodos(data);
      } catch (err) {
        console.log("Error:", err);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, []);

  // FILTERED TASKS
  const filtered = useMemo(() => {
    return todos.filter((t) => {
      if (filter === "ACTIVE" && t.done) return false;
      if (filter === "COMPLETED" && !t.done) return false;
      if (query && !t.text.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [todos, query, filter]);

  // ADD NEW TODO
  async function addNewTodo(text: string) {
    try {
      const res = await fetch("http://localhost:8000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ text }),
      });

      const created: Task = await res.json();
      setTodos((prev) => [created, ...prev]);
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  }

  // TOGGLE DONE
  async function toggleDone(id: string, done: boolean) {
    try {
      await fetch(`http://localhost:8000/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ done: !done }),
      });

      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, done: !done } : t)));
    } catch (err) {
      console.log(err);
    }
  }

  // DELETE TASK
  async function deleteTask(id: string) {
    try {
      await fetch(`http://localhost:8000/todo/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  // EDIT TASK
  async function updateTodo(id: string, newText: string) {
    try {
      const res = await fetch(`http://localhost:8000/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ text: newText }),
      });

      if (!res.ok) throw new Error("Error updating task");

      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, text: newText } : t))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className={
        "min-h-screen flex items-start justify-center py-12 px-4 " +
        (dark ? "bg-black text-gray-100" : "bg-gray-50 text-gray-900")
      }
    >
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-widest">TODO LIST</h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDark((d) => !d)}
              className={"p-2 cursor-pointer rounded-md shadow " + (dark ? "bg-violet-600" : "bg-gray-700")}
            >
              <IconMoon />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3 items-center mb-6">
          <div className="flex-1 relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search note..."
              className={
                "w-full rounded-md border px-4 py-3 pr-10 " +
                (dark
                  ? "bg-transparent border-violet-500 text-gray-100"
                  : "bg-white border-gray-700 text-gray-900")
              }
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <IconSearch />
            </div>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "ALL" | "ACTIVE" | "COMPLETED")}
            className={
              "px-3 py-2 rounded-md border " +
              (dark
                ? "bg-violet-600 text-white border-violet-500"
                : "bg-white text-gray-900 border-gray-700")
            }
          >
            <option value="ALL">ALL</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        {/* TASKS */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 opacity-80">
              <img src={NoTaskImage} className="w-52 h-52 mb-4" />
              <p className="text-gray-400 text-lg">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((task) => (
                <div key={task._id} className="flex items-center gap-4 border-b pb-3">
                  {/* Toggle Done */}
                  <label className="flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleDone(task._id, task.done)}
                      className="w-5 h-5 accent-violet-500"
                    />

                    <div className={task.done ? "line-through text-gray-500 flex-1" : "flex-1 font-semibold"}>
                      {task.text}
                    </div>
                  </label>

                  {/* Edit + Delete */}
                  <div className="flex gap-2">
                    <button
                      className="p-1 cursor-pointer"
                      onClick={() => {
                        setEditTask(task);
                        setShowModal(true);
                      }}
                    >
                      <IconEdit />
                    </button>

                    <button className="p-1 cursor-pointer" onClick={() => deleteTask(task._id)}>
                      <IconTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD BUTTON + MODAL */}
        <div className="fixed right-8 bottom-8">
          <button
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center bg-violet-600 cursor-pointer"
            onClick={() => {
              setEditTask(null);
              setShowModal(true);
            }}
          >
            <IconPlus />
          </button>

          <AddTaskModal
               isOpen={showModal}
               onClose={() => setShowModal(false)}
               task={editTask}
               dark={dark}        // ✅ MUST be "dark"
               onSubmit={(text, oldTask) => {
               if (oldTask) updateTodo(oldTask._id, text);
                else addNewTodo(text);
               setShowModal(false);
               }}
           />

        </div>
      </div>
    </div>
  );
}
