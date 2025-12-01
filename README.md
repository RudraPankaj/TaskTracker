# Task Tracker

A modern and feature-rich task management application built to demonstrate a wide range of React capabilities, from state management to advanced UI features. Built with React, Vite, and Tailwind CSS.

## ✨ Core Features

### Task & Subtask Management
- **CRUD Operations:** Full capabilities to create, read, update, and delete tasks.
- **Detailed Task View:** A dedicated view for each task, showing its title, priority, due date, and subtasks.
- **Nested Subtasks:** Create a hierarchical structure of subtasks within any task.
- **Smart Completion Logic:**
    - **Bottom-Up Sync:** A parent subtask is automatically marked as complete when all of its children are completed.
    - **Top-Down Cascade:** Checking or unchecking a parent subtask will automatically check or uncheck all of its descendant subtasks.

### Navigation & User Experience
- **Collapsible Sidebar:** The sidebar can be collapsed to maximize workspace, and all options are still accessible via icons.
- **Advanced Theming:**
    - **Light & Dark Modes:** A polished and consistent theme for both light and dark preferences.
    - **Eye Care Mode:** A special toggle that dims the application's brightness for comfortable viewing in low-light environments.
- **Drag & Drop:** Easily reorder tasks in the main list view using a smooth drag-and-drop interface (powered by `@hello-pangea/dnd`).
- **Responsive Design:** The layout is fully responsive and adapts to different screen sizes.

### Search & Filtering
- **Live Search:** A central search bar allows for real-time filtering of tasks by title.
- **Debounced Input:** Search queries are debounced for a smoother user experience and better performance, preventing re-renders on every keystroke.
- **Smart Redirection:** Initiating a search from any page other than the main list will automatically redirect you to the list to display the results.

### Data & Persistence
- **Local Storage:** All tasks and their states are saved in the browser's Local Storage, ensuring your data persists between sessions.
- **Clickable Links:** Any URLs in task or subtask titles are automatically converted to clickable links, with a security modal to confirm redirection to an external site.

## 🛠️ Tech Stack

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Drag & Drop:** [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Date Formatting:** [date-fns](https://date-fns.org/)
- **Unique IDs:** [uuid](https://github.com/uuidjs/uuid)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm

### Setup
1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📜 Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Bundles the application for production.
-   `npm run preview`: Serves the production build locally for previewing.