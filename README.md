# ⚡ Real-Time File Transfer App
A full-stack real-time file sharing platform built with **React**, **Node.js**, **Socket.IO**, and **MongoDB**. It allows registered users to securely upload and send files to other online users with real-time updates and a beautiful animated UI.
## ✨ Features
- 🔒 **User Authentication** (Login/Register)
- 📁 **File Upload & Download** (real-time)
- 👥 **Real-Time Online User Detection**
- 💬 **Socket.IO-powered Instant Transfers**
- 📜 **Transfer History** (Sent & Received)
- 🌗 **Dark/Light Theme Toggle**
- 🎥 **Animated Backgrounds (Video-based)**
- 💾 **MongoDB for Persistent Storage**

## 📁 Project Structure
/client       # React Frontend
/server       # Node.js Backend
/public       # Video background, favicon, etc.
README.md

## 🚀 Getting Started
### ✅ Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git
- Vercel (for deployment)
- [Socket.IO](https://socket.io/) installed on both client & server

## 🧱 Backend Setup (Express + MongoDB + Socket.IO)
### 1. Navigate to backend directory
```bash
cd server
### 2. Install dependencies
```bash
npm install
### 3. Create `.env` file
```env
PORT=5000
MONGO_URI=mongodb+srv://<your-user>:<password>@cluster.mongodb.net/your-db
JWT_SECRET=your-secret-key
### 4. Start the server
```bash
node server.js
# OR with nodemon
nodemon server.js
The server runs on: [http://localhost:5000](http://localhost:5000)

## ⚛️ Frontend Setup (React + Socket.IO-Client)
### 1. Navigate to frontend directory
```bash
cd client
### 2. Install dependencies
```bash
npm install
### 3. Start the frontend
```bash
npm start
Runs at: [http://localhost:3000](http://localhost:3000)
## 🔌 Socket.IO Configuration

* Real-time communication between client and server using `socket.io` and `socket.io-client`.
* `server/index.js` handles events like `file_upload`, `file_received`, and `online_users`.
* `client/FileUpload.js` and `client/History.js` connect to socket with auth token.

Example client connection:
```js
const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

## 🧠 MongoDB Structure

* **Users Collection**

  * `{ username, password (hashed) }`

* **Files Collection**

  * `{ sender, recipient, name, type, size, timestamp }`

> Each file transfer is logged in MongoDB with metadata for history tracking.

## 🔒 Authentication (JWT)
* `/register`: Creates a new user
* `/login`: Returns a JWT token
* Token is used in:
  * Fetching history (`Authorization` header)
  * Socket authentication (`auth.token`)

## 🌐 Deployment
### ✅ Deploy Backend
Use **Render**, **Railway**, or **Fly.io**:

1. Push `server/` code to GitHub
2. Deploy via platform
3. Get a public API URL: `https://your-backend.onrender.com`
### ✅ Deploy Frontend to Vercel
1. Push `client/` code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import the GitHub repo
4. Set build command: `npm run build`
5. Set output directory: `build`
6. Add environment variables if needed
7. Deploy!

## 📸 Screenshots
| Login/Register              | File Transfer                     | History                         |
| --------------------------- | --------------------------------- | ------------------------------- |
| ![Login](public/loginfile.png) | ![Transfer](public/filetransfer.png) | ![History](public/ftahistory.png) |
| ![Login](public/loginfta2.png) | ![Transfer](public/fta2.png) | ![History](public/ftahistory2.png) |
| ![Login](public/ftaregister.png) | ![Transfer](public/fta4.png) | ![History](public/fta6.png) |

## 📂 File Preview Icons
The app detects file types and displays relevant icons:

| Type  | Icon |
| ----- | ---- |
| Image | 🖼   |
| Video | 🎥   |
| Audio | 🎵   |
| PDF   | 📄   |
| Other | 📁   |

## 📽 Background Video
* Video is placed inside `public/bg.mp4`
* Used in login and history pages using:

```html
<video autoPlay muted loop id="bg-video">
  <source src="/bg.mp4" type="video/mp4" />
</video>

## 🛠 Technologies Used
* **Frontend**: React, CSS, Socket.IO-client
* **Backend**: Node.js, Express.js, MongoDB, JWT, Socket.IO
* **Styling**: Custom CSS with dark/light themes
* **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## 👤 Author
**Zubeen Naqvi**
*"Code. Transfer. Repeat. 💻⚡"*
> Feel free to fork, star, and contribute!

