<!-- # Group Chat App - Project Structure

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, MySQL, Sequelize
- **Authentication**: JWT
- **Real-time**: Socket.io

## Features
✅ User signup/login with JWT
✅ Create/join groups
✅ Real-time messaging with Socket.io
✅ Message history
✅ Online/offline status
✅ File sharing (images, documents)
✅ Typing indicators
✅ Read receipts
✅ Group admin controls
✅ User profiles

---

## Backend Structure

```
Backend/
├── config/
│   ├── database.js          # Sequelize MySQL connection
│   └── config.js            # Sequelize CLI config
├── models/
│   ├── user.js              # User model
│   ├── group.js             # Group model
│   ├── message.js           # Message model
│   ├── groupMember.js       # Group membership
│   └── messageRead.js       # Read receipts
├── controllers/
│   ├── authController.js    # Signup, login
│   ├── groupController.js   # Create, join groups
│   ├── messageController.js # Send, fetch messages
│   └── userController.js    # User profile, status
├── routes/
│   ├── authRoutes.js
│   ├── groupRoutes.js
│   ├── messageRoutes.js
│   └── userRoutes.js
├── middlewares/
│   ├── authMiddleware.js    # JWT verification
│   └── uploadMiddleware.js  # Multer file upload
├── socket/
│   ├── socketHandler.js     # Socket.io events
│   └── socketAuth.js        # Socket authentication
├── utils/
│   └── helpers.js           # Utility functions
├── migrations/              # Sequelize migrations
├── uploads/                 # Uploaded files
├── .env
├── .sequelizerc
├── package.json
├── app.js
└── server.js
```

### Backend Models

**User**
- id, name, email, password, profilePicture, status (online/offline), lastSeen

**Group**
- id, name, description, groupImage, createdBy, createdAt

**GroupMember**
- id, groupId, userId, role (admin/member), joinedAt

**Message**
- id, groupId, senderId, content, messageType (text/image/file), fileUrl, createdAt

**MessageRead**
- id, messageId, userId, readAt

---

## Frontend Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── layout.js        # Root layout
│   │   ├── page.js          # Home/Landing
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── signup/
│   │   │   └── page.js
│   │   ├── chat/
│   │   │   └── page.js      # Main chat interface
│   │   └── profile/
│   │       └── page.js
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── FileUpload.jsx
│   │   ├── groups/
│   │   │   ├── GroupList.jsx
│   │   │   ├── GroupItem.jsx
│   │   │   ├── CreateGroup.jsx
│   │   │   └── GroupSettings.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       └── Avatar.jsx
│   ├── context/
│   │   ├── AuthContext.js   # Auth state
│   │   └── ChatContext.js   # Chat state
│   ├── socket/
│   │   └── socket.js        # Socket.io client setup
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   └── useChat.js
│   ├── lib/
│   │   └── api.js           # Axios instance
│   └── utils/
│       └── helpers.js
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=group_chat_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Database Schema

### Users Table
- id (PK)
- name
- email (unique)
- password (hashed)
- profilePicture
- status (online/offline)
- lastSeen
- createdAt, updatedAt

### Groups Table
- id (PK)
- name
- description
- groupImage
- createdBy (FK -> Users)
- createdAt, updatedAt

### GroupMembers Table
- id (PK)
- groupId (FK -> Groups)
- userId (FK -> Users)
- role (admin/member)
- joinedAt

### Messages Table
- id (PK)
- groupId (FK -> Groups)
- senderId (FK -> Users)
- content
- messageType (text/image/file)
- fileUrl
- createdAt

### MessageReads Table
- id (PK)
- messageId (FK -> Messages)
- userId (FK -> Users)
- readAt

---

## Socket.io Events

### Client -> Server
- `join_group` - Join a group room
- `leave_group` - Leave a group room
- `send_message` - Send a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `mark_read` - Mark message as read

### Server -> Client
- `new_message` - New message received
- `user_typing` - Someone is typing
- `user_stopped_typing` - Stopped typing
- `message_read` - Message read by someone
- `user_online` - User came online
- `user_offline` - User went offline

---

## Installation & Setup

### Backend
```bash
cd Backend
npm install
# Create database
mysql -u root -p
CREATE DATABASE group_chat_db;
# Run migrations
npx sequelize-cli db:migrate
# Start server
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

---

## API Endpoints

### Auth
- POST `/api/auth/signup` - Register user
- POST `/api/auth/login` - Login user

### Groups
- GET `/api/groups` - Get user's groups
- POST `/api/groups` - Create group
- POST `/api/groups/:id/join` - Join group
- GET `/api/groups/:id/members` - Get group members
- PUT `/api/groups/:id` - Update group (admin only)

### Messages
- GET `/api/messages/:groupId` - Get group messages
- POST `/api/messages` - Send message (with file upload)
- PUT `/api/messages/:id/read` - Mark as read

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users/:id/status` - Get user status

---

## Development Tips

1. Start backend first, then frontend
2. Test Socket.io connection before building features
3. Use Postman to test API endpoints
4. Implement authentication first
5. Build basic chat before adding advanced features
6. Test file upload separately

---

## Next Steps

1. Set up database and run migrations
2. Implement authentication (signup/login)
3. Create group functionality
4. Build real-time messaging with Socket.io
5. Add file upload
6. Implement typing indicators
7. Add read receipts
8. Build UI with Tailwind CSS
9. Add online status
10. Test and deploy

Good luck building! 🚀 -->
