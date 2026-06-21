# Postly — Social Media Platform

A full-stack social media application that enables users to share posts, create stories, send real-time messages, follow others, and build a network of connections. Built with a modern JavaScript stack and third-party services for authentication, media hosting, background jobs, and email notifications.

---

## Features

- **Authentication** — Sign-up, sign-in, and session management powered by Clerk (supports social OAuth)
- **User Profiles** — Customizable profiles with avatar, cover photo, bio, location, and username
- **Posts** — Create posts with text and up to 4 images; view in a paginated feed
- **Like System** — Toggle likes on posts with real-time UI feedback
- **Stories** — Create text, image, or video stories that auto-expire after 24 hours
- **Story Viewer** — Full-screen story viewer with auto-progress bar and media support
- **Discover Users** — Search for people by name, username, email, or location
- **Follow System** — Follow and unfollow other users
- **Connection Requests** — Send, accept, and manage bidirectional connections (rate-limited to 20/24h)
- **Real-Time Messaging** — One-on-one chat with text and image messages via Server-Sent Events
- **Read Receipts** — Messages are marked as seen when the chat is opened
- **Recent Messages** — Sidebar showing recent conversations with unread indicators
- **Media Uploads** — Images hosted on ImageKit with automatic format conversion and resizing
- **Background Jobs** — User sync with Clerk, email reminders, story auto-deletion, daily unseen-message digest
- **Email Notifications** — Connection request alerts, 24-hour reminders, and daily message summaries via MailerSend
- **Responsive UI** — Mobile-friendly sidebar with smooth transitions
- **Loading States** — Spinner components and skeleton for async operations
- **Toast Notifications** — User feedback for all async actions via `react-hot-toast`

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| Redux Toolkit | State management (user, messages, connections) |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| @clerk/clerk-react | Authentication UI and hooks |
| lucide-react | Icon set |
| moment.js | Date formatting |
| react-hot-toast | Toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| Express 5 | HTTP framework |
| Mongoose 9 | MongoDB ODM |
| @clerk/express | Auth middleware and webhook verification |
| ImageKit | Image upload and transformation |
| Multer | Multipart form-data parsing |
| Nodemailer | Email sending via MailerSend SMTP |
| Inngest | Background jobs and scheduling |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

### Database

- **MongoDB Atlas** — Cloud-hosted NoSQL database with collections for `User`, `Post`, `Story`, `Message`, and `Connection`

### Authentication

- **Clerk** — Third-party authentication provider handling sign-up, sign-in, multi-factor, and user session management

### Deployment

- **Vercel** — Both client (`client/vercel.json`) and server (`server/vercel.json`) are configured for deployment on Vercel

---

## Architecture Overview

The application follows a **client-server** architecture with a React SPA frontend and an Express REST API backend.

**Data flow:**
1. Users authenticate through Clerk's UI components. Clerk issues JWTs that the frontend stores and forwards on every API request.
2. The backend verifies tokens via `@clerk/express` middleware and extracts the authenticated user ID.
3. The frontend reads this ID via Clerk React hooks and dispatches Redux thunks to fetch user data, connections, and messages on mount.
4. Posts, stories, and messages are served through REST endpoints. Real-time message delivery uses **Server-Sent Events (SSE)** — one open connection per user.
5. File uploads (images for posts, stories, profile, cover, messages) are processed by Multer on the server, then uploaded to ImageKit for CDN-hosted URLs.
6. Background jobs are handled by **Inngest** — Clerk webhooks sync user records to MongoDB, connection request emails are sent with a 24-hour reminder, stories auto-delete after 24 hours, and a daily cron sends unseen-message digests.

---

## Folder Structure

