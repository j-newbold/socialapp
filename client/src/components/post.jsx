import '../App.css';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';


export default function Post(props) {
    const { state } = useLocation();

    const [user, setUser] = useState(null);

    let hasDel = false;

    if (props.user.userid == props.info.author_id && props.user.userid != null) {
        hasDel = true;
    }

    return (
        <div className="post padding-left-5">
            <h1>
                {props.info.post_title}
            </h1>
            <div>
                {props.info.post_body}
            </div>
            {hasDel? <button
                        className="btn btn-danger btn-primary"
                        onClick={() => props.handleDelete(props.info.post_id)} >
                    Delete
                </button> : <></>}            
        </div>
    )
}