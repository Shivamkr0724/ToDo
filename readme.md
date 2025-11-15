# ✅ Full-Stack MERN Todo App (JWT Auth + Forgot Password + Email)

A full-stack Todo application built using **React**, **Express**, **MongoDB**, and **JWT Authentication**.  
This project includes **protected routes**, **user authentication**, **forgot/reset password via email**, and a complete **task management system**.

---

## 🚀 Features

### 🔐 **Authentication**
- User Registration  
- User Login  
- Secure JWT Authentication  
- Protected API Routes  
- Token stored using HttpOnly cookie / localStorage  
- Auto-logout on token expiry  

### 📧 **Forgot/Reset Password**
- Users can request password reset  
- Reset link is sent using **Resend email service**  
- Secure one-time reset token  
- Token verification and password updating  

### 📝 **Todo Management**
- Create tasks  
- Update tasks  
- Mark task as completed  
- Delete tasks  
- Filter tasks  
- Mobile-friendly UI  

### 🖥 **Frontend (React + Vite)**
- Modern React with hooks  
- Protected routes  
- Reusable components  
- Responsive design  
- TypeScript support (optional)

### 🛠 **Backend (Node.js + Express)**
- REST API with proper routing  
- Authentication middleware  
- MongoDB models  
- Secure password hashing using bcrypt  
- Error handling  

### 📦 **Database**
- MongoDB (Mongoose ODM)

---

## 🏗️ Tech Stack

### **Frontend**
- React  
- Vite  
- Axios  
- React Router  
- Tailwind CSS  

### **Backend**
- Node.js  
- Express.js  
- JWT (jsonwebtoken)  
- Bcrypt  
- Mongoose  

### **Email Provider**
- **Resend** (for forgot password emails)

---

## 📁 Folder Structure
project/
│
├── client/ # React Frontend
│ ├── src/
│ ├── vite.config.ts
│ ├── tsconfig.json
│ └── package.json
│
└── server/ # Express Backend
├── routes/
├── models/
├── middlewares/
├── database/
├── server.ts
└── package.json

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Shivamkr0724/ToDo
cd ToDo/client
cd ToDO/server
```

**Installation**

Install the project dependencies using npm:

frontend/backend

```bash
cd client
npm install

cd server
npm install
```

**Running the Project**

```bash
cd client
npm install

cd server
npm run dev
```

Open frontend [http://localhost:5173] backend (http://localhost:8000)

