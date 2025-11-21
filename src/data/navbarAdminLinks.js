export const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Usuarios" },
  { to: "/admin/facciones", label: "Facciones" },
  { to: "/", label: "Salir", onClick: () => handleLogout() }, // opcional
];

export default adminLinks;