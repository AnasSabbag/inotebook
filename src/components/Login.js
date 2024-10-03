
import React, { useState,useContext } from 'react'
import { useNavigate } from "react-router-dom";
import alertContext from '../context/alerts/alertContext';

function Login() {
    const context = useContext(alertContext);
    const {displayAlert} = context;
    
    const [alrt, setAlert] = useState({type:"",msg:""})
    

    const [credentials, setCredentials] = useState({email:"",password:""})
    const navigate = useNavigate();
    const handleOnClick =(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
    const handleOnSubmit =async (e)=>{
        e.preventDefault();
        const  host = process.env.REACT_APP_HOST_URL;
        const response = await fetch(`${host}/api/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify({email : credentials.email,password : credentials.password})

        });
        const json = await response.json();
        const alertData = alrt;

        if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate("/home"); 
            alertData.type="success"
            alertData.msg ="Login successfull"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type="danger"
            alertData.msg ="Invalid Credentials !!!"
            setAlert(alertData)
            displayAlert(alrt);
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
