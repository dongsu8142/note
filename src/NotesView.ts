import { NoteEvent, Note } from "./types";

export default class NotesView {
  private root: HTMLDivElement;
  private onNoteSelect: (id: number) => void;
  private onNoteAdd: () => void;
  private onNoteEdit: (title: string, body: string) => void;
  private onNoteDelete: (id: number) => void;

  constructor(
    root: HTMLDivElement,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete }: NoteEvent
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
    <div class="notes__sidebar">
      <button class="notes__add" type="button">Add Note</button>
      <div class="notes__list"></div>
    </div>
    <div class="notes__preview">
        <input class="notes__title" type="text" placeholder="New Note...">
        <textarea class="notes__body">Take Note...</textarea>
    </div>
    `;

    const btnAddNote =
      this.root.querySelector<HTMLButtonElement>(".notes__add")!;
    const inpTitle =
      this.root.querySelector<HTMLInputElement>(".notes__title")!;
    const inpBody =
      this.root.querySelector<HTMLTextAreaElement>(".notes__body")!;

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    this.updateNotePreviewVisibility(false);
  }

  _createListItemHTML(id: number, title: string, body: string, updated: Date) {
    const MAX_BODY_LENGTH = 60;

    return `
    <div class="notes__list-item" data-note-id="${id}">
      <div class="notes__small-title">${title}</div>
      <div class="notes__small-body">
        ${body.substring(0, MAX_BODY_LENGTH)}
        ${body.length > MAX_BODY_LENGTH ? "..." : ""}
      </div>
      <div class="notes__small-updated">${updated.toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })}</div>
    </div>
    `;
  }

  updateNoteList(notes: Note[]) {
    const notesListContainer = this.root.querySelector(".notes__list")!;

    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      notesListContainer.insertAdjacentHTML("beforeend", html);
    }

    notesListContainer
      .querySelectorAll<HTMLDivElement>(".notes__list-item")
      .forEach((noteListItem) => {
        noteListItem.addEventListener("click", () => {
          this.onNoteSelect(parseInt(noteListItem.dataset.noteId!));
        });

        noteListItem.addEventListener("dblclick", () => {
          const doDelete = confirm(
            "Are you sure you want to delete this note?"
          );
          if (doDelete) {
            this.onNoteDelete(parseInt(noteListItem.dataset.noteId!));
          }
        });
      });
  }

  updateActiveNote(note: Note) {
    this.root.querySelector<HTMLInputElement>(".notes__title")!.value =
      note.title;
    this.root.querySelector<HTMLTextAreaElement>(".notes__body")!.value =
      note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      ?.classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible: boolean) {
    this.root.querySelector<HTMLDivElement>(
      ".notes__preview"
    )!.style.visibility = visible ? "visible" : "hidden";
  }
}
