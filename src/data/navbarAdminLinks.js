import UserService from "/src/services/UserService";

/**
 * Cierra la sesion del administrador.
 *
 * Se llama desde el enlace "Salir" del menu de administracion. La funcion
 * limpia la sesion local y notifica al backend, de modo que la sesion
 * queda invalidada tambien en el servidor.
 *
 * Antes esta funcion no existia y el enlace la invocaba, lo que producia un
 * error de referencia en tiempo de ejecucion ("handleLogout is not defined").
 *
 * @returns {Promise<void>} promesa resuelta cuando la sesion ha terminado
 */
const handleLogout = async () => {
  try {
    const token = sessionStorage.getItem("token");

    if (token) {
      await UserService.logout(token);
    }
  } catch (error) {
    // Un fallo al notificar al backend no debe impedir cerrar la sesion
    // local: el usuario tiene que poder salir de todas formas.
    console.error("Error al cerrar sesion en el backend:", error);
  } finally {
    sessionStorage.removeItem("usuarioActivo");
    sessionStorage.removeItem("token");
  }
};

export const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Usuarios" },
  { to: "/admin/facciones", label: "Facciones" },
  { to: "/", label: "Salir", onClick: handleLogout },
];

export { handleLogout };

export default adminLinks;
