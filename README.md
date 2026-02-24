# Job Application Tracker

A small React/TypeScript application for tracking job applications

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: Better Auth
- **Drag & Drop**: dnd-kit
- **UI Components**: Radix UI
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd job-application-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 1. Database Setup (`lib/db.ts`)

The database connection uses a caching pattern to prevent multiple connections in development:

```typescript
// Connection is cached globally to prevent multiple connections
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };
```

**Key Concepts:**

- Global caching prevents connection issues during hot reloads
- Connection reuse improves performance
- Error handling ensures graceful failures

### 2. Data Models (`lib/models/`)

The application uses three main models with relationships:

**Board Model** (`board.ts`):

- Represents a user's job hunt board
- Contains references to columns
- One board per user

**Column Model** (`column.ts`):

- Represents Kanban columns (Wish List, Applied, Interviewing, etc.)
- Contains references to job applications
- Has an `order` field for sorting

**JobApplication Model** (`job-application.ts`):

- Stores individual job application data
- References both column and board
- Includes fields like company, position, location, salary, tags, etc.

**Relationship Structure:**

```
Board (1) → (many) Columns → (many) JobApplications
```

### 3. Authentication (`lib/auth/auth.ts`)

Better Auth is configured with MongoDB adapter:

```typescript
export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await initializeUserBoard(user.id);
        },
      },
    },
  },
});
```

**Key Features:**

- Email/password authentication
- Automatic board creation on signup
- Session management with cookie caching

### 4. Server Actions (`lib/actions/job-applications.ts`)

Server actions handle all data mutations:

**createJobApplication:**

- Validates user session
- Verifies board and column ownership
- Calculates order for new job
- Updates column references

**updateJobApplication:**

- Handles moving jobs between columns
- Manages order updates with gap strategy (multiples of 100)
- Shifts other jobs when reordering

**deleteJobApplication:**

- Removes job from database
- Cleans up column references
- Revalidates cache

**Key Pattern:**

- All actions check authentication
- Ownership verification prevents unauthorized access
- `revalidatePath` ensures UI updates after mutations

### 5. Drag & Drop Implementation (`components/kanban-board.tsx`)

The Kanban board uses `@dnd-kit` for drag and drop:

**Components:**

- `DndContext`: Main drag and drop context
- `DroppableColumn`: Columns that accept dropped items
- `SortableJobCard`: Individual job cards that can be dragged
- `SortableContext`: Manages sortable items within columns

**Drag Flow:**

1. User starts dragging → `handleDragStart` sets active item
2. User drops → `handleDragEnd` calculates new position
3. Position calculation handles:
   - Dropping on column (appends to end)
   - Dropping on another job (inserts at that position)
   - Moving within same column (reorders)
4. `moveJob` hook updates database

**Key Features:**

- Visual feedback during drag (opacity, overlay)
- Collision detection with `closestCorners`
- Pointer sensor with activation distance to prevent accidental drags

### 6. Client State Management (`lib/hooks/useBoards.ts`)

Custom hook manages board state and provides mutation functions:

**Responsibilities:**

- Maintains local state synchronized with server
- Provides `moveJob` function for drag operations
- Optimistic updates for better UX

### 7. Dashboard Page (`app/dashboard/page.tsx`)

Server component that:

- Fetches user session
- Loads board data with populated relationships
- Uses React Suspense for loading states
- Redirects unauthenticated users

**Data Fetching Pattern:**

```typescript
const boardDoc = await Board.findOne({ userId, name: "Job Hunt" }).populate({
  path: "columns",
  populate: { path: "jobApplications" },
});
```

### 8. User Board Initialization (`lib/init-user-board.ts`)

When a user signs up, a default board is created with predefined columns:

- Applied
- Interviewing
- Offer
- Rejected

This ensures every user starts with a functional board structure.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

Required environment variables:

- `MONGODB_URI` - MongoDB connection string

## 📖 Project Structure

```
job-application-tracker/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard page
│   └── sign-in/           # Authentication pages (optional)
│   └── sign-up/           # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── kanban-board.tsx  # Main Kanban component
│── lib/
    ├── actions/          # Server actions
    ├── auth/             # Authentication setup
    ├── hooks/            # Custom React hooks
    ├── models/           # Mongoose models
    └── db.ts             # Database connection
```
