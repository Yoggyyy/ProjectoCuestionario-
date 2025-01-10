/**
 * @file pantalla1.js
 * @description Controla la pantalla de bienvenida y la transición al login.
 */

/**
 * Carga automáticamente la pantalla de login después de un retraso.
 * También permite el acceso directo a través de una combinación de teclas.
 */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(cargarLogin, 5000); // Transición automática después de 5 segundos.
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "F10") {
      cargarLogin();
  }
});

/**
* Oculta la pantalla de bienvenida y muestra la pantalla de login.
*/
function cargarLogin() {
  const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
  const pantallaLogin = document.getElementById("pantalla-login");

  if (pantallaBienvenida) pantallaBienvenida.style.display = "none";
  if (pantallaLogin) pantallaLogin.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const inputCorreo = document.getElementById("correo");

  if (inputCorreo) {
      inputCorreo.addEventListener("blur", validarCorreo);
  }

  if (formLogin) {
      formLogin.addEventListener("submit", manejarLogin);
  }
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

  window.location.href = "pantalla2.html";
}
