import React, { useEffect,useContext,useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IconUsersGroup } from '@tabler/icons-react';

import alertContext from '../context/alerts/alertContext';
const Navbar = () => {
  const context = useContext(alertContext);
  const {displayAlert} = context;
  const [alrt, setAlert] = useState({type:"",msg:""})

  let location = useLocation()
  const navigate = useNavigate();
  useEffect(() => {
    console.log(location)
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate("/login");
    // send alert 
    const alertData = alrt;
    alertData.type="success"
    alertData.msg ="Logout successfully"
    setAlert(alertData)
    displayAlert(alrt);
  }
  const hanleUserProfile=()=>{
    console.log("youb can crud bon users ");
    navigate("/users-info")
  }

  return (
    <div>
      {localStorage.getItem('token') ? 
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">iNotbook</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About Us</Link>
                  </li>
                </ul>
            
              </div>
              
            </div>
            <IconUsersGroup stroke={2} className="mx-4" style ={{color:'white'}} onClick={hanleUserProfile} />
            <button onClick={handleLogout} className="btn btn-primary" >Logout</button>
          </nav>: <div className="container my-4">
         <form className="d-flex" role="search" style={{"justifyContent":'end'}}>
            <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
            <Link className="btn btn-primary mx-1" to="/sign-up" role="button">Sign up</Link>
          </form>
      </div>
      }
      
    </div>


  )
}


export default Navbar
