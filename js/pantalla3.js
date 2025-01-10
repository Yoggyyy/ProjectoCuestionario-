/**
 * @file pantalla3.js
 * @description Gestiona la pantalla de cuestionarios y las preguntas.
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Configura los eventos del formulario y el botón "Atrás" cuando el DOM esté cargado.
   */
  const formPreguntas = document.getElementById("form-preguntas");
  const tablaPreguntas = document.getElementById("tabla-preguntas");
  const mensajeDeCarga = document.getElementById("mensaje-de-carga");

  /**
   * Carga las preguntas almacenadas en cookies al iniciar la pantalla.
   */
  mostrarCarga(true);
  const preguntas = cargarPreguntas();
  if (preguntas) {
    mostrarPreguntas(preguntas, (conRetraso = true)).finally(() => {
      mostrarCarga(false);
    });
  } else {
    esperar(5000).finally(() => {
      mostrarCarga(false);
    });
  }

  if (formPreguntas && tablaPreguntas) {
    formPreguntas.addEventListener("submit", async function (event) {
      /**
       * Maneja el evento de envío del formulario.
       * Valida los campos y guarda la pregunta en cookies.
       *
       * @param {Event} event - Evento de envío del formulario.
       */
      event.preventDefault();

      mostrarCarga(true);
      esperar(5000)
        .then(async () => {
          // Capturar valores del formulario
          const pregunta = document.getElementById("pregunta").value;
          const respuesta = document.querySelector(
            "input[name='respuesta']:checked"
          )?.value;
          const puntuacion = document.getElementById("puntuacion").value;

          // Validar campos
          if (!pregunta || !respuesta || !puntuacion) {
            alert("Por favor, completa todos los campos.");
            return;
          }

          // Crear y agregar una nueva fila a la tabla
          const fila = document.createElement("tr");
          fila.innerHTML = `
                <td>${pregunta}</td>
                <td>${respuesta}</td>
                <td>${puntuacion}</td>
                <td>Guardando...</td>`;
          tablaPreguntas.appendChild(fila);

          // Guardar pregunta en cookies y actualizar estado de la fila
          const guardado = await grabarPregunta(
            pregunta,
            respuesta,
            puntuacion
          );

          if (guardado) {
            fila.lastChild.textContent = "OK";
            document.getElementById("btn-atras").disabled = false;
          } else {
            fila.lastChild.textContent = "Error al guardar";
          }
        })
        .finally(() => {
          mostrarCarga(false);
        });
    });
  }

  /**
   * Configura el evento del botón "Atrás" para redirigir a la pantalla anterior.
   */
  document.getElementById("btn-atras").addEventListener("click", () => {
    window.location.href = "pantalla2.html";
  });
});

function mostrarCarga(estado) {
  const mensajeDeCarga = document.querySelector("#mensaje-de-carga");

  if (estado) {
    mensajeDeCarga.style.display = "block";
  } else {
    mensajeDeCarga.style.display = "none";
  }
}

/**
 * Almacena una nueva pregunta en las cookies.
 *
 * Simula un retraso de 5 segundos para replicar la experiencia de grabar en un servidor.
 *
 * @param {string} pregunta - La pregunta ingresada por el usuario.
 * @param {string} respuesta - La respuesta seleccionada (verdadero/falso).
 * @param {number} puntuacion - La puntuación asignada a la pregunta.
 * @returns {Promise<boolean>} - Promesa que se resuelve cuando se guarda la pregunta.
 */
async function grabarPregunta(pregunta, respuesta, puntuacion) {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Leer las preguntas existentes de las cookies
        const preguntasCookie = leerCookie("preguntas");
        const preguntas = preguntasCookie ? JSON.parse(preguntasCookie) : [];

        // Agregar la nueva pregunta
        preguntas.push({ pregunta, respuesta, puntuacion, estado: "OK" });

        // Guardar las preguntas actualizadas en las cookies
        document.cookie = `preguntas=${encodeURIComponent(
          JSON.stringify(preguntas)
        )}; path=/; max-age=${7 * 24 * 60 * 60}`;
        resolve(true);
      } catch (error) {
        console.error("Error al guardar pregunta:", error);
        resolve(false);
      }
    }, 5000);
  });
}

/**
 * Lee una cookie por su nombre.
 *
 * @param {string} nombre - El nombre de la cookie a leer.
 * @returns {string|null} El valor de la cookie o null si no existe.
 */
function leerCookie(nombre) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${nombre}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function cargarPreguntas() {
  // Leer las preguntas almacenadas en cookies
  const preguntasCookie = leerCookie("preguntas");
  return preguntasCookie ?? null;
}

async function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Carga las preguntas almacenadas desde las cookies y las muestra en la tabla.
 *
 * @param {boolean} [conRetraso=false] - Indica si se debe esperar 5 segundos antes de cargar las preguntas.
 */
async function mostrarPreguntas(preguntas, conRetraso = false) {
  return new Promise(async (resolve) => {
    // Mostrar un retraso de 5 segundos si se solicita
    if (conRetraso) {
      await esperar(5000);
    }

    // Comprobar si la tabla de preguntas existe
    const tablaPreguntas = document.getElementById("tabla-preguntas");

    if (!tablaPreguntas) return;

    tablaPreguntas.innerHTML = ""; // Limpiar la tabla y agregar las preguntas

    preguntas = JSON.parse(preguntas);

    preguntas.forEach(({ pregunta, respuesta, puntuacion, estado }) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
      <td>${pregunta}</td>
      <td>${respuesta}</td>
      <td>${puntuacion}</td>
      <td>${estado}</td>`;
      tablaPreguntas.appendChild(fila);
    });

    resolve(true); // Resuelve la promesa
  });
}
