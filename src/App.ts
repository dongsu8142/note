import NotesAPI from "./NotesAPI";
import NotesView from "./NotesView";
import { Note, NoteEvent } from "./types";

export default class App {
  private notes: Note[] = [];
  private activeNote: Note | undefined;
  private view: NotesView;
  constructor(root: HTMLDivElement) {
    this.view = new NotesView(root, this._handlers());

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();

    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  _setNotes(notes: Note[]) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note: Note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
  }

  _handlers(): NoteEvent {
    return {
      onNoteSelect: (id) => {
        const selectedNote = this.notes.find((note) => note.id === id)!;
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "New Note",
          body: "Take note...",
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title, body) => {
        NotesAPI.saveNote({
          id: this.activeNote?.id,
          title,
          body,
        });

        this._refreshNotes();
      },
      onNoteDelete: (id) => {
        NotesAPI.deleteNote(id);

        this._refreshNotes();
      },
    };
  }
}
