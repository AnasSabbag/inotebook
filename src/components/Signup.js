import React,{useState,useContext} from 'react'
import { useNavigate } from "react-router-dom";
import alertContext from '../context/alerts/alertContext';
function Signup() {

    const {displayAlert} =  useContext(alertContext);
    const [alrt, setAlert] = useState({type:"",msg:""})

    const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
    const navigate = useNavigate();
    const handleOnClick =(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
    const handleOnSubmit = async (e)=>{
        e.preventDefault();

        const  host = process.env.REACT_APP_HOST_URL;

        const response = await fetch(`${host}/api/auth/createuser`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body : JSON.stringify({name: credentials.name,email : credentials.email,password : credentials.password})

        });
        const json = await response.json();        
        const alertData = alrt;
        if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate("/");
            alertData.type="success"
            alertData.msg ="User Added successfully"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type="danger"
            alertData.msg ="User could not added "
            setAlert(alertData)
            displayAlert(alrt);
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
