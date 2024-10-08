import React,{useContext} from 'react'

import NoteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
    const {note,updateNote} = props
    const context = useContext(NoteContext)
    const {deleteNote}=context;
    return (
        <div className='col-md-3'>
            <div className="card my-3" >
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <i className="fa-solid fa-trash" onClick={()=>{deleteNote(note._id)}}></i>
                        <i className="fa-solid fa-pen-to-square mx-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{updateNote(note)}} ></i>
                    </div>
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
  )
}

export default NoteItem;
