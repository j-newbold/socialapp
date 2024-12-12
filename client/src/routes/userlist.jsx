import { useState, useEffect } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

export default function UserList(props) {
    const curUser = useOutletContext();
    const [userData, setUserData] = useState([]);

    let exists;
    if (curUser.userid != null) {
        exists = true;
    } else {
        exists = false;
    }

    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/users/userswfollows", {
                method: 'GET',
                credentials: 'include',
                headers: {
                'content-type': 'application/json',
                }
            });
            const jsonData = await response.json();
            setUserData(jsonData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    const follow = (tfId) => {
        fetch("http://localhost:5000/users/follow", {
            method: 'POST',
            credentials: 'include',
            headers: {
            'content-type': 'application/json',
            },
            body: JSON.stringify({
                userToFollow: tfId
            })
        }).then(() => {
            setUserData(userData.map((user) => {
                if (user.userid == tfId) {
                    user.is_followed = !user.is_followed;
                }
                return user;
            }));
        });
    }

    const unFollow = async (ufId) => {
        const response = await fetch("http://localhost:5000/users/unfollow", {
            method: 'DELETE',
            credentials: 'include',
            headers: {
            'content-type': 'application/json',
            },
            body: JSON.stringify({
                userUnFollowed: ufId
            })
        });
        setUserData(userData.map((user) => {
            if (user.userid == ufId) {
                user.is_followed = !user.is_followed;
            }
            return user;
        }));
    }
    
    return (
        // add conditional for user.userid = curuser.id

        <div className="page">
            <h1>User List</h1>
            {userData && userData.map((user) => 
                <div key={user.userid}>
                    {user.display_name}
                    {exists ?
                        <>{user.is_followed ? 
                            <button className="btn btn-primary" onClick={() => {
                                unFollow(user.userid)}}>
                                Unfollow
                            </button> :
                            <button className="btn btn-danger" onClick={() => {
                                follow(user.userid)}}>
                                Follow
                            </button> }</> :
                        <></>
                    }
                </div>
            )}
        </div>
    );
}