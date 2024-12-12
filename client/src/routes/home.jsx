import { useEffect, useState } from "react";
import { json, useLocation, useOutletContext } from "react-router-dom";
import Post from '../components/post';
import '../App.css';

export default function Home(props) {
    const curUser = useOutletContext();
    const [postList, setPostList] = useState([]);

    const getUser = async () => {
        
    }

    const getPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/posts/posts', {
                method: 'get',
                credentials: 'include',
                headers: { "Content-Type": "application/json"
                }
            });
            const jsonData = await response.json();
            setPostList(jsonData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    const deletePost = (index) => {
        fetch('http://localhost:5000/posts/post', {
            method: 'delete',
            credentials: 'include',
            headers: { "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: index
            })
        }).then((res) => {
            if (res.ok) {
                setPostList(elems => elems.filter((i) => i.post_id !== index));
            } else {
                console.log("Error deleting post");
            }
        }

        )
    };

    return (
        <div className="page">
            <h1>Home</h1>
            {postList.map(post => (
                <Post key={post.post_id}
                    info={post}
                    user={curUser}
                    handleDelete={() => deletePost(post.post_id)}
                />
            ))}
        </div>
    );
}