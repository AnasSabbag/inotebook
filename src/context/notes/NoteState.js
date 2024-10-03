import NoteContext from "./noteContext";
import React,{ useState,useContext } from "react";
import alertContext from '../alerts/alertContext';


const NoteState = (props) => {  // Pass props here
    const context = useContext(alertContext);
    const {displayAlert} = context;
    const [alrt, setAlert] = useState({type:"",msg:""})

    const host = process.env.REACT_APP_HOST_URL;
    const notesInitial=[]
    const [notes, setNotes] = useState(notesInitial)
    

    const getNotes = async ()=>{ 
        
        const response = await fetch(`${host}/api/notes/get-all-notes-of-user`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                "auth-token":localStorage.getItem('token')
            }

        });
        const json = await response.json();
        
        setNotes(json)

    }


    // addNote
    const addNote = async (note)=>{
               
        const response = await fetch(`${host}/api/notes/add-notes`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body : JSON.stringify({title:note.title,description:note.description,tag:note.tag})

        });
        const jsonRes = await response.json();
        setNotes(notes.concat(jsonRes.savedNote));
        const alertData=alrt;
        if(jsonRes.success){
            alertData.type="success"
            alertData.msg ="Note Added successfully"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type="danger"
            alertData.msg ="Note did not added "
            setAlert(alertData)
            displayAlert(alrt);
        }

    }

    //  deleteNote
    const deleteNote = async(id)=>{
        
        const response = await fetch(`${host}/api/notes/delete-note/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                "auth-token":localStorage.getItem('token')
            }
        });
        
        const jsonRes = await response.json();
        
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)   

        const alertData=alrt;
        if(jsonRes.success){
            alertData.type="success"
            alertData.msg ="Note deleted successfully"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type = "danger"
            alertData.msg ="Note did not deleted "
            setAlert(alertData)
            displayAlert(alrt);
        }


    }
    // editNote
    const editNote = async(note)=>{
        const response = await fetch(`${host}/api/notes/update-note/${note.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body : JSON.stringify({title:note.etitle,description:note.edescription,tag:note.etag})

        })
        const jsonRes = await response.json();
        // this will deep copy 
        let newNotes = JSON.parse(JSON.stringify(notes));
        
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === note.id){
                
                newNotes[index].title =  note.etitle
                newNotes[index].description =  note.edescription
                newNotes[index].tag =  note.etag    
                break
            }
        }
        setNotes(newNotes);
        const alertData = alrt;
        if(jsonRes.success){
            alertData.type="success"
            alertData.msg ="Note updated successfully"
            setAlert(alertData)
            displayAlert(alrt);
        }else{
            alertData.type = "danger"
            alertData.msg ="Note did not deleted "
            setAlert(alertData)
            displayAlert(alrt);
        }

    }

    return (
        <NoteContext.Provider value = {{notes,setNotes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}  {/* Render children */}
        </NoteContext.Provider>
    );
}

export default NoteState;
