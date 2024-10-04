import React,{ useContext } from 'react'

import UserContext from '../context/users/userContext';
const UserItem = (props) => {
    const {user} = props
    const {deleteUser} = useContext(UserContext);

    return (
        <div>
            <div className="card my-3" >
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-trash" onClick={()=>{deleteUser(user._id)}} ></i>
                        <i className="fa-solid fa-pen-to-square mx-4"></i>
                    </div>
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                </div>
            </div>
        </div>
    )
}

export default UserItem;

