import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useReveal } from "./hooks/media";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Project } from "./sections/Project";
import { Areas } from "./sections/Areas";
import { Safety } from "./sections/Safety";
import { Articulation } from "./sections/Articulation";
import { Benefits } from "./sections/Benefits";
import { Contact } from "./sections/Contact";
import { EnrollLauncher } from "./components/EnrollLauncher";

/**
 * Orden: portada → capacitaciones (áreas, talleres y seguridad) → la institución (quiénes somos,
 * el proyecto, articulación y beneficios) → contacto. «Capacitate con nosotros» flota sobre todo.
 */
export function App() {
  useReveal();
  // El contenido se dibuja después de la carga: un enlace directo (#areas) necesita este salto.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" }));
  }, []);
  return (
    <>
      <a href="#areas" className="skip">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <Areas />
        <Safety />
        <About />
        <Project />
        <Articulation />
        <Benefits />
        <Contact />
      </main>
      <Footer />
      <EnrollLauncher />
    </>
  );
}
