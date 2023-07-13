document.addEventListener("DOMContentLoaded", function () {
  const bookContainer = document.querySelector("#book-container");
  const bookForm = document.querySelector("#book-form");

  fetch("http://localhost:3000/noticias")
    .then((response) => response.json())
    .then((noticias) => verData(noticias))
    .catch((error) => console.log("Archivo no adquirido", error));

  const verData = (noticias) => {
    for (i = 0; i <= noticias.length; i++) {
      bookContainer.innerHTML += `
      <div id=${noticias[i].id}>
        <h2>${noticias[i].title}</h2>
        <h4>Author: ${noticias[i].author}</h4>
        <img src="${noticias[i].coverImage}" width="333" height="500">
        <p>${noticias[i].description}</p>
        <button data-id="${noticias[i].id}" id="edit-${noticias[i].id}" data-action="edit">Edit</button>
        <button data-id="${noticias[i].id}" id="delete-${noticias[i].id}" data-action="delete">Delete</button>
      </div>`;
    }
  }; // end of book fetch

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = bookForm.querySelector("#title").value;
    const authorInput = bookForm.querySelector("#author").value;
    const coverImageInput = bookForm.querySelector("#coverImage").value;
    const descInput = bookForm.querySelector("#description").value;

    fetch("http://localhost:3000/noticias", {
      method: "POST",
      body: JSON.stringify({
        title: titleInput,
        author: authorInput,
        coverImage: coverImageInput,
        description: descInput,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((noticias) => {
        const noticia = noticias.noticias;
        bookContainer.innerHTML += `
        <div id=${noticia.id}>
            <h2>${noticia.title}</h2>
            <h4>Author: ${noticia.author}</h4>
            <img src="${noticia.coverImage}" width="333" height="500">
            <p>${noticia.description}</p>
            <button data-id="${noticia.id}" id="edit-${noticia.id}" data-action="edit">Edit</button>
            <button data-id="${noticia.id}" id="delete-${noticia.id}" data-action="delete">Delete</button>
        </div>`;
      })
      .catch((error) => console.log("Archivo no adquirido", error));
  }); //FUNCIONANDO HASTA ACA

  bookContainer.addEventListener("click", (e) => {
    //MODULO DE EDICIÓN - ARREGLAR EL FUNCIONAMIENTO DEL MISMO
    let allBooks = [];
    fetch("http://localhost:3000/noticias")
      .then((response) => response.json())
      .then((noticias) =>
        noticias.forEach(function (noticia) {
          allBooks = noticia;
          bookContainer.innerHTML += `
          <div id=book-${noticia.id}>
            <h2>${noticia.title}</h2>
            <h4>Author: ${noticia.author}</h4>
            <img src="${noticia.coverImage}" width="333" height="500">
            <p>${noticia.description}</p>
            <button data-id="${noticia.id}" id="edit-${noticia.id}" data-action="edit">Edit</button>
            <button data-id="${noticia.id}" id="delete-${noticia.id}" data-action="delete">Delete</button>
          </div>`;
        })
      ); // end of book fetch
    console.log(allBooks);
    if (e.target.dataset.action === "edit") {
      const editButton = document.querySelector(`#edit-${e.target.dataset.id}`);
      editButton.disabled = true;

      const noticia = allBooks.find((noticia) => {
        return noticia.id == e.target.dataset.id;
      });

      e.target.parentElement.innerHTML += `
      <div id='edit-book'>
        <form id="book-form">
          <input required id="edit-title" placeholder="${noticia.title}">
          <input required id="edit-author" placeholder="${noticia.author}">
          <input required id="edit-coverImage" placeholder="${noticia.coverImage}">
          <input required id="edit-description" placeholder="${noticia.description}">
          <input type="submit" value="Edit Book">
      </div>`;
      editForm.addEventListener("submit", (e) => {
        event.preventDefault();
        const titleInput = document.querySelector("#edit-title").value;
        const authorInput = document.querySelector("#edit-author").value;
        const coverImageInput =
          document.querySelector("#edit-coverImage").value;
        const descInput = document.querySelector("#edit-description").value;
        const editedBook = document.querySelector(`#book-${noticias.id}`);
        fetch(`${bookURL}/${noticias.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: titleInput,
            author: authorInput,
            coverImage: coverImageInput,
            description: descInput,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((noticia) => {
            editedBook.innerHTML = `
          <div id=book-${noticia.id}>
            <h2>${noticia.title}</h2>
            <h4>Author: ${noticia.author}</h4>
            <img src="${noticia.coverImage}" width="333" height="500">
            <p>${noticia.description}</p>
            <button data-id=${noticia.id} id="edit-${noticia.id}" data-action="edit">Edit</button>
            <button data-id=${noticia.id} id="delete-${noticia.id}" data-action="delete">Delete</button>
          </div>
          <div id=edit-book-${noticia.id}>
          </div>`;
            editForm.innerHTML = "";
          });
      }); // end of this event Listener for edit submit
      console.log("you pressed edit");
    } else if (e.target.dataset.action === "delete") {
      //MODULO FUNCIONAL - VER PORQUE HAY QYE REALIZAR LA DOBLE CONFIRMACIÓN DE LA ELIMINACIÓN
      document.querySelector(`#book-${e.target.dataset.id}`).remove();
      fetch(`http://localhost:3000/noticias/${e.target.dataset.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
      console.log("you pressed delete");
    }
  }); // end of eventListener for editing and deleting a book
});
