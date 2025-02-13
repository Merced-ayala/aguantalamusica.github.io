document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Obtener y limpiar los valores de los campos
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validaciones básicas
            if (!name || !email || !phone || !message) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
            const isValidPhone = /^[0-9]{10}$/.test(phone);

            if (!isValidEmail) {
                alert('El correo electrónico no es válido.');
                return;
            }

            if (!isValidPhone) {
                alert('El número de celular debe tener 10 dígitos.');
                return;
            }

            // Construir el objeto de datos
            const data = { name, email, phone, message };

            try {
                // Enviar datos al servidor
                const response = await fetch('http://localhost:3000/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Formulario enviado exitosamente, ¡Nos pondremos en contacto contigo!');
                    const result = await response.json();
                    console.log('Respuesta del servidor:', result);

                    // Resetear el formulario
                    contactForm.reset();
                } else {
                    const errorText = await response.text();
                    alert(`Error al enviar el formulario: ${errorText}`);
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                alert('Hubo un problema al intentar enviar el formulario. Inténtalo más tarde.');
            }
        });
    } else {
        console.error('No se encontró el formulario con el ID "contactForm".');
    }
});