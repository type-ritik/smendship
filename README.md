# smendship - Facebook Clone

A full-stack Facebook-inspired social media application built to practice modern web development concepts, including secure authentication, database management, and responsive user interfaces.

## ✨ Features

* User Registration & Login
* JWT Authentication
* Password Hashing with bcrypt
* Protected Routes
* Create, Edit, and Delete Posts
* Like and Comment System *(if implemented)*
* User Profile
* Responsive UI

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* React Router
* Redux-toolkit

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* GraphQL

### Database

* PostgreSQL
* Prisma ORM

## 📁 Project Structure

```text
my-app/
│
├── frontend/client/        # React Frontend
├── backend/        # Express Backend
└── README.md
```

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/type-ritik/smendship.git
cd my-app
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

## ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
PORT=5000
```

## 🗄️ Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

## ▶️ Run the Application

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

## 📚 What I Learned

This project helped me gain hands-on experience with:

* Building GraphQL APIs using Express.js
* Secure authentication using JWT
* Password hashing with bcrypt
* Database modeling using Prisma ORM
* PostgreSQL relationships
* Building reusable React components
* Managing frontend and backend integration

## 🎯 Future Improvements

* Google & GitHub OAuth
* Image Uploads
* Real-time Notifications
* Real-time Chat
* Friend Requests
* Profile Editing
* Infinite Feed Scrolling
* Deployment

## 🤝 Contributions

Suggestions and feedback are always welcome. Feel free to fork the repository and submit a pull request.

## 📄 License

This project is for learning and educational purposes.
