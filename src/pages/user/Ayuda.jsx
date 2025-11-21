import React from "react";
import { Container } from "react-bootstrap";

const Ayuda = () => {
  return (
    <main className="my-5">
      <Container>
        <h1 className="mb-4">Centro de Ayuda</h1>

        <section className="mb-5">
          <h3>Servicio al Cliente</h3>
          <p>
            En EFA trabajamos para ofrecerte la mejor experiencia de compra. Si tienes
            dudas, reclamos o sugerencias, puedes comunicarte con nuestro equipo de atención
            al cliente a través del correo <strong>contacto@efa-store.com</strong> o mediante
            nuestras redes sociales oficiales.
          </p>
        </section>

        <section className="mb-5">
          <h3>Nuestras Tiendas</h3>
          <p>
            Contamos con presencia en varias ciudades del país. Puedes visitar nuestras
            tiendas físicas o comprar desde la comodidad de tu hogar en nuestra tienda online.
          </p>
        </section>

        <section className="mb-5">
          <h3>Click & Collect</h3>
          <p>
            Compra online y retira tu pedido en una de nuestras tiendas seleccionadas sin costo adicional.
            Recibirás una notificación por correo electrónico cuando tu pedido esté listo para retiro.
          </p>
        </section>

        <section className="mb-5">
          <h3>Términos y Condiciones</h3>
          <p>
            El uso de nuestro sitio web implica la aceptación de nuestros términos y condiciones.
            Nos reservamos el derecho de modificar precios, políticas y promociones sin previo aviso.
          </p>
        </section>

        <section className="mb-5">
          <h3>Política de Privacidad</h3>
          <p>
            En EFA respetamos tu privacidad. Toda la información personal recolectada se utiliza
            exclusivamente para procesar pedidos, mejorar nuestros servicios y ofrecerte una experiencia personalizada.
          </p>
        </section>

        <section className="mb-5">
          <h3>Política de Cookies</h3>
          <p>
            Utilizamos cookies para optimizar la navegación y ofrecerte contenido relevante. Puedes
            gestionar o desactivar las cookies desde la configuración de tu navegador en cualquier momento.
          </p>
        </section>

        <section className="mb-5">
          <h3>Contacto</h3>
          <p>
            📧 <strong>Email:</strong> contacto@efa-store.com <br />
            📞 <strong>Teléfono:</strong> +56 9 1234 5678 <br />
            🕒 <strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 18:00 hrs
          </p>
        </section>
      </Container>
    </main>
  );
};

export default Ayuda;
