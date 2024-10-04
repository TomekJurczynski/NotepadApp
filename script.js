function addNewNote() {
    document.getElementById("main-add-new-btn").style.display = "none";

    const addNoteContainer = document.createElement("div");
    addNoteContainer.innerHTML = `
    <div class="add-new-note" id="add-new-note">
        <div class="new-note-label-container">
            <label class="new-note-label">Add new note</label><button class="cancel-btn" onclick="closeNewNote()">Cancel</button>
        </div>
        <input class="note-title" id="note-title" placeholder="Note title" />
        <textarea class="note-content" id="note-content" placeholder="Your note"></textarea>
        <button class="save-note-btn" onclick="createNote()">Save</button>
    </div>
    `;
    if (document.getElementById("notes-list").computedStyleMap().get('display').value === "none") {
        document.getElementById("container").appendChild(addNoteContainer);
    } else {
        document.getElementById("notes-list").prepend(addNoteContainer);
    }
    document.getElementById("empty-notes").style.display = "none";

}

function closeNewNote() {
    const addNoteContainer = document.getElementById("add-new-note");
    if (addNoteContainer) {
        addNoteContainer.remove()
        document.getElementById("empty-notes").style.display = "block"
    }
}

function createNote() {
    const newNoteContainer = document.getElementById("add-new-note");
    const noteTitle = document.getElementById("note-title").value;
    const noteContent = document.getElementById("note-content").value;
    if (noteTitle.trim() !== '') {
        const data = {
            id: new Date().getTime(),
            title: noteTitle,
            content: noteContent,
            date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        };
        const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
        existingNotes.push(data)
        localStorage.setItem("notes", JSON.stringify(existingNotes));
        document.getElementById("note-title").value = '';
        document.getElementById("note-content").value = '';
        newNoteContainer.remove();
        displayNotesList();
    }
}

function displayNotesList() {
    document.getElementById("main-add-new-btn").style.display = "block"
    document.getElementById("notes-list").style.display = "block"

    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach(element => {
        const listItem = document.createElement("li");
        listItem.setAttribute("id", element.id)
        listItem.innerHTML = `
            <div class="note-preview-title">
                <label class="note-preview-title-label">${element.title}</label>
                <button class="delete-btn" onclick="openDeletePopup(${element.id})"><img src="./assets/delete.png" /></button>
                <button class="edit-btn" onclick="editNote(${element.id})"><img src="./assets/edit.png" style="padding-top:3px;" /></button>
            </div>
            <div class="note-preview-body">
                <label class="note-preview-body-label">${element.content}</label>
            </div>
            <div class="note-preview-date">
                <label class="note-preview-date-label">${element.date}</label>
            </div>
        `;
        notesList.appendChild(listItem)
    });
}

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const editNote = notes.find(note => note.id == noteId);
    const editTitle = editNote ? editNote.title : '';
    const editContent = editNote ? editNote.content : '';
    const editNoteContainer = document.createElement("div");
    editNoteContainer.innerHTML = `
        <div class="edit-note" id="edit-note" data-id="${noteId}">
            <div class="new-note-label-container">
                <label class="new-note-label">Edit note</label><button class="cancel-btn" onclick="closeEditNote(${noteId})">Cancel</button>
            </div>
            <textarea class="edit-note-title" id="note-title">${editTitle}</textarea>
            <textarea class="note-content" id="note-content">${editContent}</textarea>
            <button class="save-note-btn" onclick="updateNote()">Save</button>
        </div>
    `;
    document.getElementById(noteId).style.display = "none"
    document.getElementById("notes-list").prepend(editNoteContainer);
}

function updateNote() {
    const noteTitle = document.getElementById('note-title').value.trim();
    const noteContent = document.getElementById('note-content').value.trim();
    const editNoteContainer = document.getElementById('edit-note');
    const noteId = editNoteContainer.getAttribute('data-id');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    const updatedNotes = notes.map(note => {
        if (note.id == noteId) {
            return { id: note.id, title: noteTitle, content: noteContent, date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
        }
        return note;
    });

    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    editNoteContainer.remove();
    displayNotesList();
}

function closeEditNote(noteId) {
    const editNoteContainer = document.getElementById("edit-note");
    if (editNoteContainer) {
        editNoteContainer.remove()
        document.getElementById(noteId).style.removeProperty('display');
    }
}

function openDeletePopup(noteId) {
    const deletePopup = document.createElement("div");
    Object.assign(deletePopup, {
        className: 'delete-popup',
        id: "delete-popup"
    });
    deletePopup.innerHTML = `
        <div class="delete-note-label">Delete Note</div>
        <div class="delete-note-description">Are you sure you want to delete this note?</div>
        <div class="delete-note-buttons">
            <button class="cancel-delete-btn" onclick="closeDeleteNote()">Cancel</button>
            <button class="confirm-delete-btn" onclick="deleteNote(${noteId})">Delete</button>
        </div>
    `;
    const overlay = document.createElement("div");
    Object.assign(overlay, {
        className: 'overlay',
        id: "overlay"
    });
    document.getElementById("container").appendChild(overlay);
    document.getElementById("container").appendChild(deletePopup);
}

function closeDeleteNote() {
    const deleteNoteContainer = document.getElementById("delete-popup");
    const overlay = document.getElementById("overlay");
    if (deleteNoteContainer) {
        deleteNoteContainer.remove();
        overlay.remove();
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(deleteNote => deleteNote.id !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    closeDeleteNote()
    displayNotesList();
}


const searchInput = document.getElementById("searchbar");
searchInput.addEventListener("input", (event) => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const value = event.target.value;
    notes.forEach(note => {
        const isVisible = note.title.includes(value) || note.content.includes(value);
        document.getElementById(note.id).classList.toggle("hide", !isVisible);
    })
});

