import React from "react"
import {NoteContext} from "../context/NoteContext"
import NoteCard from "../components/NoteCard";


function NotePage() {
 const { notes, setNotes } = React.useContext(NoteContext);

  // React.useEffect(() => {
  //   init()
  // }, [])
  //
  // const init = async () => {
  //   const response = await db.notes.list();
  //   setNotes(response.documents);
  // }
  //
  return (
    <div>{
      notes.map((note) => (
        <NoteCard key={note.$id} note={note} />
      ))
    }</div>
  )
}

export default NotePage
