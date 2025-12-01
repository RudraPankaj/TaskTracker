import { createBrowserRouter } from "react-router-dom";
import TaskListView from "../pages/TaskListView";
import TaskView from "../pages/TaskView";
import NewTaskView from "../pages/NewTaskView";
import App from "../App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <TaskListView />,
            },
            {
                path: "/task/:taskId",
                element: <TaskView />,
            },
            {
                path: "/new-task",
                element: <NewTaskView />,
            },
        ],
    },
]);

export default router;