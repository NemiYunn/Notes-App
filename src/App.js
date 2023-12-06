import './App.css';
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    /**
     * Challenge: When the user edits a note, reposition
     * it in the list of notes to the top of the list
     */
    const [notes, setNotes] = React.useState(
        // getting notes from local storage
        //use it as arrow function to prevent it getting every time 
        // that this notes state changes
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    React.useEffect(() => {
        // save notes locally every time notes state changes
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    // this will take current working note to the above of the list
    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    // add to the front(beginning) of the new array 
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }

    function deleteNote(event , noteId){
        // this stopPropagation will help to not executing parent func which is whenever delete clicked ,also select it as current note, this will prohibited
        event.stopPropagation();
        // console.log("note deleted", noteId)
        //  change notes state , remove clicked (deleted) note (filter out not deleted notes)
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    // because this method has parametr vals not putting ()
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}