import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Login() {
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [liError, setLiError] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [caSuccess, setCaSuccess] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');

    useEffect(() => {
        setLiError(false);
    }, []);

    const navigate = useNavigate();

    const createAccount = e => {
        e.preventDefault();
        try {
            fetch(import.meta.env.VITE_API_URL+'auth/signup', {
                method: 'post',
                headers: { "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: newUsername,
                    password: newPwd,
                    displayName: newDisplayName
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    const login = e => {
        e.preventDefault();
        try {
            fetch('http://localhost:5000/auth/login', {
                method: 'post',
                credentials: 'include',
                headers: { "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: pwd
                })
            }).then((result) => {
                if (result.ok) {
                    navigate('/');
                    window.location.reload();
                } else {
                    setLiError(true);
                }});
        } catch (error) {
            console.log(error);
        }
    }

    const logOut = e => {
        e.preventDefault()
        try {
            fetch('http://localhost:5000/auth/logout', {
                method: 'post',
                credentials: 'include'
            }).then((result) => {
                if (result.ok) {
                    navigate('/');
                } else {
                    console.log(result);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='container mt-5 page'>
                <Row>
                    <Col s={12}>
                        <h1>Log In</h1>
                        <div>
                            Username: <input type='text' value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        />
                        </div>
                        <div>
                            Password: <input type='password' value={pwd}
                                        onChange={e => setPwd(e.target.value)}
                                        />
                        </div>
                        <button className='btn btn-success' onClick={login}>
                            Log In
                        </button>
                        {liError? <span className='text-danger'>Invalid credentials</span> : <></>}
                    </Col>
                    <Col s={12}>
                        <h1>Sign Up</h1>
                        <div>
                            Username: <input type='text' value={newUsername}
                                        onChange={e => setNewUsername(e.target.value)}
                                        />
                        </div>
                        <div>
                            Display Name: <input type='text' value={newDisplayName}
                                        onChange={e => setNewDisplayName(e.target.value)}
                                        />
                        </div>
                        <div>
                            Password: <input type='password' value={newPwd}
                                        onChange={e => setNewPwd(e.target.value)}
                                        />
                        </div>
                        <button className='btn btn-success' onClick={createAccount}>
                            Create Account
                        </button>
                    </Col>
                </Row>
            </div>
        </>
    );
};