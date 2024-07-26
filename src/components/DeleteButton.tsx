import Trash from "../icons/Trash";
import { db } from "../appwrite/databases";
import React, { useContext } from "react";
import { NoteContext } from "../context/NoteContext"

const DeleteButton = ( { noteId } ) => {
  const { notes, setNotes } = useContext(NoteContext);

  const handleDelete = async (e) => {
    console.log(`it's work`)
    db.notes.delete(noteId);
    console.log(`db.notes.delete is working`)
    setNotes((prevState) =>
      prevState.filter((note) => note.$id !== noteId)
    );
  };

  return (
    <div onClick={handleDelete}>
      <Trash />
    </div>
  );
};

export default DeleteButton;
