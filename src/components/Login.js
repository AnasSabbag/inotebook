
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";


function Login() {

    const [credentials, setCredentials] = useState({email:"",password:""})
    const navigate = useNavigate();
    const handleOnClick =(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
    const handleOnSubmit =async (e)=>{
        console.log("submit handlie click hdb ",credentials);
        
        e.preventDefault();
        const  host = "http://localhost:5000";
        const response = await fetch(`${host}/api/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify({email : credentials.email,password : credentials.password})

        });
        const json = await response.json();
        console.log(json)
        if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate("/home"); 
        }else{
            alert('Invaild credential')
        }
        
    }
  return (
    <div className="text center ">
        <form onSubmit={handleOnSubmit}>
            <div className="mb-3" style={{width:'30%'}} >
                <label htmlFor="email" className="form-label ">Email address</label>
                <input type="email" className="form-control" id="email" name="email" onChange={handleOnClick} aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3" style={{width:'30%'}} >
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" onChange={handleOnClick} id="password"/>
            </div>
            <button type="submit" className="btn btn-primary">Log in</button>
        </form>
    </div>
  )
}

export default Login
