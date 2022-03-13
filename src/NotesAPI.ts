import { Note, NoteDTO } from "./types";

export default class NotesAPI {
  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]") as Note[];

    return notes.sort((a, b) =>
      new Date(a.updated) > new Date(b.updated) ? -1 : 1
    );
  }

  static saveNote(noteToSave: NoteDTO) {
    const notes = NotesAPI.getAllNotes();
    const existing = notes.find((note) => note.id == noteToSave.id);

    if (existing) {
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      const note = {
        ...noteToSave,
        id: Math.floor(Math.random() * 1000000),
        updated: new Date().toISOString(),
      };
      notes.push(note);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
  }

  static deleteNote(id: number) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("notes", JSON.stringify(newNotes));
  }
}
