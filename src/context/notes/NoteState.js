import React from "react";
import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {  // Pass props here
    
    const  host = "http://localhost:5000"
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
        const newNote = await response.json();
        
        setNotes(notes.concat(newNote));
      
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
        
        const json = await response.json();
        console.log(json.success)
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)    


    }
    // editNote
    const editNote = async(note)=>{
        // todo : api call
        console.log('edit note ',note);
        const response = await fetch(`${host}/api/notes/update-note/${note.id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body : JSON.stringify({title:note.etitle,description:note.edescription,tag:note.etag})

        })
        const json = await response.json();
        console.log(json);
        
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
        console.log(newNotes);
        setNotes(newNotes);

    }

    return (
        <NoteContext.Provider value = {{notes,setNotes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}  {/* Render children */}
        </NoteContext.Provider>
    );
}

export default NoteState;