```
social-media/
├── client/                          # React frontend
│   ├── public/                      # Static assets (favicon, icons, logo)
│   ├── src/
│   │   ├── api/                     # Axios instance (base URL config)
│   │   ├── app/                     # Redux store configuration
│   │   ├── assets/                  # Images, icons, dummy data
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Loading.jsx
│   │   │   ├── MenuItems.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   ├── RecentMessages.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StoriesBar.jsx
│   │   │   ├── StoryModal.jsx
│   │   │   ├── StoryViewer.jsx
│   │   │   ├── UserCard.jsx
│   │   │   └── UserProfileInfo.jsx
│   │   ├── features/               # Redux slices (state management)
│   │   │   ├── connections/
│   │   │   ├── messages/
│   │   │   └── user/
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── ChatBox.jsx
│   │   │   ├── Connection.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Discover.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Message.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx                  # Root app with routes and providers
│   │   ├── index.css                # Global styles and Tailwind import
│   │   └── main.jsx                # Entry point
│   ├── .env                         # Environment variables (Clerk key, API URL)
│   ├── vercel.json                  # SPA rewrites for Vercel
│   └── vite.config.js               # Vite configuration
│
├── server/                          # Express backend
│   ├── configs/                     # Third-party service configs
│   │   ├── db.js                    # MongoDB connection
│   │   ├── imageKit.js              # ImageKit client
│   │   ├── multer.js                # Multer storage config
│   │   └── nodeMailer.js            # Nodemailer transport
│   ├── controllers/                 # Route handler logic
│   │   ├── messageController.js
│   │   ├── postController.js
│   │   ├── storyController.js
│   │   └── userController.js
│   ├── middlewares/                 # Express middlewares
│   │   └── auth.js                  # Clerk auth guard
│   ├── models/                      # Mongoose schemas
│   │   ├── Connextion.js
│   │   ├── Message.js
│   │   ├── Post.js
│   │   ├── Story.js
│   │   └── User.js
│   ├── routes/                      # Express route definitions
│   │   ├── messageRoutes.js
│   │   ├── postRoutes.js
│   │   ├── storyRoutes.js
│   │   └── userRoutes.js
│   ├── inngest/                     # Background job functions
│   │   └── index.js
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Server environment variables
│   ├── postman_collection.json      # API collection for testing
│   └── vercel.json                  # Serverless deployment config
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js >= 18
- npm
- A MongoDB Atlas cluster (or local MongoDB instance)
- Clerk account (for authentication)
- ImageKit account (for media uploads)
- Inngest account (for background jobs)
- MailerSend account (for email notifications)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/social-media.git
cd social-media
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (or rename the existing one):

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DB=your_mongodb_connection_string

CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

INNGEST_SIGNING_KEY=signkey-xxx
INNGEST_EVENT_KEY=xxx

SENDER_EMAIL=your_email
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

Start the server:

```bash
npm run server
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_BASEURL=http://localhost:4000
```

Start the dev server:

```bash
npm run dev
```

### 4. Open the application

Navigate to `http://localhost:5173`. Sign up or sign in using Clerk's authentication UI.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 4000) |
| `FRONTEND_URL` | Origin of the frontend (used for CORS and email links) |
| `DB` | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `INNGEST_EVENT_KEY` | Inngest event key |
| `SENDER_EMAIL` | "From" email address for notifications |
| `SMTP_USER` | MailerSend SMTP username |
| `SMTP_PASS` | MailerSend SMTP password |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (for frontend SDK) |
| `VITE_BASEURL` | Backend API base URL |

---

## API Overview

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token obtained from Clerk. Public routes (SSE streaming) require no authentication.

### User Routes (`/api/user`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/data` | Yes | Fetch authenticated user's data |
| POST | `/update` | Yes | Update profile (multipart: profile, cover) |
| POST | `/discover` | Yes | Search users by name/username/email/location |
| POST | `/follow` | Yes | Follow a user |
| POST | `/unfollow` | Yes | Unfollow a user |
| POST | `/connect` | Yes | Send a connection request (max 20/24h) |
| POST | `/accept` | Yes | Accept a pending connection request |
| GET | `/connections` | Yes | Get followers, following, connections, pending |
| POST | `/profiles` | Yes | Get a user's profile and their posts |
| GET | `/recent-messages` | Yes | Get recent messages grouped by sender |

### Post Routes (`/api/post`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Create a post (multipart, up to 4 images) |
| GET | `/feed` | Yes | Get feed posts (user + connections + following) |
| POST | `/like` | Yes | Toggle like on a post |

### Story Routes (`/api/story`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create` | Yes | Create a story (text/image/video) |
| GET | `/get` | Yes | Get stories (user + connections + following) |

