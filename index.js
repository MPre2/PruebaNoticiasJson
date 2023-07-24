//Importamos las funciones del archivo popUps.js
import { borrado, editado, guardado } from "./popUps";

document.addEventListener("DOMContentLoaded", function () {
  // Modulo para ejecutar todo el contenido cuando se ingresa en el sitio
  const bookContainer = document.querySelector("#book-container");
  const bookForm = document.querySelector("#book-form");

  fetch("http://localhost:3000/noticias") // fetch para la lectura del contenido del JSON con las noticias (GET)
    .then((response) => response.json())
    .then((noticias) => {
      noticias.forEach((noticia) => {
        bookContainer.innerHTML += `
        <div id=${noticia.id}>
          <h2>${noticia.title}</h2>
          <img src="${noticia.coverImage}" width="300" height="400">
          <h4>Resumen: ${noticia.author}</h4>
          <p>${noticia.description}</p>
          <button data-id="${noticia.id}" id="edit-${noticia.id}" data-action="edit">Edit</button>
          <button data-id="${noticia.id}" id="delete-${noticia.id}" data-action="delete">Delete</button>
        </div>`;
      });
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
            <h4>Resumen: ${noticia.author}</h4>
            <img src="${noticia.coverImage}" width="333" height="500">
            <p>${noticia.description}</p>
            <button data-id="${noticia.id}" id="edit-${noticia.id}" data-action="edit">Edit</button>
            <button data-id="${noticia.id}" id="delete-${noticia.id}" data-action="delete">Delete</button>
        </div>`;
      })
      .catch((error) => console.log("Archivo no adquirido", error));
  });

  bookContainer.addEventListener("click", (e) => {
    //MODULO DE EDICIÓN - VERIFICA QUE BOTÓN FUE CLICKEADO Y EN BASE A ESO RECURRE A REALIZAR LAS ACCIONES CORRESPONDIENTES

    if (e.target.dataset.action === "edit") {
      //THEN
      const editForm = e.target.parentElement;
      const editButton = document.querySelector(`#edit-${e.target.dataset.id}`);
      const indice = e.target.dataset.id;
      editButton.disabled = true;

      fetch(`http://localhost:3000/noticias/${e.target.dataset.id}`) // VUELCA LOS DATOS DEL OBJETO A MODIFICAR EN PANTALLA
        .then((response) => response.json())
        .then((noticia) => {
          e.target.parentElement.innerHTML += `
          <div id="edit-book">
            <form id="book-form">
              <input required id="edit-title" value="${noticia.title}">
              <input required id="edit-author" value="${noticia.author}">
              <input required id="edit-coverImage" value="${noticia.coverImage}">
              <input required id="edit-description" value="${noticia.description}">
              <input id="editForm" type="submit" value="Edit Book">
            </form>
          </div>`;
        });

      editForm.addEventListener("submit", (e) => {
        // Edición de los datos de la noticia seleccionada
        e.preventDefault();

        const titleInput = document.querySelector("#edit-title").value;
        const authorInput = document.querySelector("#edit-author").value;
        const coverImageInput =
          document.querySelector("#edit-coverImage").value;
        const descInput = document.querySelector("#edit-description").value;
        const editedBook = document.querySelector(`#book-${indice}`);

        fetch(`http://localhost:3000/noticias/${indice}`, {
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
              <h4>Resumen: ${noticia.author}</h4>
              <img src="${noticia.coverImage}" width="333" height="500">
              <p>${noticia.description}</p>
              <button data-id=${noticia.id} id="edit-${noticia.id}" data-action="edit">Edit</button>
              <button data-id=${noticia.id} id="delete-${noticia.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-book-${noticia.id}>
            </div>`;
            editForm.innerHTML = "";
          })
          .catch((error) => console.log("Archivo no adquirido", error));
      });
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
