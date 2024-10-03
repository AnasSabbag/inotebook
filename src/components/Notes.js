import React, { useContext, useEffect, useState, useRef } from 'react'

import NoteItem from './NoteItem';
import AddNote from './AddNote';
import NoteContext from '../context/notes/noteContext';
import { useNavigate } from "react-router-dom";


const Notes = () => {
    const { notes, getNotes,editNote } = useContext(NoteContext);
    const ref = useRef(null)
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('token')){
            getNotes()          
        }else{
            navigate("/about");
        }
    
        // eslint-disable-next-line
    }, []);
    
    const [note, setNote] = useState({ id:"",etitle: "", edescription: "", etag: "" })

    const updateNote = (currentNote) => {
        setNote({id: currentNote._id ,etitle : currentNote.title, edescription : currentNote.description, etag : currentNote.tag});
    }
    
    const handleOnClick = (event) => {
        setNote({ ...note, [event.target.name]: event.target.value })
    }
    
    const handleSubmit =(event)=>{
        event.preventDefault();
        editNote(note);
        ref.current.click();
    }

    return (
        <>
            <AddNote />
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title </label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value = {note.etitle} minLength={5} onChange={handleOnClick} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value = {note.edescription} minLength={5}  onChange={handleOnClick} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={handleOnClick} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={ref} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<5 || note.edescription<5} type="button" className="btn btn-primary" onClick={handleSubmit} >Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <h2>your  Note is </h2>
                <div className="container">
                    {notes.length===0 && "No Notes to display"}
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} updateNote={updateNote} note={note} />
                })}
            </div>
        </>

    )
}

export default Notes
