import React,{useContext,useState} from 'react'

import NoteContext from '../context/notes/noteContext';


const AddNote = () => {
    const context = useContext(NoteContext);
    // eslint-disable-next-line 
    const {addNote} = context;
    const [note, setNote] = useState({title:"",description:"",tag:""})
    const handleSubmit =  (event)=>{
        event.preventDefault();
        addNote(note);
        setNote({title:"",description:"",tag:""});
    }

    const handleOnClick =(event)=>{
        setNote({...note,[event.target.name]:event.target.value})
    }
  return (
        <>
            <div className="container my-2">
                <h1>Add a Note </h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor = "title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" value = {note.title} minLength={5}  onChange={handleOnClick} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value = {note.description} minLength={5} onChange={handleOnClick} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" value = {note.tag} onChange={handleOnClick} />
                    </div>
                    <button disabled={note.title.length<5 || note.description<5} type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Note</button>
                </form>
            </div>
        </>
  )
}

export default AddNote
