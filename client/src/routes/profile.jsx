import { useState, useEffect } from 'react';
import { useLoaderData, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

export default function Profile() {
    const curUser = useOutletContext();
    const [curName, setCurName] = useState(curUser?.display_name);
    const [editStatus, setEditStatus] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    
    const navigate = useNavigate();

    const editName = () => {
        setEditStatus(true);
        return null;
    }

    const deleteAccount = () => {
        try {
            fetch(import.meta.env.VITE_API_URL+'auth/deleteacc', {
                method: 'delete',
                credentials: 'include',
                headers: { "Content-Type": "application/json"
                }
            }).then(() => {
                closeDelModal();
            }).then(() => {
                navigate('/');
            })            
        } catch (error) {
            console.log(error);
        }
    }

    const saveName = e => {
        try {
            e.preventDefault();
            fetch(import.meta.env.VITE_API_URL+'users/changename', {
                method: 'post',
                credentials: 'include',
                headers: { "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newName: curName
                })
            }).then((result) => {
                if (result.ok) {
                    setNameSuccess(true);
                    setEditStatus(false);
                } else {
                    setNameError(true);
                }
            });            
        } catch (error) {
            console.log(error);
        }
    }

    const showDelModal = () => {
        setShowDelete(true);
    }
    const closeDelModal = () => {
        setShowDelete(false);
    }

    let nameField = null;

    if (editStatus) {
        nameField = (
            <label>
                <input type='text' value={curName}
                                onChange={e => setCurName(e.target.value)}
                                />
                <button className='btn btn-primary' onClick={saveName}>
                    Save
                </button>
            </label>
        );
    } else {
        nameField = (
            <label>
                <div>
                    {curName}
                </div>
                <button className='btn btn-primary' onClick={editName}>
                    Edit Username
                </button>
            </label>
        );
    }

    return (
        <>
            <div className='page'>
                <div>
                    Profile Page
                </div>
                    {nameField}
                <div>
                    <Button className="btn btn-danger" onClick={showDelModal}>
                        Delete Account
                    </Button>
                    <Modal show={showDelete} onHide={closeDelModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>This action is permanent and cannot be undone.</Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={closeDelModal}>
                                Cancel
                            </Button>
                            <Button variant='danger' onClick={deleteAccount}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    )
}