### Message Routes (`/api/message`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/:userId` | No | SSE stream for real-time messages |
| POST | `/send` | Yes | Send a message (multipart, supports image) |
| POST | `/get` | Yes | Get chat history between two users |

### Inngest (`/api/inngest`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| ANY | `/*` | No | Inngest webhook handler (Clerk events + app events) |

---

## Authentication Flow

1. **Clerk Components** — The frontend uses Clerk React components (`<SignIn />`, `<UserButton />`) to render sign-in/up dialogs. The `ClerkProvider` wraps the app in `main.jsx`.

2. **JWT Tokens** — On sign-in, Clerk issues a session token. The frontend retrieves it via `useAuth().getToken()` and attaches it as `Authorization: Bearer <token>` on every API call via Axios.

3. **Backend Verification** — The Express server applies `clerkMiddleware()` (from `@clerk/express`) globally. The `protect` middleware calls `req.auth()` to extract the authenticated `userId`. If missing, requests are rejected with a `401` equivalent.

4. **User Synchronization** — Clerk emits webhook events (`clerk/user.created`, `user.updated`, `user.deleted`) that Inngest catches and syncs to the local MongoDB `User` collection. This keeps the MongoDB user profile in sync with Clerk-managed identity data.

5. **Route Protection** — Frontend routes are protected by checking `useUser()`: if no authenticated user exists, the `<Login />` page is rendered. Backend routes use the `protect` middleware.

---

## Database Design

### Collections

#### Users (`User`)

| Field | Type | Notes |
|---|---|---|
| `_id` | String (Clerk ID) | Primary key, matches Clerk's user ID |
| `email` | String | Required |
| `full_name` | String | Required |
| `username` | String | Unique |
| `bio` | String | Default: "Hey there! I am using postly" |
| `profile_picture` | String | ImageKit URL |
| `cover_photo` | String | ImageKit URL |
| `location` | String | Free text |
| `followers` | [String] | Array of User IDs |
| `following` | [String] | Array of User IDs |
| `connections` | [String] | Array of accepted User IDs |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

#### Posts (`Post`)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `user` | String (ref: User) | Author ID |
| `content` | String | Post text content |
| `image_urls` | [String] | Up to 4 ImageKit URLs |
| `post_type` | String | Enum: `text`, `image`, `text_with_image` |
| `likes_count` | [String] | Array of User IDs who liked |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

#### Stories (`Story`)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `user` | String (ref: User) | Author ID |
| `content` | String | Story text (for text stories) |
| `media_url` | String | Image/Video URL |
| `media_type` | String | Enum: `text`, `image`, `video` |
| `views_count` | [String] | Array of User IDs who viewed |
| `background_color` | String | Hex color for text stories |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

#### Messages (`Message`)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `from_user_id` | String (ref: User) | Sender ID |
| `to_user_id` | String (ref: User) | Recipient ID |
| `text` | String | Message content (trimmed) |
| `message_type` | String | Enum: `text`, `image` |
| `media_url` | String | Image URL (if image message) |
| `seen` | Boolean | Read receipt, default: `false` |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

#### Connections (`Connection`)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `from_user_id` | String (ref: User) | Requester ID |
| `to_user_id` | String (ref: User) | Recipient ID |
| `status` | String | Enum: `pending`, `accepted` |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

### Relationships

- **Users ↔ Posts**: One-to-many via `Post.user`
- **Users ↔ Stories**: One-to-many via `Story.user`
- **Users ↔ Messages**: Two one-to-many relationships via `Message.from_user_id` and `Message.to_user_id`
- **Users ↔ Users (followers/following/connections)**: Many-to-many via string arrays on the `User` document (denormalized)
- **Connections**: Explicit bidirectional relationship modeled in the `Connection` collection, with status lifecycle (`pending` → `accepted`)

---

## Real-Time Features

### Server-Sent Events (SSE)

Real-time messaging is implemented using SSE instead of WebSockets for simplicity.

- **Connection**: When a user is authenticated, the frontend opens an `EventSource` to `/api/message/:userId`.
- **Delivery**: When `sendMessage` is called, after persisting the message, the server checks if the recipient has an active SSE connection in an in-memory object (`connections`). If so, it pushes the message as a `data:` event.
- **Reconnection**: If the connection drops, the browser automatically reconnects.
- **Fallback**: The `RecentMessages` component also polls every 5 seconds via a standard GET request.

