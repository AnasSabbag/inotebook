
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
            alertData.type = "danger"
            alertData.msg ="Invalid Credentials !!!"
            setAlert(alertData)
            displayAlert(alrt);
        }
        
    }
  return (
    <div className="container my-4">
        <form className="d-flex" role="search" style={{"justifyContent":'center'}} onSubmit={handleOnSubmit}  >
            <div className="mb-3" style={{width:'30%'}} >
                <label htmlFor="email" className="form-label" >Email address</label>
                <input type="email" className="form-control my-2" id="email" name="email" onChange={handleOnClick} aria-describedby="emailHelp"/>
                <label htmlFor="password" className="form-label my-2">Password</label>
                <input type="password" className="form-control my-2" name="password" onChange={handleOnClick} id="password"/>
                <button type="submit" className="btn btn-primary my-2">Log in</button>
            </div>
        </form>
    </div>
  )
}

export default Login
