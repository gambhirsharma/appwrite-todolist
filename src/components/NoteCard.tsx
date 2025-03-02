import React from "react";
import { autoGrow, bodyParser, setNewOffset, setZIndex } from "../utils";
import { db } from "../appwrite/databases";
import Spinner from "../icons/Spinner";
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";

interface note {
  $id: number;
  body: string;
  colors: string;
  position: string;
}

function NoteCard({ note }: { note: note }) {
  const body = bodyParser(note.body);
  const colors = JSON.parse(note.colors);
  // const position = JSON.parse(note.position)
  const [position, setPosition] = React.useState(JSON.parse(note.position));
  const [saving, setSaving] = React.useState(false)
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const keyUpTimer = React.useRef(null)

  const { setSelectedNote } = React.useContext(NoteContext);

  const handleKeyUp = async () => {
    //1 - Initiate "saving" state
    setSaving(true);

    //2 - If we have a timer id, clear it so we can add another two seconds
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    //3 - Set timer to trigger save in 2 seconds
    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  React.useEffect(() => {
    autoGrow(textAreaRef);
  }, []);

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    }
    setSaving(false)
  };


  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = React.useRef(null);

  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      setZIndex(cardRef.current);
      setSelectedNote(note)
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef); //{x,y}
    saveData("position", newPosition);
  };

  const mouseMove = (e) => {
    console.log(`mouseMove: ${e.clientX}, ${e.clientY}`);
    //1 - Calculate move direction
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    //2 - Update start position for next move.
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    //3 - Update card top and left position.
    const newPosition = setNewOffset(cardRef, mouseMoveDir);
    setPosition(newPosition);
  };



  return (
    <div
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      ref={cardRef}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
        onMouseDown={mouseDown}
      >
        <DeleteButton noteId={note.$id} />
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>
              Saving...
            </span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          style={{ color: colors.colorText }}
          defaultValue={body}
          ref={textAreaRef}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note)
          }}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onKeyUp={handleKeyUp}
        ></textarea>
      </div>
    </div>
  );
}

export default NoteCard;
