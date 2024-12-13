import { useState, useEffect, useContext } from 'react'
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Link } from 'react-router-dom';
import './App.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import UserContext from './utils/UserContext';

export default function App() {
    const curUser = useContext(UserContext);

    const logOut =  () => {
        try {
        fetch(import.meta.env.VITE_API_URL+'auth/logout', {
            method: 'post',
            credentials: 'include',
            headers: { "Content-Type": "application/json"
            }
        }).then(() => {
            window.location.reload();
        });
        } catch(error) {
        console.log(error);
        }
    }

    let profileLink = null;
    let logLink = null;
    let postLink = null;
    if (curUser?.userid) {
        profileLink = (
        <Nav.Link as={Link} to="/profile" state={ {curUser} }>Profile</Nav.Link>
        );
        postLink = (
        <Nav.Link as={Link} to='/createpost'>New Post</Nav.Link>
        )
        logLink = (
        <Nav.Link as={Link} onClick={logOut}>Log Out</Nav.Link>
        );
    } else {
        logLink = (
        <Nav.Link as={Link} className='ml-md-auto' to='/login'>Log In</Nav.Link>
        );
    }

    return (
        <>
            <Navbar className='bsnavbar'>
                <div className='container mainnav'>
                    <Navbar.Brand className='page-icon' href='/'>SocialApp</Navbar.Brand>
                    <Nav className='me-auto nav-links'>
                        <Nav.Link as={Link}
                            to='/'
                            state={ {curUser}}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link}
                            to='/userlist'
                            state={ {curUser} }>
                            User Search
                        </Nav.Link>
                    </Nav>
                    <Nav className='ms-auto' nav-links>
                        {postLink}
                        {profileLink}
                        {logLink}
                    </Nav>
                </div>
            </Navbar>
        </>
    );
  }