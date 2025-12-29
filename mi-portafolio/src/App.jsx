import { useState, useEffect, useRef } from 'react'
import './index.css'

// Icons as SVG components
const icons = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77C7.61 10.55 9.72 11 12 11s4.39-.45 6-1.23V12z" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </svg>
  )
}

// Project data
const projects = [
  {
    id: 1,
    title: "Sist. Admin - Pollita Millonaria",
    type: "Web App",
    description: "Sistema administrativo para la lotería 'La Pollita Millonaria'. Gestión completa de ventas, dashboard en tiempo real y reportes estadísticos.",
    status: "completed",
    emoji: "🎰",
    technologies: ["React", "TypeScript", "Vite", "Supabase", "Tailwind", "Radix UI", "Recharts"],
    image: "/project-pollita-admin.png",
    github: "#",
    demo: "#"
  },
  {
    id: 2,
    title: "La Cantina",
    type: "Mobile App",
    description: "Ecosistema completo: App móvil para gestión de pedidos y Panel Administrativo Web para control de inventario y ventas.",
    status: "in-progress",
    emoji: "🍺",
    technologies: ["React Native", "Expo", "TypeScript", "Zustand", "React Navigation"],
    image: "/project-cantina.png",
    github: "#",
    demo: "#"
  },
  {
    id: 3,
    title: "Juego QR",
    type: "Mobile App",
    description: "App de gamificación con escaneo QR y Panel Web de administración para gestionar usuarios, pistas y ranking en tiempo real.",
    status: "in-progress",
    emoji: "🎮",
    technologies: ["Flutter", "Dart", "Supabase", "QR Scanner"],
    image: "/project-juego-qr.png",
    github: "#",
    demo: "#"
  },
  {
    id: 4,
    title: "SOS Grúa",
    type: "Website",
    description: "Plataforma web para servicio de grúas con integración WhatsApp, geolocalización y pasarela de pagos.",
    status: "completed",
    emoji: "🚗",
    technologies: ["HTML5", "CSS3", "PHP", "Google Maps", "WhatsApp API"],
    image: "/project-sos-grua.png",
    github: "#",
    demo: "#"
  },
  {
    id: 5,
    title: "Turismo Sensorial",
    type: "Web App",
    description: "Página web de turismo sensorial con experiencias inmersivas y accesibles.",
    status: "in-progress",
    emoji: "🌴",
    technologies: ["React", "Supabase", "CSS3"],
    image: "/project-turismo.png",
    github: "#",
    demo: "#"
  }
]

// Skills data
const skillCategories = [
  {
    title: "Lenguajes",
    icon: icons.code,
    skills: ["JavaScript", "TypeScript", "Dart", "PHP", "HTML5", "CSS3", "SQL"]
  },
  {
    title: "Web",
    icon: icons.web,
    skills: ["React", "Vite", "Tailwind", "Radix UI", "Framer Motion"]
  },
  {
    title: "Mobile",
    icon: icons.mobile,
    skills: ["Flutter", "React Native", "Expo"]
  },
  {
    title: "Backend",
    icon: icons.database,
    skills: ["Supabase", "PostgreSQL", "PHP", "REST APIs"]
  },
  {
    title: "Tools",
    icon: icons.tools,
    skills: ["Git", "GitHub", "VS Code", "Figma", "npm", "Vercel"]
  }
]

// Pixel Background Component
function PixelBackground() {
  return (
    <>
      <div className="pixel-bg"></div>
      <div className="pixel-grid"></div>
      <div className="pixel-particles">
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
        <div className="pixel-particle"></div>
      </div>
      <div className="pixel-corner pixel-corner--tl"></div>
      <div className="pixel-corner pixel-corner--br"></div>
    </>
  )
}

// Typing Animation Component
function TypingText({ texts }) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, texts])

  return (
    <span style={{ color: '#81b29a' }}>
      {displayText}
      <span style={{
        animation: 'blink 0.8s step-end infinite',
        marginLeft: '2px',
        color: '#e07a5f'
      }}>_</span>
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}

