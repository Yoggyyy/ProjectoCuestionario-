/**
 * @file pantalla2.js
 * @description Controla el formulario de login y la validación del correo.
 */

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const inputCorreo = document.getElementById("correo");
  const btnPreguntas = document.getElementById("btn-preguntas");

  if (inputCorreo) {
      inputCorreo.addEventListener("blur", validarCorreo);
  }

  if (formLogin) {
      formLogin.addEventListener("submit", manejarLogin);
  }

  if (btnPreguntas) {
      btnPreguntas.addEventListener("click", () => {
          window.location.href = "pantalla3.html";
      });
  }

  cargarPantallaBienvenidaUsuario();
});

/**
* Valida el correo electrónico ingresado por el usuario.
* 
* @event blur
* @this HTMLInputElement
*/
function validarCorreo() {
  const correo = this.value;
  const regex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
  const errorCorreo = document.getElementById("error-correo");

  if (!regex.test(correo)) {
      if (errorCorreo) errorCorreo.style.display = "inline";
      this.select();
  } else {
      if (errorCorreo) errorCorreo.style.display = "none";
  }
}

/**
* Maneja el evento de envío del formulario de login.
* Guarda los datos del usuario en una cookie y carga la pantalla de bienvenida del usuario.
* 
* @event submit
* @param {Event} event - El evento de envío del formulario.
*/
function manejarLogin(event) {
  event.preventDefault();
  const correo = document.getElementById("correo").value;

  const usuarioData = {
      correo,
      ultimaEntrada: new Date().toISOString(),
  };
  document.cookie = `usuario=${JSON.stringify(usuarioData)}; path=/; max-age=${7 * 24 * 60 * 60}`;

  cargarPantallaBienvenidaUsuario();
}

/**
* Transición a la pantalla de bienvenida del usuario.
*/
function cargarPantallaBienvenidaUsuario() {
  const pantallaLogin = document.getElementById("pantalla-login");
  const pantallaUsuario = document.getElementById("pantalla-bienvenida-usuario");
  const mensajeUsuario = document.getElementById("mensaje-usuario");

  if (pantallaLogin) pantallaLogin.style.display = "none";
  if (pantallaUsuario) pantallaUsuario.style.display = "block";

  const usuarioCookie = leerCookie("usuario");
  if (usuarioCookie && mensajeUsuario) {
      const usuarioData = JSON.parse(usuarioCookie);
      const ultimaEntrada = new Date(usuarioData.ultimaEntrada).toLocaleString("es-ES", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
      });
      mensajeUsuario.textContent = `Hola ${usuarioData.correo}, la última vez que entraste fue el ${ultimaEntrada}.`;
  }
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
  return cookie ? cookie.split("=")[1] : null;
}
