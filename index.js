document.addEventListener("DOMContentLoaded", function () {
  // Modulo para ejecutar todo el contenido cuando se ingresa en el sitio
  const bookContainer = document.querySelector("#book-container");
  const bookForm = document.querySelector("#book-form");
  const editForm = document.querySelector("#editForm");

  fetch("http://localhost:3000/noticias") // fetch para la lectura del contenido del JSON con las noticias (GET)
    .then((response) => response.json())
    .then((noticias) => {
      for (i = 0; i < noticias.length; i++) {
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
    })
    .catch((error) => console.log("Archivo no adquirido", error));

  bookForm.addEventListener("submit", (e) => {
    // Modulo que crea el contenedor de la noticia dentro del JSON (CREATE / POST)
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
      .then((noticia) => {
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
  });

  bookContainer.addEventListener("click", (e) => {
    //MODULO DE EDICIÓN - VERIFICA QUE BOTON FUE CLICKEADO Y EN BASE A ESO RECURRE A REALIZAR LAS ACCIONES CORRESPONDIENTES
    let allBooks = [];
    fetch("http://localhost:3000/noticias")
      .then((response) => response.json())
      .then((noticias) => {
        noticias
          .forEach((noticia) => {
            allBooks.push(noticia);
          })
      .catch((error) => console.log("Archivo no adquirido", error));
      });

    if (e.target.dataset.action === "edit") {
      //THEN
      const editButton = document.querySelector(`#edit-${e.target.dataset.id}`);
      editButton.disabled = true;

      fetch(`http://localhost:3000/noticias/${e.target.dataset.id}`) // VUELCA LOS DATOS DEL OBJETO A MODIFICAR EN PANTALLA
        .then((response) => response.json())
        .then((noticia) => {
          e.target.parentElement.innerHTML += `
          <div id='edit-book'>
            <form id="book-form">
              <input required id="edit-title" value="${noticia.title}">
              <input required id="edit-author" value="${noticia.author}">
              <input required id="edit-coverImage" value="${noticia.coverImage}">
              <input required id="edit-description" value="${noticia.description}">
              <input id="editForm" type="submit" value="Edit Book">
          </div>`;
        });

      if (editForm) {
        //VERIFICAR EL FUNCIONAMIENTO DE ESTE MODULO Y VER PORQUE NO GENERA LAS MODIFICACIONES EN EL "JSON"
        editForm.addEventListener("submit", (e) => {
          // Edición de los datos de la noticia seleccionada
          e.preventDefault();
          const titleInput = document.querySelector("#edit-title").value;
          const authorInput = document.querySelector("#edit-author").value;
          const coverImageInput =
            document.querySelector("#edit-coverImage").value;
          const descInput = document.querySelector("#edit-description").value;
          const editedBook = document.querySelector(`#book-${noticia.id}`);
          fetch(`http://localhost:3000/noticias/${e.target.dataset.id}`, {
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
            <div id=book-${e.target.dataset.id}>
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
        });
      }
    } else if (e.target.dataset.action === "delete") {
      //MODULO QUE ELIMINA UNA NOTICIA
      fetch(`http://localhost:3000/noticias/${e.target.dataset.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .catch((error) => console.log("Archivo no adquirido", error));
    }

    function newFunction() {
      return [];
    }
  });
});