### Polling Fallback

The `RecentMessages` sidebar fetches fresh data every 5 seconds using `setInterval`, ensuring messages are displayed even if the SSE connection is temporarily lost.

---

## Screenshots

| Feature | Screenshot |
|---|---|
| Login Page | `./screenshots/login.png` |
| Feed | `./screenshots/feed.png` |
| Profile | `./screenshots/profile.png` |
| Chat | `./screenshots/chat.png` |
| Stories | `./screenshots/stories.png` |
| Discover | `./screenshots/discover.png` |
| Connections | `./screenshots/connections.png` |

*Add actual screenshots to a `screenshots/` directory in the project root.*

---

## Performance Optimizations

- **Image Transformation** — All uploaded images are transformed server-side before serving: automatic quality adjustment (`quality: "auto"`), WebP format conversion, and width clamping (512px for profiles, 1280px for posts/cover/messages).
- **Minimize: false** — Mongoose schemas use `minimize: false` to ensure empty arrays are persisted, preventing unnecessary schema version conflicts.
- **Debounced SSE** — A single EventSource is maintained globally in `App.jsx`, and messages are dispatched to Redux only when the user is on the correct chat route.
- **Smooth Animations** — Tailwind `transition-all duration-300` on sidebar, `active:scale-95` on buttons, and CSS-only spinner reduce perceived latency.
- **Tree-shaking** — Vite's build process automatically removes unused CSS (Tailwind JIT) and JavaScript.

---

## Future Improvements

- **Comments on Posts** — Add nested comments and replies to posts
- **Push Notifications** — Replace email with FCM/APN for mobile or browser push
- **WebSockets** — Replace SSE polling with full-duplex WebSocket via Socket.IO for lower latency
- **Media Galleries** — Dedicated user media gallery page with lazy loading
- **Dark Mode** — Theme toggle persisted in local storage or user preferences
- **Story Reactions** — Allow emoji reactions on stories
- **Group Chat** — Multi-user chat rooms
- **Infinite Scroll** — Paginate feed and chat history with cursor-based pagination
- **Search Posts** — Full-text search across posts content and hashtags
- **Moderation** — Report and block features, content moderation dashboard
- **TypeScript Migration** — Improve type safety across the codebase
- **Testing Suite** — Add unit, integration, and end-to-end tests
- **CI/CD Pipeline** — Automated testing and deployment via GitHub Actions

---

## Challenges Solved

### 1. Clerk + MongoDB User Synchronization
Clerk manages authentication, but the application stores richer profile data (bio, location, connections, followers) in MongoDB. The solution uses **Inngest webhooks** to listen for Clerk lifecycle events (`user.created`, `user.updated`, `user.deleted`) and automatically sync the User collection — while still using Clerk's ID as the MongoDB `_id` to maintain a consistent foreign-key relationship.

### 2. Bidirectional Connection System with Rate Limiting
The connection request system required creating a `Connection` document with a `pending` → `accepted` lifecycle, updating both parties' `connections` arrays atomically, enforcing a rate limit of 20 requests per 24 hours, and sending immediate + reminder emails. The Inngest `sleepUntil` step handles the 24-hour reminder elegantly without external cron servers.

### 3. Real-Time Messaging Without WebSockets
SSE was chosen over WebSockets to avoid the complexity of a full WebSocket server. The challenge was managing multiple SSE connections in a serverless-friendly way. The solution maintains an in-memory `connections` object keyed by user ID, and messages are pushed directly to the recipient's response stream when they are online.

### 4. Story Auto-Expiry
Stories are designed to vanish after 24 hours. Rather than running a periodic cleanup job, each story creation triggers an Inngest event that schedules a `sleepUntil` for 24 hours in the future, then deletes the story document. This is more precise and doesn't require scanning the entire collection.

---

## Author

**Alaa Anwar** — Full-Stack Developer

- GitHub: [@alaaanwar](https://github.com/alaaanwar)
- Email: anwaralaa286@gmail.com
- LinkedIn: *Add your LinkedIn URL*

---

*Project generated for educational and portfolio purposes.*
