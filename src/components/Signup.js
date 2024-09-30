import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";

function Signup() {

    const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
    const navigate = useNavigate();
    const handleOnClick =(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
    const handleOnSubmit =async (e)=>{
        console.log("submit handlie click hdb ",credentials);
        
        e.preventDefault();
        

        const  host = "http://localhost:5000";

        const response = await fetch(`${host}/api/auth/createuser`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify({name: credentials.name,email : credentials.email,password : credentials.password})

        });
        const json = await response.json();
        console.log(json)
        if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate("/"); 
        }else{
            alert('Invaild credential')
        }
        
    }

  return (
    <div>
        <form onSubmit={handleOnSubmit}>
            <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" onChange={handleOnClick} minLength={3}  required id="password"/>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name="email" onChange={handleOnClick} required aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" onChange={handleOnClick} minLength={5} required id="password"/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">ConfirmedPassword</label>
                <input type="password" className="form-control" name="cpassword" onChange={handleOnClick}  required id="password"/>
            </div>
            <button disabled={credentials.cpassword!==credentials.password}  type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Signup
