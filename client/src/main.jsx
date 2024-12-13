import React from 'react'
import { useState, useEffect, createContext } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from './error-page';
import Profile from './routes/profile';
import Login from './routes/login';
import CreatePost from './routes/createpost.jsx';
import Home from './routes/home.jsx';
import UserList from './routes/userlist.jsx';
import UserContext from './utils/UserContext.jsx';
import './App.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppWrapper/>,
        children: [
        {
            path: '/login',
            element: <Login />,
            errorElement: <ErrorPage />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: '/createpost',
            element: <CreatePost />
        },
        {
            path: '/',
            element: <Home usr={1}/>
        },
        {
            path: '/userlist',
            element: <UserList />
        }
        ]
    }
]);

function AppWrapper() {
    const [profileData, setProfileData] = useState({userid: null});
    const getLoggedUser = async () => {
        const response = await fetch(import.meta.env.VITE_API_URL+"users/user", {
        method: "GET",
        headers: {
            'content-type': 'application/json',
        },
        credentials: 'include'
        });
        const jsonData = await response.json();
        setProfileData(jsonData);
    }

    useEffect(() => {
        getLoggedUser();
    }, []);

    return (
        <>
            <UserContext.Provider value={profileData}>
                <App context={profileData} />
            </UserContext.Provider>
            <Outlet context={profileData} />
        </>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} className="fullapp" />
  </React.StrictMode>,
)