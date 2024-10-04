import React from 'react'
import { useContext,useEffect } from 'react'
import UserContext from '../context/users/userContext'
import { useNavigate } from "react-router-dom";
import UserItem from './UserItem';
const Users = () => {
    const navigate = useNavigate();
    const {users,getUsers} = useContext(UserContext);
    useEffect(() => {
        if(localStorage.getItem('token')){
            getUsers()          
        }else{
            navigate("/home");
        }
    
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className="container">
                <h2>User list are: </h2>
                <div className = "row">
                    {/* row creat a bootstrap row which hold the columns */}
                    {users.length===0 && "No Users to display"}
                    {users.map((user) => {
                        return (
                            <div className="col-md-3 " key={user._id} >
                                <UserItem user = {user} />
                            </div>
                        )
                    })}
                </div>
           </div>

            
        </>
    )
}

export default Users
