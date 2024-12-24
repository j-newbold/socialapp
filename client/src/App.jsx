import { useState, useEffect, useContext } from 'react'
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Link } from 'react-router-dom';
import './App.css';
import UserContext from './utils/UserContext';
import { Button, Navbar, Nav } from 'react-bootstrap';

export default function App() {
    const curUser = useContext(UserContext);

    const debug = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL+'test', {
                method: 'get',
                credentials: 'include',
                headers: { "Content-Type": "application/json"}
            })
            const jsonData = await response.json();
            console.log(jsonData);
        } catch (error) {
            console.error(error);
        }
    }

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
                    <Nav className='ms-auto nav-links'>
                        {postLink}
                        {profileLink}
                        {logLink}
                    </Nav>
                    <Button onClick={debug}>debug</Button>
                </div>
            </Navbar>
        </>
    );
  }