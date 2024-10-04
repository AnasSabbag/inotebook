
import alertContext from "../alerts/alertContext";
import userContext from "./userContext";
import { useContext, useState } from "react";


const UserState =(props)=>{
    
    const context = useContext(alertContext);
    

    const {displayAlert}=context;

    const host = process.env.REACT_APP_HOST_URL;
    const usersInitial=[]
    
    const [alrt, setAlert] = useState({type:"",msg:""})
    const [users, setUsers] = useState(usersInitial)
    
    // get users 
    const getUsers = async ()=>{ 
        
        const response = await fetch(`${host}/api/auth/get-all-users`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                "auth-token":localStorage.getItem('token')
            }

        });
        const json = await response.json();
        
        setUsers(json)

    }


    //  deleteUser
    const deleteUser = async(id)=>{
        
        const response = await fetch(`${host}/api/auth/delete-user/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                "auth-token":localStorage.getItem('token')
            }
        });
        
        const jsonRes = await response.json();
        
        const newUsers = users.filter((user)=>{return user._id !== id})
        
        console.log(" delete user: ",id)
        console.log(" delete users : ",newUsers)
        setUsers(newUsers)   

        const alertData=alrt;
        if(jsonRes.success){
            alertData.type = "success"
            alertData.msg ="user deleted successfully"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type = "danger"
            alertData.msg ="user did not deleted "
            setAlert(alertData)
            displayAlert(alrt);
        }


    }
    // edituser
    const edituser = async(user)=>{
        const response = await fetch(`${host}/api/auth/update-user`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body : JSON.stringify({name:user.name,email:user.email,password:user.password})

        })
        const jsonRes = await response.json();
        // this will deep copy 
        let newUsers = JSON.parse(JSON.stringify(users));
        
        for (let index = 0; index < newUsers.length; index++) {
            const element = newUsers[index];
            if(element._id === user.id){
                
                newUsers[index].name =  user.name
                newUsers[index].email =  user.email
                newUsers[index].password =  user.password    
                break
            }
        }
        setUsers(newUsers);
        const alertData = alrt;
        if(jsonRes.success){
            alertData.type="success"
            alertData.msg ="user updated successfully"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type = "danger"
            alertData.msg ="user did not deleted "
            setAlert(alertData)
            displayAlert(alrt);
        }

    }




    return (
        <userContext.Provider value = {{users, setUsers,getUsers,edituser,deleteUser}}>
            {props.children}        
        </userContext.Provider>
    )

}


export default UserState;