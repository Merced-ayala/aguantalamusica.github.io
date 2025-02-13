document.addEventListener("DOMContentLoaded", function () {
    // Crear el contenedor del banner
    const banner = document.createElement("div");
    banner.id = "promo-banner";
    
    // Agregar contenido al banner con un enlace
    banner.innerHTML = '<a href="/contactanos.html">50% de descuento en tu primera sesión de Musicoterapia🎁</a>';

    // Insertar el banner después de la barra de navegación
    const navbar = document.querySelector(".navbar"); // Asegúrate de que tu navbar tenga esta clase
    if (navbar) {
        navbar.insertAdjacentElement("afterend", banner);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }
});