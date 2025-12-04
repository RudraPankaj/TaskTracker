import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import { TasksProvider } from './context/TasksContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <RouterProvider router={router} />
    </TasksProvider>
  </React.StrictMode>
)
