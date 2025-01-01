# Full-Stack/MERN Social Network App

## Overview
This project is a full-stack social network application built using the MERN (MongoDB, Express.js, React, Node.js) stack with a Tailwind CSS frontend. The app offers a platform for users to interact by creating posts, commenting, liking, and managing followers, with additional features for privacy and user control.

---

## Features

### 1. **Users**
- Sign-up and sign-in functionality.
- Users can add required information such as:
  - Email
  - First name
  - Last name
  - Mobile number
- Option to upload a display photo.

### 2. **Posts**
- All post data is stored, including creator information and timestamps.
- Users can:
  - Create posts (up to 2 images per post).
  - Edit and delete their own posts.
  - Like posts visible to them.

### 3. **Comments**
- A post can have multiple comments.
- Users can:
  - Add comments.
  - Delete comments on their own posts.
  - Edit or delete their own comments on any post.
  - Like any comment visible to them.

### 4. **Followers**
- Users can follow each other.
- Accounts can be set as:
  - Public: Posts visible to everyone.
  - Private: Posts visible only to followers.
- Additional functionality:
  - Follow requests for private accounts must be accepted by the user.
  - Users can block other users, preventing:
    - Follow requests.
    - Visibility of posts (even for public accounts).
  - Users can view:
    - Who follows them.
    - Who they follow.

---

## Bonus Features
- **Follow Requests**: Users need to accept follow requests for private accounts.
- **Blocking**: Blocked users cannot:
  - Send follow requests.
  - View posts, even on public accounts.

---

## Technical Stack
- **Frontend**: React.js with Tailwind CSS for styling.
- **Backend**: Node.js with Express.js.
- **Database**: MongoDB.

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/AhsanCommits/social-network.git
   ```

2. Navigate to the project directory:
   ```bash
   cd social-network
   ```

3. Install dependencies for both frontend and backend:
   ```bash
   cd client
   npm install
   cd backend
   npm install
   ```

4. Start the development servers:
   - Backend:
     ```bash
     npm start
     ```
   - Frontend:
     ```bash
     cd client
     npm start
     ```

5. Open the app in your browser at `http://localhost:3000`.

---

## Folder Structure
```
social-network/
|-- backend/
|   |-- models/        # Mongoose schemas
|   |-- routes/        # API routes
|   |-- controllers/   # Route handlers
|   |-- middleware/    # Authentication and validation middleware
|   `-- server.js      # Server setup
|
|-- client/
|   |-- src/
|       |-- components/ # Reusable components
|       |-- pages/      # Page components
|       |-- services/   # API service calls
|       `-- App.js      # Main app entry point
|
|-- .env               # Environment variables
|-- package.json       # Project dependencies
`-- README.md          # Project documentation
```
---

## Contact
For any questions or feedback, please contact [ahsancommits@gmail.com].