export type Note = {
  id: number;
  title: string;
  body: string;
  updated: string;
};

export type NoteDTO = {
  id?: number;
  title: string;
  body: string;
};

export type NoteEvent = {
  onNoteSelect: (id: number) => void;
  onNoteAdd: () => void;
  onNoteEdit: (title: string, body: string) => void;
  onNoteDelete: (id: number) => void;
};
