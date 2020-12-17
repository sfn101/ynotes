// selecting DOM elements
const list = document.querySelector("ul");
const form = document.querySelector("form");
list.parentElement.style.display = "none";

// function to delete the member from front end after it ben deleted in the database
const deleteLi = id => {
  const lis = document.querySelectorAll("li[note-id]");

  lis.forEach(li => {
    if (li.getAttribute("note-id") === id) {
      li.remove();
    }
  });
};

//function for deleting member from the database
list.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    if (confirm("are you sure you want to delete this note ?")) {
      const id = e.target.parentElement.getAttribute("note-id");
      db.collection("notes")
        .doc(id)
        .delete()
        .then(() => console.log("note has been deleted"))
        .catch(err => console.error(err));
    }
  }
});
//function to add note to the database
form.addEventListener("submit", e => {
  e.preventDefault();
  const now = new Date();
  const note = {
    from: form.name.value,
    note: form.note.value,
    at: firebase.firestore.Timestamp.fromDate(now),
  };
  // console.log(member);
  db.collection("notes")
    .add(note)
    .then(() => {
      form.reset();
      console.log("note has been added");
    })
    .catch(err => console.error(err));
});

// function to add the member info to the page
const addNote = (note, id) => {
  const html = /*html*/ `<li note-id="${id}"">
    <h3>${note.note}</h3>
    <span>from: ${note.from}</span></br>
    <span>At: ${note.at.toDate().toLocaleString()}</span></br>
    <button class="delete">delete</button>
  </li>`;
  list.innerHTML += html;
};

//executing all the functions to the database
db.collection("notes").onSnapshot(snap => {
  // console.log(snap.docChanges());
  if (snap.docChanges().length !== 0) {
  }
  snap.docChanges().forEach(note => {
    const sNew = document.getElementById("new");
    if (note.type === "added") {
      sNew.innerText = "new note is added";
      // console.log(snap.docChanges());
      addNote(note.doc.data(), note.doc.id);
    } else if (note.type === "removed") {
      sNew.innerText = "note was deleted";
      deleteLi(note.doc.id);
    } else {
      sNew.innerText = "no change";
      console.log(`database ${note.doc.id} has been edited
`);
    }
  });
  const show = document.getElementById("show");
  show.addEventListener("click", () => {
    if (list.parentElement.style.display === "none") {
      list.parentElement.style.display = "flex";
    } else list.parentElement.style.display = "none";
  });
});