// Scroll Animation Hook
function useScrollAnimation() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isVisible]
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  // Scroll animation refs
  const [aboutRef, aboutVisible] = useScrollAnimation()
  const [skillsRef, skillsVisible] = useScrollAnimation()
  const [projectsRef, projectsVisible] = useScrollAnimation()
  const [contactRef, contactVisible] = useScrollAnimation()

  return (
    <>
      {/* Pixel Background */}
      <PixelBackground />

      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-content">
          <a href="#" className="navbar-logo">{"< DaniDev />"}</a>
          <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#inicio" onClick={() => scrollToSection('inicio')}>[ Inicio ]</a></li>
            <li><a href="#sobre-mi" onClick={() => scrollToSection('sobre-mi')}>[ Sobre Mi ]</a></li>
            <li><a href="#habilidades" onClick={() => scrollToSection('habilidades')}>[ Skills ]</a></li>
            <li><a href="#proyectos" onClick={() => scrollToSection('proyectos')}>[ Proyectos ]</a></li>
            <li><a href="#contacto" onClick={() => scrollToSection('contacto')}>[ Contacto ]</a></li>
          </ul>
          <div className="navbar-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">DEVELOPER LVL 99</span>
            <h1 className="hero-title">
              Hola, soy<br />
              <span>Daniela Rodríguez</span>
            </h1>
            <p className="hero-description">
              <TypingText
                texts={[
                  "Full-Stack Developer",
                  "Mobile App Creator",
                  "UI/UX Enthusiast",
                  "Problem Solver"
                ]}
              />
            </p>
            <p className="hero-description">
              Desarrolladora apasionada por crear experiencias digitales únicas.
              Especializada en React, Flutter y tecnologías modernas.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => scrollToSection('proyectos')}>
                Ver Proyectos
              </button>
              <a href="/cv-daniela-rodriguez.pdf" download className="btn btn-download">
                {icons.download} CV
              </a>
              <a href="https://github.com/Danirodrigzz" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {icons.github} GitHub
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-avatar">
              <div className="hero-avatar-frame">
                <img
                  src="/avatar.png"
                  alt="Daniela Rodríguez - Developer"
                  className="hero-avatar-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre-mi" className="section" ref={aboutRef}>
        <div className="container about-content" style={{
          opacity: aboutVisible ? 1 : 0,
          transform: aboutVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease-out'
        }}>
          <div className="about-image">
            <div className="about-image-wrapper pixel-card pixel-card--lavender">
              <div className="about-image-content">
                <img src="/avatar.png" alt="Daniela" className="about-avatar-img" />
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">7+</div>
                <div className="stat-label">Tech</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">∞</div>
                <div className="stat-label">Passion</div>
              </div>
            </div>
          </div>
          <div className="about-text">
            <h2>Sobre Mi</h2>
            <p>
              Hola! Soy una desarrolladora full-stack venezolana con pasión
              por crear soluciones tecnológicas innovadoras y funcionales.
            </p>
            <p>
              Mi experiencia abarca desde sistemas administrativos hasta
              aplicaciones móviles interactivas. Me especializo en React,
              Flutter y tecnologías backend como Supabase.
            </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">{icons.check}</span>
                <span>Web Development</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">{icons.check}</span>
                <span>Mobile Apps</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">{icons.check}</span>
                <span>UI/UX Design</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">{icons.check}</span>
                <span>Databases</span>
              </div>
            </div>
            <div className="game-ui-bar">
              <div className="game-ui-bar-fill"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="habilidades" className="section" ref={skillsRef}>
        <div className="container" style={{
          opacity: skillsVisible ? 1 : 0,
          transform: skillsVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease-out'
        }}>
          <div className="section-header">
            <h2>Mis <span>Skills</span></h2>
            <p>Las herramientas que uso para crear proyectos increíbles</p>
          </div>
          <div className="skills-grid">
            {skillCategories.map((category, index) => (
              <div key={index} className="skill-category pixel-card">
                <h3>
                  <span className="skill-category-icon">{category.icon}</span>
                  {category.title}
                </h3>
                <div className="skills-list">
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="section" ref={projectsRef}>
        <div className="container" style={{
          opacity: projectsVisible ? 1 : 0,
          transform: projectsVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease-out'
        }}>
          <div className="section-header">
            <h2>Mis <span>Proyectos</span></h2>
            <p>Una selección de los proyectos en los que he trabajado</p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.id} className="project-card pixel-card">
                <div className="project-image">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="project-img-real" />
                  ) : (
                    <div className="project-image-content">{project.emoji}</div>
                  )}
                  <span className={`project-status ${project.status}`}>
                    {project.status === 'completed' ? 'DONE' : 'WIP'}
                  </span>
                </div>
                <div className="project-content">
                  <span className="project-type">{project.type}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="tech-tag">+{project.technologies.length - 4}</span>
                    )}
                  </div>
                  <div className="project-links">
                    {project.github !== '#' && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                        {icons.github} Code
                      </a>
                    )}
                    {project.demo !== '#' && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                        {icons.external} Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="section" ref={contactRef}>
        <div className="container contact-content" style={{
          opacity: contactVisible ? 1 : 0,
          transform: contactVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease-out'
        }}>
          <div className="contact-info">
            <h3>Conectemos!</h3>
            <p>
              Tienes un proyecto en mente? Estoy lista para nuevos
              desafíos y colaboraciones.
            </p>
            <div className="contact-links">
              <a href="mailto:natachaa0424@gmail.com" className="contact-link pixel-card pixel-card--coral">
                <span className="contact-link-icon">{icons.email}</span>
                <div className="contact-link-text">
                  <h4>Email</h4>
                  <span>natachaa0424@gmail.com</span>
                </div>
              </a>
              <a href="https://github.com/Danirodrigzz" target="_blank" rel="noopener noreferrer" className="contact-link pixel-card pixel-card--sage">
                <span className="contact-link-icon">{icons.github}</span>
                <div className="contact-link-text">
                  <h4>GitHub</h4>
                  <span>github.com/Danirodrigzz</span>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/daniela-rodr%C3%ADguez-61576231a/" target="_blank" rel="noopener noreferrer" className="contact-link pixel-card pixel-card--sand">
                <span className="contact-link-icon">{icons.linkedin}</span>
                <div className="contact-link-text">
                  <h4>LinkedIn</h4>
                  <span>linkedin.com/in/daniela-rodríguez</span>
                </div>
              </a>
            </div>
          </div>
          <div className="contact-cta pixel-card pixel-card--mint">
            <h3>Ready to start?</h3>
            <p>Descarga mi CV o envíame un mensaje</p>
            <div className="contact-buttons">
              <a href="/cv-daniela-rodriguez.pdf" download className="btn btn-download">
                {icons.download} Descargar CV
              </a>
              <a href="mailto:natachaa0424@gmail.com" className="btn btn-primary">
                {icons.email} Enviar Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p className="footer-text">
            © 2024 Daniela Rodríguez // Made with {"<3"}
          </p>
          <div className="footer-social">
            <a href="https://github.com/Danirodrigzz" target="_blank" rel="noopener noreferrer" className="social-link">
              {icons.github}
            </a>
            <a href="https://www.linkedin.com/in/daniela-rodríguez-61576231a" target="_blank" rel="noopener noreferrer" className="social-link">
              {icons.linkedin}
            </a>
            <a href="mailto:natachaa0424@gmail.com" className="social-link">
              {icons.email}
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
