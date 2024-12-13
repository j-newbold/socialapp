import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');

    const navigate = useNavigate();

    const submitPost = e => {
        e.preventDefault();
        try {
            fetch(import.meta.env.VITE_API_URL+'posts/createpost', {
                method: 'post',
                credentials: 'include',
                headers: { "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: postTitle,
                    postBody: postBody
                })
            }).then((result) => {
                if (result.ok) {
                    navigate('/');
                } else {
                    console.log('Error creating post');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='page'>
                <div>Create Post</div>
                <div>
                    Title:
                    <label>
                        <input
                            name='title'
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    Body:
                    <label>
                        <input
                            name='body'
                            value={postBody}
                            onChange={(e) => setPostBody(e.target.value)}
                        />
                    </label>
                </div>
                <button className='btn btn-primary' onClick={submitPost}>
                    Submit
                </button>
            </div>
        </>
    );
}