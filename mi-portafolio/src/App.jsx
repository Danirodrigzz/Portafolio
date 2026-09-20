import { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import Lenis from 'lenis'
import './index.css'

// Logos reales por tecnología (SVG de simple-icons, importados como texto
// crudo — livianos, sin runtime extra) para las tarjetas del Stack.
import iconJavascript from 'simple-icons/icons/javascript.svg?raw'
import iconTypescript from 'simple-icons/icons/typescript.svg?raw'
import iconDart from 'simple-icons/icons/dart.svg?raw'
import iconPhp from 'simple-icons/icons/php.svg?raw'
import iconHtml5 from 'simple-icons/icons/html5.svg?raw'
import iconCss from 'simple-icons/icons/css.svg?raw'
import iconPostgresql from 'simple-icons/icons/postgresql.svg?raw'
import iconReact from 'simple-icons/icons/react.svg?raw'
import iconAngular from 'simple-icons/icons/angular.svg?raw'
import iconNextdotjs from 'simple-icons/icons/nextdotjs.svg?raw'
import iconVite from 'simple-icons/icons/vite.svg?raw'
import iconTailwindcss from 'simple-icons/icons/tailwindcss.svg?raw'
import iconBootstrap from 'simple-icons/icons/bootstrap.svg?raw'
import iconFramer from 'simple-icons/icons/framer.svg?raw'
import iconFlutter from 'simple-icons/icons/flutter.svg?raw'
import iconExpo from 'simple-icons/icons/expo.svg?raw'
import iconNodedotjs from 'simple-icons/icons/nodedotjs.svg?raw'
import iconSupabase from 'simple-icons/icons/supabase.svg?raw'
import iconGit from 'simple-icons/icons/git.svg?raw'
import iconGithub from 'simple-icons/icons/github.svg?raw'
import iconDocker from 'simple-icons/icons/docker.svg?raw'
import iconRailway from 'simple-icons/icons/railway.svg?raw'
import iconVercel from 'simple-icons/icons/vercel.svg?raw'
import iconFigma from 'simple-icons/icons/figma.svg?raw'
import iconPostman from 'simple-icons/icons/postman.svg?raw'

const TECH_ICONS = {
  javascript: iconJavascript,
  typescript: iconTypescript,
  dart: iconDart,
  php: iconPhp,
  html5: iconHtml5,
  css: iconCss,
  postgresql: iconPostgresql,
  react: iconReact,
  angular: iconAngular,
  nextdotjs: iconNextdotjs,
  vite: iconVite,
  tailwindcss: iconTailwindcss,
  bootstrap: iconBootstrap,
  framer: iconFramer,
  flutter: iconFlutter,
  expo: iconExpo,
  nodedotjs: iconNodedotjs,
  supabase: iconSupabase,
  git: iconGit,
  github: iconGithub,
  docker: iconDocker,
  railway: iconRailway,
  vercel: iconVercel,
  figma: iconFigma,
  postman: iconPostman
}

const quiet = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = () => window.matchMedia('(pointer: fine)').matches
const CV_FILE = '/Daniela_Rodriguez_CV.pdf'
const MAIL = 'natachaa0424@gmail.com'

// Velocidad de scroll compartida (px/frame, suavizada) — la actualiza el
// loop de <Grain> (que ya corre siempre) y la lee cada <LiquidImage> para
// la aberración cromática por velocidad, sin pasarla por props.
const scrollVelocityRef = { current: 0 }

/* ============================================================
   Contenido — igual al CV
   ============================================================ */

const SECTIONS = [
  { id: 'proyectos', es: 'Proyectos', en: 'Work' },
  { id: 'stack', es: 'Stack', en: 'Stack' },
  { id: 'trayectoria', es: 'Trayectoria', en: 'Experience' }
]

// El nav compacto solo muestra 2 de las 3 secciones — el resto vive en el
// menú de pantalla completa que abre el botón redondo de puntos.
const NAV_COMPACT_IDS = ['proyectos', 'trayectoria']

const STACK = [
  { n: '01', es: 'Lenguajes', en: 'Languages', items: [
    { name: 'JavaScript ES6+', icon: 'javascript' },
    { name: 'TypeScript', icon: 'typescript' },
    { name: 'Dart', icon: 'dart' },
    { name: 'PHP', icon: 'php' },
    { name: 'HTML5', icon: 'html5' },
    { name: 'CSS3', icon: 'css' },
    { name: 'SQL', icon: 'postgresql' }
  ] },
  { n: '02', es: 'Frontend', en: 'Frontend', items: [
    { name: 'React', icon: 'react' },
    { name: 'Angular', icon: 'angular' },
    { name: 'Next.js', icon: 'nextdotjs' },
    { name: 'Vite', icon: 'vite' },
    { name: 'Tailwind CSS', icon: 'tailwindcss' },
    { name: 'Bootstrap 5', icon: 'bootstrap' },
    { name: 'Framer Motion', icon: 'framer' }
  ] },
  { n: '03', es: 'Móvil', en: 'Mobile', items: [
    { name: 'Flutter', icon: 'flutter' },
    { name: 'Dart', icon: 'dart' },
    { name: 'React Native', icon: 'react' },
    { name: 'Expo', icon: 'expo' }
  ] },
  { n: '04', es: 'Backend y datos', en: 'Backend and data', items: [
    { name: 'Node.js', icon: 'nodedotjs' },
    { name: 'Supabase', icon: 'supabase' },
    { name: 'PostgreSQL', icon: 'postgresql' },
    { name: 'REST APIs', icon: null }
  ] },
  { n: '05', es: 'Pruebas', en: 'Testing', items: [
    { name: { es: 'Unitarias', en: 'Unit' }, icon: null },
    { name: { es: 'Widgets', en: 'Widget' }, icon: null },
    { name: { es: 'Integración', en: 'Integration' }, icon: null },
    { name: { es: 'End-to-end', en: 'End-to-end' }, icon: null }
  ] },
  { n: '06', es: 'Herramientas', en: 'Tooling', items: [
    { name: 'Git', icon: 'git' },
    { name: 'GitHub', icon: 'github' },
    { name: 'Docker', icon: 'docker' },
    { name: 'Railway', icon: 'railway' },
    { name: 'Vercel', icon: 'vercel' },
    { name: 'Figma', icon: 'figma' },
    { name: 'Postman', icon: 'postman' }
  ] }
]

const JOBS = [
  {
    org: 'Soluciones Financieras Chinchín',
    role: { es: 'Desarrolladora Frontend Jr.', en: 'Jr. Frontend Developer' },
    when: { es: 'Jun 2026 — Jul 2026', en: 'Jun 2026 — Jul 2026' },
    where: { es: 'El Rosal, Caracas · Presencial', en: 'El Rosal, Caracas · On-site' },
    tags: ['Flutter', 'Angular', 'Bootstrap 5', 'Testing E2E', 'Git'],
    points: {
      es: [
        ['Cuatro productos a la vez.', ' Frontend de la app móvil, el backoffice, la pasarela de pagos y el portal de documentación.'],
        ['Pruebas de verdad.', ' Pruebas unitarias, de widgets, de integración y end-to-end para estabilizar las apps.'],
        ['Angular al equipo.', ' Incorporé Angular y Bootstrap 5, abriendo una línea de trabajo que la empresa no tenía.']
      ],
      en: [
        ['Four products at once.', ' Frontend of the mobile app, the backoffice, the payment gateway and the docs portal.'],
        ['Real testing.', ' Unit, widget, integration and end-to-end tests to stabilise the apps.'],
        ['Angular to the team.', ' Brought Angular and Bootstrap 5 in, opening a line of work the company did not have.']
      ]
    }
  },
  {
    org: 'Lagro',
    role: { es: 'Desarrolladora Frontend', en: 'Frontend Developer' },
    when: { es: 'Mar 2026 — Abr 2026', en: 'Mar 2026 — Apr 2026' },
    where: { es: 'Santiago, Chile · Remoto', en: 'Santiago, Chile · Remote' },
    tags: ['Flutter', 'Dart', 'Offline-first', 'IA y voz'],
    points: {
      es: [
        ['App de gestión de planta.', ' App móvil en Flutter para supervisores y trabajadores.'],
        ['Funciona sin conexión.', ' Sincronización online/offline para zonas sin señal.'],
        ['Voz e IA.', ' Comandos de voz para registrar actividades en campo.']
      ],
      en: [
        ['Plant management app.', ' Flutter mobile app for supervisors and workers.'],
        ['Works with no connection.', ' Online/offline sync for areas without signal.'],
        ['Voice and AI.', ' Voice commands to log field activity.']
      ]
    }
  },
  {
    org: 'Morna Tech',
    role: { es: 'Desarrolladora Junior', en: 'Junior Developer' },
    when: { es: '2025 — 2026', en: '2025 — 2026' },
    where: { es: 'Los Dos Caminos, Miranda · Presencial', en: 'Los Dos Caminos, Miranda · On-site' },
    tags: ['React', 'Next.js', 'Flutter', 'Supabase'],
    points: {
      es: [
        ['MapHunter, de principio a fin.', ' Front-end completo de un juego de búsqueda del tesoro con QR y geolocalización.'],
        ['La web de la empresa.', ' Lideré el rediseño del sitio corporativo en Next.js.'],
        ['Web y móvil a la par.', ' Desarrollo multiplataforma con una experiencia consistente.']
      ],
      en: [
        ['MapHunter, end to end.', ' Full front-end for a QR and geolocation treasure-hunt game.'],
        ['The company website.', ' Tech-led the corporate site redesign in Next.js.'],
        ['Web and mobile together.', ' Cross-platform development with a consistent experience.']
      ]
    }
  }
]

const WORKS = [
  { id: 'directorio', cat: 'sistema', name: 'Directorio Interactivo 3D', kind: { es: 'Kiosco interactivo', en: 'Interactive kiosk' }, org: { es: 'Producto', en: 'Product' },
    desc: { es: 'Mapa 3D con trazado de rutas, directorio de tiendas, cartelera de cine y cartera de cupones.', en: '3D map with route drawing, a store directory, movie listings and a coupon wallet.' },
    tech: 'React · Three.js', img: '/directorio3d.jpg' },
  { id: 'lagro', cat: 'movil', name: 'Lagro', kind: { es: 'App móvil', en: 'Mobile app' }, org: { es: 'Cliente — Lagro', en: 'Client — Lagro' },
    desc: { es: 'Gestión digital de campo: registro de tratos y tarjas por voz, con sincronización en la nube.', en: 'Digital field management: voice-logged tasks and timesheets, synced to the cloud.' },
    tech: 'Flutter', img: '/lagro.jpeg' },
  { id: 'maphunter', cat: 'movil', name: 'MapHunter', kind: { es: 'App móvil', en: 'Mobile app' }, org: 'Morna Tech',
    desc: { es: 'Búsqueda del tesoro por QR: pistas, ranking en tiempo real y tienda de poderes.', en: 'QR treasure hunt: clues, live ranking and a power-up shop.' },
    tech: 'Flutter · Supabase', img: '/maphunter.jpg' },
  { id: 'landing', cat: 'web', name: 'MapHunter Landing', kind: { es: 'Landing page', en: 'Landing page' }, org: 'Morna Tech',
    desc: { es: 'Sitio oficial del juego: mecánicas, métricas y registro de jugadores.', en: 'The game’s official site: mechanics, metrics and sign-ups.' },
    tech: 'React · Framer Motion', img: '/landing.jpg', demo: 'https://www.maphunter.online/' },
  { id: 'morna', cat: 'web', name: 'Morna Tech', kind: { es: 'Sitio corporativo', en: 'Corporate site' }, org: 'Morna Tech',
    desc: { es: 'Rediseño de la plataforma corporativa, con foco en rendimiento y SEO.', en: 'Corporate platform redesign, focused on performance and SEO.' },
    tech: 'Next.js · React', img: '/morna.jpg', demo: 'https://mornatech-sitioweb.vercel.app/' },
  { id: 'venus', cat: 'web', name: 'Venus Elegant Spa', kind: { es: 'Web y panel', en: 'Web and admin' }, org: { es: 'Proyecto propio', en: 'Personal project' },
    desc: { es: 'Reservas para clientes y panel administrativo para servicios y citas.', en: 'Client bookings plus an admin panel for services and appointments.' },
    tech: 'React · Supabase', img: '/venus-spa.jpg', demo: 'https://venuselegantspa.com/', code: 'https://github.com/Danirodrigzz/Venus_Spa.git' },
  { id: 'pollita', cat: 'sistema', name: 'Pollita Millonaria', kind: { es: 'Sistema administrativo', en: 'Admin system' }, org: 'Morna Tech',
    desc: { es: 'Gestión de ventas de lotería con dashboard en tiempo real.', en: 'Lottery sales management with a real-time dashboard.' },
    tech: 'React · TypeScript', img: '/pollita.jpg' },
  { id: 'sos', cat: 'web', name: 'SOS Grúa', kind: { es: 'Plataforma web', en: 'Web platform' }, org: { es: 'Cliente', en: 'Client' },
    desc: { es: 'Grúas con geolocalización, WhatsApp y pasarela de pagos.', en: 'Towing with geolocation, WhatsApp and a payment gateway.' },
    tech: 'HTML5 · PHP', img: '/project-sos-grua.jpg', demo: 'https://sos-grua.vercel.app', code: 'https://github.com/Danirodrigzz/SOS_GRUA.git' },
  { id: 'turismo', cat: 'web', name: 'Turismo Sensorial', kind: { es: 'Web app', en: 'Web app' }, org: { es: 'Proyecto propio', en: 'Personal project' },
    desc: { es: 'Turismo accesible con recorridos para vivirse con todos los sentidos.', en: 'Accessible tourism, routes lived through every sense.' },
    tech: 'React · Supabase', img: '/project-turismo.jpg', demo: 'https://turismo-sensorial.vercel.app', code: 'https://github.com/Danirodrigzz/Turismo_sensorial.git' }
]

const CATS = ['web', 'movil', 'sistema']

function chunk(arr, size) {
  const rows = []
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size))
  return rows
}

// z: profundidad de reposo de cada panel de vidrio (luz fija arriba
// izquierda — el más cercano a la cámara casi no tiene desenfoque; el
// más al fondo queda tenue y con más blur EN REPOSO, no solo al entrar
// — restBlur/restOpacity son justamente eso, para que el hover tenga
// algo real de que "enfocarse": sin esto, un panel que ya está nítido
// no se nota que se aclara al pasarle el cursor por encima).
const SEALED = [
  { name: { es: 'App móvil', en: 'Mobile app' }, tech: 'Flutter', depth: 1.6, z: 40, shadowY: 4, restBlur: 0, restOpacity: 1, pos: { left: '34%', top: '10%' } },
  { name: 'BackOffice', tech: 'Angular', depth: 1.1, z: 5, shadowY: 8, restBlur: 1, restOpacity: 0.92, pos: { left: '66%', top: '24%' } },
  { name: 'Payment Gateway', tech: 'Angular', depth: 1.3, z: -40, shadowY: 12, restBlur: 3, restOpacity: 0.72, pos: { left: '40%', top: '58%' } },
  { name: { es: 'Documentación de API', en: 'API documentation' }, tech: 'Angular', depth: 0.8, z: -80, shadowY: 16, restBlur: 5, restOpacity: 0.55, pos: { left: '72%', top: '72%' } }
]

const copy = {
  es: {
    top: { cv: 'CV ↓', role: 'Desarrolladora Full Stack' },
    landing: { cta: 'Ver Proyectos' },
    directorio: {
      title: 'Directorio Interactivo 3D',
      desc: 'Producto: kiosco interactivo para centro comercial, con mapa 3D, trazado de rutas, directorio de tiendas, cartelera de cine y cartera de cupones.'
    },
    lagro: {
      title: 'Lagro',
      desc: 'Trabajo remoto para Lagro: una app de gestión digital de campo que reemplaza las tarjas de papel de huertos y viñedos. Su función estrella es el registro por voz — el supervisor cuenta la labor del día (cuartel, variedad, precio, trabajadores y cantidades) como si hablara con un colega, y la app arma la tarja automáticamente, lista para revisar y confirmar. Funciona sin señal en el mismo potrero y sincroniza sola apenas vuelve la conexión, con cuentas y roles separados para supervisores, contratistas y personal administrativo.'
    },
    stack: {
      title: <>Herramientas que <em>ya probé</em> en producción</>,
      lede: 'Todo lo que está en esta lista lo usé en un proyecto real, no en un tutorial.'
    },
    trayectoria: {
      title: <>Dónde he <em>trabajado</em></>,
      lede: 'Tres equipos, dos países y una constante: entregar cosas que funcionan.'
    },
    proyectos: {
      title: <>Proyectos</>,
      filters: { all: 'Todos', web: 'Web', movil: 'Móvil', sistema: 'Sistema' },
      code: 'Código ↗',
      demo: 'Visitar ↗',
      sealed: 'Interno · sin demo pública',
      sealedTitle: 'Trabajo interno',
      sealedNote: 'Mi rol más reciente, en Soluciones Financieras Chinchín: cuatro productos en simultáneo, de la app móvil a la documentación de la API.',
      hint: 'Ver'
    },
    foot: { text: '© 2025 Daniela Rodríguez' }
  },
  en: {
    top: { cv: 'CV ↓', role: 'Full Stack Developer' },
    landing: { cta: 'See Projects' },
    directorio: {
      title: 'Interactive 3D Directory',
      desc: 'Product: an interactive kiosk for shopping malls, with a 3D map, route drawing, a store directory, movie listings and a coupon wallet.'
    },
    lagro: {
      title: 'Lagro',
      desc: 'Remote work for Lagro: a digital field-management app that replaces paper logs for orchards and vineyards. Its standout feature is voice entry — the supervisor describes the day’s work (plot, variety, price, workers and quantities) like talking to a colleague, and the app builds the record automatically, ready to review and confirm. It works offline right in the field and syncs on its own once connection returns, with separate accounts and roles for supervisors, contractors and office staff.'
    },
    stack: {
      title: <>Tools I have <em>already shipped</em> with</>,
      lede: 'Everything on this list was used on a real project, not a tutorial.'
    },
    trayectoria: {
      title: <>Where I have <em>worked</em></>,
      lede: 'Three teams, two countries and one constant: shipping things that work.'
    },
    proyectos: {
      title: <>Projects</>,
      filters: { all: 'All', web: 'Web', movil: 'Mobile', sistema: 'System' },
      code: 'Code ↗',
      demo: 'Visit ↗',
      sealed: 'Internal · no public demo',
      sealedTitle: 'Internal work',
      sealedNote: 'My most recent role, at Soluciones Financieras Chinchín: four products at once, from the mobile app to the API docs.',
      hint: 'View'
    },
    foot: { text: '© 2025 Daniela Rodríguez' }
  }
}

/* ============================================================
   Hooks y piezas compartidas
   ============================================================ */

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (quiet()) {
      el.classList.add('seen')
      return
    }

    let io
    let raf
    let done = false

    // Revela cuando el borde superior ya entró (o pasó) el 92% del alto de
    // ventana. Se usa como comprobación directa además del observer para
    // que ningún elemento se quede en opacity:0 ocupando espacio si el
    // IntersectionObserver no dispara a tiempo (scroll rápido con Lenis,
    // elementos más altos que el viewport, cambio de pestaña, resize...).
    const check = () => {
      if (done) return false
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        done = true
        el.classList.add('seen')
        if (io) io.disconnect()
        window.removeEventListener('scroll', check)
        window.removeEventListener('resize', check)
        return true
      }
      return false
    }

    raf = requestAnimationFrame(() => {
      if (check()) return
      io = new IntersectionObserver(
        (entries) => { if (entries.some((e) => e.isIntersecting)) check() },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' }
      )
      io.observe(el)
      window.addEventListener('scroll', check, { passive: true })
      window.addEventListener('resize', check)
    })

    return () => {
      cancelAnimationFrame(raf)
      if (io) io.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])
  return ref
}

const Rise = forwardRef(function Rise({ children, className = '', delay = 0, tag = 'div', style: styleProp, ...rest }, outerRef) {
  const innerRef = useReveal()
  useEffect(() => {
    const node = innerRef.current
    if (typeof outerRef === 'function') outerRef(node)
    else if (outerRef) outerRef.current = node
  }, [innerRef, outerRef])
  const cls = `rise${className ? ' ' + className : ''}`
  const style = { '--d': `${delay}ms`, ...styleProp }
  if (tag === 'p') return <p ref={innerRef} className={cls} style={style} {...rest}>{children}</p>
  return <div ref={innerRef} className={cls} style={style} {...rest}>{children}</div>
})

function Lines({ children, className = '', delay = 0, step = 90, tag = 'h1' }) {
  const ref = useReveal()
  const rows = Array.isArray(children) ? children : [children]
  const content = rows.map((row, i) => (
    <span className="line" key={i}><i style={{ '--d': `${delay + i * step}ms` }}>{row}</i></span>
  ))
  if (tag === 'h1') return <h1 ref={ref} className={`lines ${className}`}>{content}</h1>
  return <h2 ref={ref} className={`lines ${className}`}>{content}</h2>
}

/* ============================================================
   Cursor propio
   ============================================================ */

function Cursor() {
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!fine() || quiet()) return undefined
    document.body.classList.add('cursor-ready')

    const pos = { x: -100, y: -100 }
    const cur = { x: -100, y: -100 }
    const onMove = (e) => { pos.x = e.clientX; pos.y = e.clientY }
    window.addEventListener('pointermove', onMove)

    let target = null
    const onOver = (e) => {
      const el = e.target.closest('[data-cursor], [data-cursor-shape]')
      target = el || null
      const dot = dotRef.current
      const label = labelRef.current
      if (!dot || !label) return
      if (target) {
        // Sobre los links del nav el cursor se estira a pastilla en vez
        // de agrandarse en círculo — sobre todo lo demás sigue siendo
        // el círculo grande de siempre.
        const isPill = target.getAttribute('data-cursor-shape') === 'pill'
        dot.classList.toggle('pill', isPill)
        dot.classList.toggle('big', !isPill)
        const text = target.getAttribute('data-cursor')
        if (text) {
          label.textContent = text
          label.classList.add('on')
        } else {
          label.classList.remove('on')
        }
      } else {
        dot.classList.remove('big', 'pill')
        label.classList.remove('on')
      }
    }
    document.addEventListener('pointerover', onOver)

    let raf = 0
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.18
      cur.y += (pos.y - cur.y) * 0.18
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${cur.x + 18}px, ${cur.y + 18}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.body.classList.remove('cursor-ready')
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={dotRef} aria-hidden="true" />
      <div className="cursor-label" ref={labelRef} aria-hidden="true" />
    </>
  )
}

/* ============================================================
   Textura retro — grano de película sobre toda la pantalla
   ============================================================ */

function Grain() {
  const grainRef = useRef(null)

  // Velocidad de scroll (siempre activo, con o sin mouse fino): alimenta
  // scrollVelocityRef, que cada LiquidImage lee para su aberración
  // cromática por velocidad. Corre solo, sin depender del parallax de abajo.
  useEffect(() => {
    if (quiet()) return undefined
    let lastY = window.scrollY
    let raf = 0
    const loop = () => {
      const y = window.scrollY
      const rawVel = y - lastY
      lastY = y
      scrollVelocityRef.current += (rawVel - scrollVelocityRef.current) * 0.15
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // "Seguimiento de cámara": el grano flota sobre toda la página y se
  // desplaza (con inercia) en sentido contrario al puntero, como si una
  // cámara reaccionara al movimiento del mouse.
  useEffect(() => {
    if (!fine() || quiet()) return undefined
    const pos = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e) => {
      pos.x = (e.clientX / window.innerWidth) * 2 - 1
      pos.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.05
      cur.y += (pos.y - cur.y) * 0.05
      if (grainRef.current) grainRef.current.style.transform = `translate3d(${(-cur.x * 22).toFixed(2)}px, ${(-cur.y * 22).toFixed(2)}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <>
      <div className="grain" ref={grainRef} aria-hidden="true" />
      {/* Filtro SVG que ondula el texto grande (título de portada y de
          Proyectos) para que el "efecto agua" no sea solo de las imágenes. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="water-text">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="7" result="noise">
            <animate attributeName="baseFrequency" dur="14s" values="0.008 0.03;0.012 0.018;0.006 0.035;0.008 0.03" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  )
}

/* ============================================================
   Distorsión líquida + "page curl" — shader WebGL real por imagen
   ============================================================ */

const LIQUID_VERT = `
  uniform float uProgress;
  uniform float uBendRadius;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFoldAmount;

  void main() {
    vUv = uv;

    // Page curl clásico: bisagra en la esquina inferior-derecha, línea de
    // pliegue diagonal (no un doblez recto de borde a borde). Cada vértice
    // se ubica según su distancia a esa diagonal; lo que quedó "detrás" de
    // la línea de pliegue se enrolla sobre un cilindro de radio uBendRadius.
    vec2 corner = vec2(1.0, -1.0);
    vec2 opposite = vec2(-1.0, 1.0);
    vec2 u = normalize(opposite - corner);
    vec2 v = vec2(-u.y, u.x);

    vec2 rel = position.xy - corner;
    float diag = dot(rel, u);
    float perp = dot(rel, v);

    float maxDiag = length(opposite - corner);
    float foldDist = maxDiag * (1.0 - uProgress);
    float distPast = diag - foldDist;

    vec3 newPos;
    vec3 normal;
    float theta = 0.0;

    if (distPast <= 0.0) {
      newPos = vec3(position.xy, 0.0);
      normal = vec3(0.0, 0.0, 1.0);
    } else {
      theta = distPast / uBendRadius;
      float newDiag = foldDist + uBendRadius * sin(theta);
      float newZ = -uBendRadius * (1.0 - cos(theta));
      vec2 xy = corner + newDiag * u + perp * v;
      newPos = vec3(xy, newZ);

      vec3 tangentU = normalize(vec3(cos(theta) * u, -sin(theta)));
      vec3 tangentV = vec3(v, 0.0);
      normal = normalize(cross(tangentU, tangentV));
    }

    vNormal = normal;
    vFoldAmount = clamp(theta / 3.14159, 0.0, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`

const LIQUID_FRAG = `
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uPlaneAspect;
  uniform float uImgAspect;
  uniform float uVelocity;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFoldAmount;

  vec2 coverUv(vec2 uv) {
    vec2 scale = vec2(1.0);
    if (uPlaneAspect > uImgAspect) {
      scale.y = uImgAspect / uPlaneAspect;
    } else {
      scale.x = uPlaneAspect / uImgAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    float dist = distance(vUv, uMouse);
    float wave = sin(dist * 16.0 - uTime * 2.6) * 0.5 + 0.5;
    float falloff = smoothstep(0.4, 0.0, dist);
    vec2 dir = normalize(vUv - uMouse + 0.0001);
    // Máscara de borde: la onda se desvanece junto a los cuatro lados para
    // que la distorsión nunca arrastre la imagen fuera del marco.
    vec2 edge = smoothstep(vec2(0.0), vec2(0.14), vUv) * smoothstep(vec2(0.0), vec2(0.14), 1.0 - vUv);
    vec2 warp = dir * wave * falloff * uHover * edge.x * edge.y;
    uv += warp * 0.05;

    // Aberración cromática de agua (hover) + aberración por velocidad de
    // scroll (uVelocity, en la dirección vertical del scroll) — dos fuentes
    // del mismo desplazamiento de canales, combinadas en un solo offset.
    vec2 velOffset = vec2(0.0, clamp(uVelocity * 0.0005, -0.012, 0.012));
    vec2 chroma = warp * 0.09 + velOffset;
    vec2 rUv = clamp(uv + chroma, 0.0, 1.0);
    vec2 bUv = clamp(uv - chroma, 0.0, 1.0);
    vec2 gUv = clamp(uv, 0.0, 1.0);

    float r = min(texture2D(uTex, rUv).r * 1.35, 1.0);
    float g = texture2D(uTex, gUv).g;
    float b = min(texture2D(uTex, bUv).b * 1.35, 1.0);
    float a = texture2D(uTex, gUv).a;

    // Sombreado del pliegue: la cara interna del curl se oscurece según su
    // ángulo (vFoldAmount) y hay un realce especular en la cresta, donde la
    // normal curvada mira más hacia la luz — así se lee como volumen real,
    // no una textura plana rotando.
    vec3 lightDir = normalize(vec3(0.35, 0.5, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float spec = pow(max(dot(vNormal, halfVec), 0.0), 20.0);
    float foldDark = mix(1.0, 0.22, vFoldAmount);
    // mix() con vFoldAmount: en la parte plana (vFoldAmount = 0) el
    // shading queda exactamente en 1.0 y el specular en 0 — la imagen se
    // ve idéntica a como era antes. Solo la parte que de verdad se curva
    // se oscurece y brilla.
    float shadeMul = mix(1.0, foldDark * (0.55 + diffuse * 0.55), vFoldAmount);
    vec3 shaded = vec3(r, g, b) * shadeMul + vec3(spec * 0.85 * vFoldAmount);

    // Cerca del final del curl (uProgress ~1) el rollo puede dar más de una
    // vuelta sobre sí mismo; se desvanece antes de que eso se note.
    float endFade = 1.0 - smoothstep(0.78, 0.98, uProgress);

    gl_FragColor = vec4(shaded, a * endFade);
  }
`

function LiquidImage({ src, alt, foldRef, cursorLabel = 'Ver' }) {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined
    let cancelled = false
    let cleanup = null
    let started = false

    // Antes esto arrancaba apenas el componente se montaba, sin
    // importar si estaba a la vista — con hasta ~18 tarjetas (Proyectos
    // + Mosaico) montadas de una, eso era 18 contextos WebGL y 18
    // descargas de imagen compitiendo por red/GPU desde el primer
    // frame, aunque casi ninguna se viera todavía. Ahora la carga
    // pesada (three.js, el contexto, la textura) no arranca hasta que
    // la tarjeta está a punto de entrar en pantalla (rootMargin la
    // adelanta un poco para que no haga pop-in visible al hacer scroll).
    const setup = () => {
      if (started) return
      started = true

      import('three').then((THREE) => {
      if (cancelled) return

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
      } catch {
        return
      }

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
      camera.position.z = 1

      // Con hasta 7 de estos a la vez, 2x DPR en cada uno es carísimo —
      // 1.5 ya se ve nítido para el tamaño real de estas tarjetas.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      renderer.setPixelRatio(dpr)
      mount.appendChild(renderer.domElement)

      const loader = new THREE.TextureLoader()
      const uniforms = {
        uTex: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uPlaneAspect: { value: 1 },
        uImgAspect: { value: 1 },
        uVelocity: { value: 0 },
        uProgress: { value: 0 },
        uBendRadius: { value: 0.85 }
      }

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: LIQUID_VERT,
        fragmentShader: LIQUID_FRAG,
        transparent: true
      })
      // 24x24 segmentos: suficiente para que el curl se vea curvo y no en
      // bisagra recta, sin pagar el costo de 40x40 en las 7 tarjetas a
      // la vez.
      const geometry = new THREE.PlaneGeometry(2, 2, 24, 24)
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      loader.load(
        src,
        (tex) => {
          if (cancelled) return
          tex.colorSpace = THREE.SRGBColorSpace
          uniforms.uTex.value = tex
          uniforms.uImgAspect.value = tex.image.width / tex.image.height
          setReady(true)
        },
        undefined,
        // Antes esto solo hacía console.warn: la textura de WebGL nunca
        // llegaba, "ready" se quedaba en false para siempre, y quedábamos
        // a merced de que el <img> de respaldo (una petición de red
        // aparte, a la misma URL) tuviera mejor suerte — si esa también
        // fallaba, no había ningún aviso visible. Ahora marca imgFailed
        // directamente, así el relleno neutro aparece siempre que la
        // imagen de verdad no se puede cargar, sin depender de esa
        // segunda petición.
        () => { if (!cancelled) setImgFailed(true) }
      )

      const resize = () => {
        const w = mount.clientWidth
        const h = mount.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        uniforms.uPlaneAspect.value = w / h
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(mount)

      // El agua nunca descansa del todo: hay un nivel base siempre activo
      // (ondas + aberración cromática tenues, animando con uTime) y el
      // hover solo lo intensifica, en vez de encender/apagar el efecto.
      const BASE_RIPPLE = 0.35
      let hoverTarget = BASE_RIPPLE
      uniforms.uHover.value = BASE_RIPPLE
      const onMove = (e) => {
        const r = mount.getBoundingClientRect()
        uniforms.uMouse.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
      }
      const onEnter = () => { hoverTarget = 1 }
      const onLeave = () => { hoverTarget = BASE_RIPPLE }
      mount.addEventListener('pointermove', onMove)
      mount.addEventListener('pointerenter', onEnter)
      mount.addEventListener('pointerleave', onLeave)

      let raf = 0
      let running = false
      let foldCurrent = 0
      const reduced = quiet()
      const renderFrame = (t) => {
        // Sin textura todavía (cargando o si falló) no se renderiza nada —
        // el canvas es transparente (alpha:true) y deja ver el <img> de
        // respaldo debajo, en vez de tapar todo con el blanco por defecto
        // que WebGL usa para un sampler2D sin textura asignada.
        if (!uniforms.uTex.value) return
        uniforms.uTime.value = t * 0.001
        uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.08
        // Inercia del curl: nunca saltamos directo al valor de scroll —
        // cada fotograma nos acercamos un 7% a la meta, así el pliegue
        // se ve fluido en vez de saltar entre estados.
        const foldTarget = foldRef ? foldRef.current : 0
        foldCurrent += (foldTarget - foldCurrent) * 0.07
        uniforms.uProgress.value = foldCurrent
        uniforms.uVelocity.value = scrollVelocityRef.current
        renderer.render(scene, camera)
      }

      // Con hasta 7 de estos WebGLRenderer montados a la vez (una fila de
      // proyectos), renderizar los que quedaron fuera de pantalla (scrolleó
      // a Perfil, Stack, etc.) es trabajo tirado — de ahí venía buena parte
      // de la lentitud. Se pausa/reanuda por IntersectionObserver, igual
      // que hacía la escena 3D del hero antes de quitarla.
      const tick = (t) => { if (running) { renderFrame(t); raf = requestAnimationFrame(tick) } }
      const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick) } }
      const stop = () => { running = false; cancelAnimationFrame(raf) }

      let io, onVis
      if (reduced) {
        renderFrame(0)
      } else {
        io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 })
        io.observe(mount)
        onVis = () => { if (document.hidden) stop(); else if (mount.getBoundingClientRect().bottom > 0) start() }
        document.addEventListener('visibilitychange', onVis)
      }

      cleanup = () => {
        stop()
        if (io) io.disconnect()
        if (onVis) document.removeEventListener('visibilitychange', onVis)
        ro.disconnect()
        mount.removeEventListener('pointermove', onMove)
        mount.removeEventListener('pointerenter', onEnter)
        mount.removeEventListener('pointerleave', onLeave)
        geometry.dispose()
        material.dispose()
        if (uniforms.uTex.value) uniforms.uTex.value.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      }
      })
    }

    const reducedMotion = quiet()
    let gateIO
    if (reducedMotion) {
      setup()
    } else {
      gateIO = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setup(); gateIO.disconnect() } },
        { rootMargin: '600px 0px' }
      )
      gateIO.observe(mount)
    }

    return () => {
      cancelled = true
      if (gateIO) gateIO.disconnect()
      if (cleanup) cleanup()
    }
  }, [src])

  return (
    <div className="work-media" ref={mountRef} data-cursor={cursorLabel || undefined}>
      {!ready && (
        <div className="work-media-fallback">
          {imgFailed
            ? <div className="work-media-error" aria-hidden="true" />
            : (
              <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onError={() => setImgFailed(true)}
                onLoad={(e) => { if (e.currentTarget.naturalWidth === 0) setImgFailed(true) }}
              />
            )}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Piezas de sección
   ============================================================ */

function BandHead({ eyebrow, title, lede, num, center }) {
  return (
    <div className={`band-head${center ? ' center' : ''}`}>
      <div>
        {eyebrow && <Rise><span className="eyebrow">{eyebrow}</span></Rise>}
        <Lines delay={80} tag="h2" className="title">{title}</Lines>
        {lede && <Rise delay={160}><p className="lede">{lede}</p></Rise>}
      </div>
      {num && <Rise delay={200} className="num">{num}</Rise>}
    </div>
  )
}

/* ============================================================
   Stack como pila de vidrio en 3D real (perspective + preserve-3d,
   sin WebGL): las 6 categorías son placas translúcidas apiladas en
   profundidad — literal al nombre de la sección. Cámara con paralaje
   suave al mover el mouse, entrada con stagger + rebote al entrar en
   pantalla, y cada categoría muestra el logo real de cada tecnología
   (mismo lenguaje visual del mosaico: fichas blancas sobre fondo
   oscuro, como juntas de baldosas). Estático bajo
   prefers-reduced-motion.
   ============================================================ */

const TOOLS_LAYER_GAP = 54

// Equivalente en JS de cubic-bezier(.34,1.56,.64,1): el "easeOutBack"
// clásico, con el mismo overshoot que un rebote real.
function easeOutBack(p) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2)
}

function ToolsStack({ lang }) {
  const stageRef = useRef(null)
  const camRef = useRef(null)
  const layerRefs = useRef([])

  const activeRef = useRef(STACK.length - 1)
  const slotsRef = useRef(STACK.map((_, i) => STACK.length - 1 - i))
  const drag = useRef({ index: -1, active: false, startX: 0, dx: 0, releasing: false })

  useEffect(() => {
    const stage = stageRef.current
    const cam = camRef.current
    if (!stage || !cam) return undefined
    const reduced = quiet()
    const N = STACK.length
    const BASE_RX = 52
    const BASE_RZ = -32
    const DRAG_THRESHOLD = 90

    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const entrance = STACK.map(() => ({ v: reduced ? 1 : 0, start: 0 }))
    let entered = reduced

    const onMove = (e) => {
      const r = stage.getBoundingClientRect()
      parallax.targetX = ((e.clientX - r.left) / r.width) * 2 - 1
      parallax.targetY = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    const onLeave = () => { parallax.targetX = 0; parallax.targetY = 0 }
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)

    // ---- Arrastre: tomar una tarjeta y correrla al costado cambia la
    // activa, en vez de hacer clic o usar flechas. ----
    const dragHandlers = []
    if (!reduced) {
      layerRefs.current.forEach((el, i) => {
        if (!el) return
        const onDown = (e) => {
          drag.current = { index: i, active: true, startX: e.clientX, dx: 0, releasing: false }
          el.setPointerCapture(e.pointerId)
        }
        const onDragMove = (e) => {
          if (!drag.current.active || drag.current.index !== i) return
          drag.current.dx = e.clientX - drag.current.startX
        }
        const onUp = () => {
          if (!drag.current.active || drag.current.index !== i) return
          const dx = drag.current.dx
          drag.current.active = false
          drag.current.releasing = true
          if (dx < -DRAG_THRESHOLD) activeRef.current = (activeRef.current + 1) % N
          else if (dx > DRAG_THRESHOLD) activeRef.current = (activeRef.current - 1 + N) % N
        }
        el.addEventListener('pointerdown', onDown)
        el.addEventListener('pointermove', onDragMove)
        el.addEventListener('pointerup', onUp)
        el.addEventListener('pointercancel', onUp)
        dragHandlers[i] = { onDown, onDragMove, onUp }
      })
    }

    const triggerEntrance = () => {
      if (entered) return
      entered = true
      STACK.forEach((_, i) => {
        window.setTimeout(() => { entrance[i].start = performance.now() }, i * 70)
      })
    }

    let raf = 0
    let running = false
    const frame = (t) => {
      if (!reduced) {
        parallax.x += (parallax.targetX - parallax.x) * 0.06
        parallax.y += (parallax.targetY - parallax.y) * 0.06
        cam.style.transform = `rotateX(${(BASE_RX + parallax.y * 10).toFixed(2)}deg) rotateZ(${(BASE_RZ + parallax.x * 14).toFixed(2)}deg)`
      }

      if (drag.current.releasing && !drag.current.active) {
        drag.current.dx *= 0.85
        if (Math.abs(drag.current.dx) < 0.5) { drag.current.releasing = false; drag.current.index = -1; drag.current.dx = 0 }
      }

      STACK.forEach((row, i) => {
        const el = layerRefs.current[i]
        if (!el) return
        if (!reduced && entrance[i].start) {
          const p = Math.min(1, (t - entrance[i].start) / 700)
          entrance[i].v = easeOutBack(p)
        }
        const ent = entrance[i].v

        // Cada tarjeta persigue su "slot" objetivo (0 = al frente) — al
        // cambiar la activa, la que estaba adelante recorre TODOS los
        // slots intermedios de una, deslizándose hacia el costado y
        // hacia atrás a la vez; las demás solo se corren un lugar.
        const target = reduced ? N - 1 - i : (activeRef.current - i + N) % N
        slotsRef.current[i] += (target - slotsRef.current[i]) * (reduced ? 1 : 0.1)
        const slot = slotsRef.current[i]

        const dragX = (drag.current.index === i && (drag.current.active || drag.current.releasing)) ? drag.current.dx : 0

        const z = (N - 1 - slot) * TOOLS_LAYER_GAP * ent
        const x = slot * 14 * ent + dragX
        const rot = slot * 1.6 * ent + dragX * 0.045
        const op = Math.max(0.3, 1 - slot * 0.12) * ent

        el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateZ(${rot.toFixed(2)}deg)`
        el.style.opacity = op.toFixed(3)
      })
    }

    const tick = (t) => { if (running) { frame(t); raf = requestAnimationFrame(tick) } }
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    let io
    if (reduced) {
      frame(0)
    } else {
      io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { triggerEntrance(); start() } else stop()
      }, { threshold: 0.2 })
      io.observe(stage)
    }

    return () => {
      stop()
      if (io) io.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      layerRefs.current.forEach((el, i) => {
        if (!el || !dragHandlers[i]) return
        el.removeEventListener('pointerdown', dragHandlers[i].onDown)
        el.removeEventListener('pointermove', dragHandlers[i].onDragMove)
        el.removeEventListener('pointerup', dragHandlers[i].onUp)
        el.removeEventListener('pointercancel', dragHandlers[i].onUp)
      })
    }
  }, [lang])

  return (
    <div className="tools-stack-stage" ref={stageRef}>
      <div className="tools-stack-cam" ref={camRef}>
        {STACK.map((row, i) => (
          <div
            className="tools-layer"
            key={row.n}
            ref={(el) => { layerRefs.current[i] = el }}
          >
            <div className="tools-layer-head">
              <span className="tools-layer-n">{row.n}</span>
              <h3 className="tools-layer-name">{row[lang]}</h3>
            </div>
            <div className="tools-layer-chips">
              {row.items.map((item) => {
                const name = typeof item.name === 'string' ? item.name : item.name[lang]
                return (
                  <span className="tools-chip" key={name} title={name}>
                    {item.icon && TECH_ICONS[item.icon] && (
                      <span className="tools-chip-icon" dangerouslySetInnerHTML={{ __html: TECH_ICONS[item.icon] }} />
                    )}
                    <span className="tools-chip-name">{name}</span>
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function JobItem({ job, lang }) {
  // El punto activo (hover en la lista numerada) enciende su faceta
  // "protagonista" del fondo de cristales — el fondo narra en qué parte
  // de la historia estás, en vez de ser una decoración estática.
  const [active, setActive] = useState(0)
  const points = job.points[lang]

  return (
    <Rise tag="div" className="job">
      <div className="job-glass-bg" aria-hidden="true">
        {points.map((_, i) => (
          <div key={i} className={`job-facet job-facet-${i}${active === i ? ' is-active' : ''}`} />
        ))}
      </div>
      <div className="job-grid">
        <div className="job-meta">
          <div className="job-when">{job.when[lang]}</div>
          <div className="job-where">{job.where[lang]}</div>
        </div>
        <div className="job-main">
          <h3 className="job-org">{job.org}</h3>
          <p className="job-role">{job.role[lang]}</p>
          <ul className="job-list">
            <span className="job-line" aria-hidden="true"><span className="job-line-fill" /></span>
            {points.map(([strong, rest], i) => (
              <li
                key={strong}
                className={active === i ? 'is-active' : ''}
                onPointerEnter={() => setActive(i)}
              >
                <i>{String(i + 1).padStart(2, '0')}</i>
                <span><b>{strong}</b>{rest}</span>
              </li>
            ))}
          </ul>
          <div className="tags">{job.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        </div>
      </div>
    </Rise>
  )
}

function WorkCard({ w, lang, t, delay, accent, foldRef }) {
  const name = typeof w.name === 'string' ? w.name : w.name[lang]
  const org = typeof w.org === 'string' ? w.org : w.org[lang]
  const link = w.demo || w.code
  const Wrap = link ? 'a' : 'div'
  const wrapProps = link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <Rise className="work-card" delay={delay}>
      <Wrap className="work-card-inner" {...wrapProps}>
        <LiquidImage src={w.img} alt={name} foldRef={foldRef} />
        <div className="work-card-rule" aria-hidden="true" />
        <div className="work-card-top">
          <div>
            <h3 className="work-card-name">{name}</h3>
            <p className="work-card-kind">{w.kind[lang]} — {org}</p>
          </div>
          {link
            ? <span className={`work-card-go ${accent}`} data-cursor={t.hint} aria-hidden="true">↘</span>
            : <span className="work-card-go work-card-go-off" aria-hidden="true">–</span>}
        </div>
      </Wrap>
    </Rise>
  )
}

function SealedOrbit({ lang }) {
  const stageRef = useRef(null)
  const bgRef = useRef(null)
  const camRef = useRef(null)
  const hubRef = useRef(null)
  const nodeRefs = useRef([])
  const innerRefs = useRef([])
  const lineRefs = useRef([])

  useEffect(() => {
    const stage = stageRef.current
    const bg = bgRef.current
    const cam = camRef.current
    const hub = hubRef.current
    if (!stage || !bg || !cam || !hub) return undefined
    const reduced = quiet()
    const nodes = nodeRefs.current
    const inners = innerRefs.current
    const lines = lineRefs.current

    // El hilo SVG que une el bloque de rol con cada panel se recalcula
    // desde la posición real en pantalla (getBoundingClientRect), así
    // no hace falta reproducir a mano la proyección 3D del perspective.
    const updateLines = () => {
      const stageBox = stage.getBoundingClientRect()
      const hubBox = hub.getBoundingClientRect()
      const hx = hubBox.right - stageBox.left
      const hy = hubBox.top + hubBox.height / 2 - stageBox.top
      nodes.forEach((n, i) => {
        const line = lines[i]
        if (!n || !line) return
        const box = n.getBoundingClientRect()
        const nx = box.left + box.width / 2 - stageBox.left
        const ny = box.top + box.height / 2 - stageBox.top
        line.setAttribute('x1', hx.toFixed(1))
        line.setAttribute('y1', hy.toFixed(1))
        line.setAttribute('x2', nx.toFixed(1))
        line.setAttribute('y2', ny.toFixed(1))
      })
    }

    // ---- Hover: el panel tocado se adelanta hacia la cámara, su vidrio
    // se aclara, y su hilo se ilumina; los demás retroceden y se
    // difuminan un poco más.
    // OJO: esto NO usa pointerenter/pointerleave en cada tarjeta. Con
    // varias tarjetas superpuestas en 3D (preserve-3d) y desplazándose
    // por el paralaje, la que está más "adelante" (translateZ mayor)
    // puede tapar el hit-test de la que el cursor cree estar tocando —
    // por eso Payment Gateway y Documentación de API (las más al fondo)
    // casi nunca enfocaban. En vez de depender de qué elemento del DOM
    // recibe el evento, se mide contra el rectángulo real en pantalla
    // (getBoundingClientRect) de cada tarjeta cada frame — así siempre
    // se detecta la que está bajo el cursor de verdad. */
    let hoveredIndex = -1
    const applyHover = (i) => {
      if (i === hoveredIndex) return
      hoveredIndex = i
      inners.forEach((inner, j) => {
        if (!inner) return
        const isHovered = j === i
        inner.classList.toggle('is-hover', isHovered)
        inner.classList.toggle('is-receded', i !== -1 && !isHovered)
        if (lines[j]) lines[j].classList.toggle('is-hover', isHovered)
      })
    }
    let lastClientX = -1
    let lastClientY = -1

    if (reduced) {
      inners.forEach((inner) => { if (inner) inner.classList.add('sealed-in') })
      updateLines()
      return undefined
    }

    // ---- Paralaje de cámara por capas reales: el fondo de vidrio se
    // mueve más, los paneles un poco menos (y cada uno además según su
    // propia profundidad), y el bloque de texto casi no se mueve — como
    // si la cámara flotara frente a una vitrina, no como si todo
    // rotara junto de forma rígida. ----
    const pos = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e) => {
      const r = stage.getBoundingClientRect()
      pos.x = (e.clientX - r.left) / r.width - 0.5
      pos.y = (e.clientY - r.top) / r.height - 0.5
      lastClientX = e.clientX
      lastClientY = e.clientY
    }
    const onLeave = () => { pos.x = 0; pos.y = 0; lastClientX = -1; lastClientY = -1; applyHover(-1) }
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)

    const updateHover = () => {
      if (lastClientX < 0) return
      // Si el cursor cae dentro de más de una (pueden superponerse por
      // el paralaje), gana la que está más cerca de la cámara (mayor
      // data-z) — es la que se ve por encima.
      let hit = -1
      let hitZ = -Infinity
      nodes.forEach((n, i) => {
        if (!n) return
        const box = n.getBoundingClientRect()
        const inside = lastClientX >= box.left && lastClientX <= box.right && lastClientY >= box.top && lastClientY <= box.bottom
        if (!inside) return
        const z = parseFloat(n.dataset.z)
        if (z > hitZ) { hitZ = z; hit = i }
      })
      applyHover(hit)
    }

    const loopFrame = () => {
      cur.x += (pos.x - cur.x) * 0.06
      cur.y += (pos.y - cur.y) * 0.06

      bg.style.transform = `rotateX(${(-cur.y * 10).toFixed(2)}deg) rotateY(${(cur.x * 14).toFixed(2)}deg)`
      cam.style.transform = `rotateX(${(-cur.y * 5).toFixed(2)}deg) rotateY(${(cur.x * 7).toFixed(2)}deg)`
      hub.style.transform = `translateY(-50%) translateZ(14px) rotateX(${(cur.y * 2).toFixed(2)}deg) rotateY(${(-cur.x * 2).toFixed(2)}deg)`

      nodes.forEach((n) => {
        if (!n) return
        const depth = parseFloat(n.dataset.depth)
        const z = parseFloat(n.dataset.z)
        n.style.transform = `translate(${(-cur.x * depth * 26).toFixed(2)}px, ${(-cur.y * depth * 26).toFixed(2)}px) translateZ(${z}px)`
      })

      updateLines()
      updateHover()
    }

    // Igual que las imágenes de proyecto: el rAF de esta escena se pausa
    // solo mientras "Trabajo interno" está fuera de pantalla, en vez de
    // correr para siempre desde que se monta el componente.
    let raf = 0
    let running = false
    let entered = false
    const tick = () => { if (running) { loopFrame(); raf = requestAnimationFrame(tick) } }
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!entered) {
          entered = true
          inners.forEach((inner, i) => {
            if (!inner) return
            window.setTimeout(() => { inner.classList.add('sealed-in') }, i * 80)
          })
        }
        start()
      } else {
        stop()
      }
    }, { threshold: 0.01 })
    io.observe(stage)

    return () => {
      stop()
      io.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const job = JOBS[0]

  return (
    <div className="sealed-orbit" ref={stageRef}>
      <div className="sealed-glass-bg" ref={bgRef} aria-hidden="true">
        <div className="glass-shard shard-1" />
        <div className="glass-shard shard-2" />
        <div className="glass-shard shard-3" />
      </div>

      <svg className="sealed-lines" aria-hidden="true">
        {SEALED.map((s, i) => {
          const name = typeof s.name === 'string' ? s.name : s.name[lang]
          return <line key={name} ref={(el) => { lineRefs.current[i] = el }} />
        })}
      </svg>

      <div className="sealed-cam" ref={camRef}>
        <div className="sealed-hub" ref={hubRef}>
          <div className="sealed-hub-role">{job.role[lang]}</div>
          <div className="sealed-hub-org">{job.org}</div>
          <div className="sealed-hub-when">{job.when[lang]}</div>
        </div>
        {SEALED.map((s, i) => {
          const name = typeof s.name === 'string' ? s.name : s.name[lang]
          return (
            <div
              className="sealed-node"
              key={name}
              data-depth={s.depth}
              data-z={s.z}
              style={s.pos}
              ref={(el) => { nodeRefs.current[i] = el }}
            >
              <div
                className="sealed-node-inner"
                style={{ '--shadow-y': `${s.shadowY}px`, '--rest-blur': `${s.restBlur}px`, '--rest-opacity': s.restOpacity }}
                ref={(el) => { innerRefs.current[i] = el }}
              >
                <span className="sealed-node-name">{name}</span>
                <span className="sealed-node-tech">{s.tech}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Posiciones exactas del mosaico (líneas de grid, no "span" con
   auto-flow: dense) — las 9 tarjetas cubren exactamente una grilla de
   4 columnas x 4 filas (16 celdas: 4+1+1+1+1+2+2+2+2), así no puede
   quedar ningún hueco vacío ni tarjeta "perdida" por el packing
   automático. Si se agrega/quita un proyecto, hay que ajustar esto. */
const MOSAIC_PLACEMENTS = [
  { col: '1 / 3', row: '1 / 3' }, // 0 directorio — 2x2
  { col: '3 / 4', row: '1 / 2' }, // 1 lagro
  { col: '4 / 5', row: '1 / 2' }, // 2 maphunter
  { col: '3 / 4', row: '2 / 3' }, // 3 landing
  { col: '4 / 5', row: '2 / 3' }, // 4 morna
  { col: '1 / 3', row: '3 / 4' }, // 5 venus — 2x1
  { col: '3 / 4', row: '3 / 5' }, // 6 pollita — 1x2
  { col: '4 / 5', row: '3 / 5' }, // 7 sos — 1x2
  { col: '1 / 3', row: '4 / 5' }  // 8 turismo — 2x1
]

/* Mosaico de proyectos con inclinación 3D permanente (CSS Grid +
   perspective + rotateX/Y/Z), reutiliza el mismo LiquidImage (agua +
   filtro rojo/azul) de las tarjetas de proyecto. La inclinación reacciona
   al puntero con inercia (lerp) — solo corre mientras el mosaico está en
   pantalla y se apaga del todo con prefers-reduced-motion. */
function Mosaic({ lang, t }) {
  const stageRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const grid = gridRef.current
    if (!stage || !grid || quiet()) return undefined

    const BASE = { rx: 8, ry: -6, rz: 2 }
    const pos = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e) => {
      const r = stage.getBoundingClientRect()
      pos.x = (e.clientX - r.left) / r.width - 0.5
      pos.y = (e.clientY - r.top) / r.height - 0.5
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    let running = false
    const render = () => {
      cur.x += (pos.x - cur.x) * 0.05
      cur.y += (pos.y - cur.y) * 0.05
      const rx = BASE.rx - cur.y * 6
      const ry = BASE.ry + cur.x * 8
      grid.style.transform = `perspective(1800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${BASE.rz}deg)`
    }
    const tick = () => { if (running) { render(); raf = requestAnimationFrame(tick) } }
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 })
    io.observe(stage)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="mosaic-stage" ref={stageRef}>
      <div className="mosaic-grid" ref={gridRef}>
        {WORKS.map((w, i) => {
          const name = typeof w.name === 'string' ? w.name : w.name[lang]
          const link = w.demo || w.code
          const Wrap = link ? 'a' : 'div'
          const wrapProps = link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {}
          const place = MOSAIC_PLACEMENTS[i % MOSAIC_PLACEMENTS.length]
          return (
            <Wrap
              className="mosaic-card"
              key={w.id}
              style={{ gridColumn: place.col, gridRow: place.row }}
              {...wrapProps}
            >
              <LiquidImage src={w.img} alt={name} cursorLabel="" />
              <span className="mosaic-card-tag">{t.proyectos.filters[w.cat]}</span>
              {link && <span className="mosaic-card-expand" aria-hidden="true">↗</span>}
              <div className="mosaic-card-overlay" aria-hidden="true" />
              <span className="mosaic-card-title">{name}</span>
            </Wrap>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   Preloader de entrada — letra a letra, cortina de color, monograma
   ============================================================ */

const PRELOADER_LETTERS = ['D', 'A', 'N', 'I', 'E', 'L', 'A']
const PRELOADER_LETTER_MS = 780
const PRELOADER_SWEEP_INDEX = 4 // letra #5 de 7 ("E")

function Preloader({ onExit }) {
  const [letterIndex, setLetterIndex] = useState(0)
  const [sweeping, setSweeping] = useState(false)
  const [finalPhase, setFinalPhase] = useState(false)
  const [ctaIn, setCtaIn] = useState(false)
  const [flip, setFlip] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)

  // El CTA arranca sin la clase "pl-in" y recién la suma un frame después
  // de existir en el DOM — si naciera con la clase puesta de entrada no
  // habría transición real, aparecería directo en su estado final.
  useEffect(() => {
    if (!finalPhase) return undefined
    const raf = requestAnimationFrame(() => setCtaIn(true))
    return () => cancelAnimationFrame(raf)
  }, [finalPhase])

  useEffect(() => {
    if (quiet()) {
      setSweeping(true)
      setFinalPhase(true)
      return undefined
    }
    let i = 0
    const timer = setInterval(() => {
      i += 1
      if (i >= PRELOADER_LETTERS.length) {
        clearInterval(timer)
        setFinalPhase(true)
        return
      }
      if (i === PRELOADER_SWEEP_INDEX) setSweeping(true)
      setLetterIndex(i)
    }, PRELOADER_LETTER_MS)
    return () => clearInterval(timer)
  }, [])

  // El bloqueo de scroll lo maneja LandingOverlay (que sigue tapando la
  // pantalla después de este preloader) — acá no hace falta tocarlo, así
  // no hay dos componentes peleándose por el mismo overflow del body.
  const exit = (withSound) => {
    if (exiting) return
    setExiting(true)
    if (onExit) onExit(withSound)
    window.setTimeout(() => setDone(true), 1300)
  }

  if (done) return null

  const letter = PRELOADER_LETTERS[letterIndex]

  return (
    <div className={`preloader${exiting ? ' pl-exit' : ''}`}>
      <div className="pl-layer pl-dark">
        <div className="pl-content">
          {!finalPhase && <div className="pl-letter pl-glitch" key={`d-${letterIndex}`}>{letter}</div>}
          <div className="pl-brand">Daniela Rodríguez<span className="pl-reg">®</span></div>
        </div>
      </div>

      <div className={`pl-layer pl-rose${sweeping ? ' pl-sweep' : ''}`}>
        <div className="pl-content">
          {!finalPhase && <div className="pl-letter pl-glitch" key={`r-${letterIndex}`}>{letter}</div>}

          {finalPhase && (
            <div className={`pl-icon-wrap${flip ? ' pl-flip' : ''}`}>
              <div className="pl-icon-flip">
                <svg className="pl-icon-face pl-monogram" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="47" fill="none" strokeWidth="2" />
                  <text x="50" y="63" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="34">DR</text>
                </svg>
                <svg className="pl-icon-face pl-icon-back" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="47" fill="none" strokeWidth="2" />
                  <path d="M34 62L66 30M66 30H38M66 30V58" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          <div className="pl-brand">Daniela Rodríguez<span className="pl-reg">®</span></div>

          {finalPhase && (
            <div className={`pl-final${ctaIn ? ' pl-in' : ''}`} onMouseEnter={() => setFlip(true)} onMouseLeave={() => setFlip(false)}>
              <button className="pl-btn" type="button" onClick={() => exit(true)}>
                Entrar
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {finalPhase && (
          <button className={`pl-silent${ctaIn ? ' pl-in' : ''}`} type="button" onClick={() => exit(false)}>Entrar sin sonido</button>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   Landing — pantalla previa a Proyectos, un overlay aparte (no una
   sección del documento): se descarta al hacer clic y no vuelve a
   aparecer si se hace scroll hacia arriba después. Se monta desde el
   inicio pero queda tapada por el Preloader (más z-index) hasta que
   este se cierra solo.
   ============================================================ */

function LandingOverlay({ t, onToggleLang, soundOn, onToggleSound, active }) {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = gone ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [gone])

  const dismiss = () => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => setGone(true), 1300)
  }

  if (gone) return null

  return (
    <header className={`landing-hero${leaving ? ' landing-exit' : ''}`}>
      <div className="landing-bg" aria-hidden="true">
        {/* El canvas WebGL no arranca hasta que el preloader empieza a
            salir: mientras está tapando la pantalla no se ve nada de esto,
            así que no vale la pena pagar su costo (three.js + shader a
            pantalla completa) desde el primer frame — eso era buena parte
            del "se queda pegado" al cargar. */}
        {active ? <LiquidImage src="/fondo4.jpg" alt="" cursorLabel="" /> : null}
      </div>
      <div className="landing-in">
        <span className="landing-name landing-shine">Daniela Rodríguez</span>
        <span className="landing-role landing-shine">{t.top.role}</span>
        <button className="landing-cta" type="button" onClick={dismiss} data-cursor="↓">
          {t.landing.cta}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="landing-foot">
        <button className={`landing-foot-btn${soundOn ? ' eq-playing' : ''}`} type="button" onClick={onToggleSound} data-cursor={soundOn ? 'Pausar' : 'Música'} aria-label="Música" aria-pressed={soundOn}>
          <span className="landing-eq" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </span>
        </button>

        <button className="landing-foot-btn foot-lang" type="button" onClick={onToggleLang} data-cursor="EN/ES" aria-label="Idioma">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </button>

        <span className="landing-copyright">{t.foot.text}</span>
      </div>
    </header>
  )
}

/* Vista de contacto: misma toma que "Ver Proyectos" (fondo4.jpg con
   LiquidImage, misma tipografía y misma curva de entrada/salida vía
   .landing-exit) pero con los datos de contacto en vez del nombre y
   el CTA. Se monta/desmonta bajo demanda (no siempre está en el DOM
   como LandingOverlay), así que necesita su propia entrada animada:
   arranca con .landing-exit puesto y lo quita un frame después del
   montaje, para que el navegador anime desde ese estado inicial. */
function ContactOverlay({ lang, t, active, onClose, soundOn, onToggleSound, onToggleLang }) {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (active) {
      setMounted(true)
      const raf = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(raf)
    }
    setShown(false)
    const id = window.setTimeout(() => setMounted(false), 1300)
    return () => window.clearTimeout(id)
  }, [active])

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className={`landing-hero contact-hero${shown ? '' : ' landing-exit'}`} role="dialog" aria-modal="true" aria-label={lang === 'es' ? 'Contacto' : 'Contact'}>
      <div className="landing-bg" onClick={onClose} aria-hidden="true">
        <LiquidImage src="/fondo4.jpg" alt="" cursorLabel="" />
      </div>

      <div className="landing-in">
        <div className="contact-cols">
          <span className="landing-name landing-shine">{lang === 'es' ? 'Mándame un saludo' : 'Send me a hello'}</span>

          <div className="contact-side">
            <div className="contact-routes">
              <a className="contact-route solid" href={`mailto:${MAIL}`} data-cursor="↗">
                {lang === 'es' ? 'Correo' : 'Email'}
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M7 7L17 17M17 17H8M17 17V8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="contact-route outline" href="https://wa.me/584241145565" target="_blank" rel="noopener noreferrer" data-cursor="↗">
                WhatsApp
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M7 7L17 17M17 17H8M17 17V8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="contact-lead">
              <span className="contact-lead-caption">
                {lang === 'es' ? 'Me encantaría saber de ti' : 'We look forward to hearing from you'}
              </span>
              <a className="contact-email" href={`mailto:${MAIL}`} data-cursor="↗">{MAIL}</a>
            </div>
          </div>
        </div>

        <div className="contact-secondary">
          <a href="https://github.com/Danirodrigzz" target="_blank" rel="noopener noreferrer" data-cursor="↗">GitHub</a>
          <a href="https://www.linkedin.com/in/danielaa-rodriguezz/" target="_blank" rel="noopener noreferrer" data-cursor="↗">LinkedIn</a>
        </div>
      </div>

      <div className="landing-foot">
        <button className={`landing-foot-btn${soundOn ? ' eq-playing' : ''}`} type="button" onClick={onToggleSound} data-cursor={soundOn ? 'Pausar' : 'Música'} aria-label="Música" aria-pressed={soundOn}>
          <span className="landing-eq" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </span>
        </button>

        <button className="landing-foot-btn foot-lang" type="button" onClick={onToggleLang} data-cursor="EN/ES" aria-label="Idioma">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </button>

        <span className="landing-copyright">{t.foot.text}</span>
      </div>
    </div>
  )
}

/* ============================================================
   App
   ============================================================ */

export default function App() {
  const [lang, setLang] = useState('es')
  const [docked, setDocked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState('')
  const [soundOn, setSoundOn] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const t = copy[lang]
  const lenisRef = useRef(null)
  const audioRef = useRef(null)
  const filtered = filter === 'all' ? WORKS : WORKS.filter((w) => w.cat === filter)
  const workRows = chunk(filtered, 2)

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  useEffect(() => {
    const audio = new Audio('/musicadefondo.mp3')
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio
    return () => { audio.pause(); audioRef.current = null }
  }, [])

  const playMusic = useCallback(() => {
    audioRef.current?.play().catch(() => {})
    setSoundOn(true)
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) { audio.play().catch(() => {}); setSoundOn(true) } else { audio.pause(); setSoundOn(false) }
  }, [])

  useEffect(() => {
    if (quiet()) return undefined
    const lenis = new Lenis({ duration: 1.05, easing: (x) => 1 - Math.pow(1 - x, 3) })
    lenisRef.current = lenis
    let raf = 0
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null }
  }, [])

  // Con Lenis activo el scroll real lo controla su propio rAF, así que
  // saltar de sección se le pide a Lenis (lenis.scrollTo) en vez de al
  // navegador (scrollIntoView/scrollTo) — si no, las dos animaciones
  // compiten y el salto queda roto o no hace nada.
  const scrollTo = useCallback((target) => {
    if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.1 })
    else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    let pending = false
    const read = () => {
      pending = false
      setDocked(window.scrollY > 40)
      const mark = window.innerHeight * 0.4
      let current = ''
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= mark) current = s.id
      }
      setActive(current)
    }
    const onScroll = () => { if (pending) return; pending = true; requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Pila de proyectos tipo "page curl": .works-stack mide
  // workRows.length * 100vh (espacio de scroll) y .works-stack-sticky queda
  // fijo bajo el header mientras dura ese scroll. Cada fila i se "curla"
  // (uProgress 0→1, leído por su LiquidImage) durante el segmento
  // [i, i+1) de ese scroll: raw = cuánto se entró al stack, en pantallas
  // completas; progress de la fila i = clamp(raw - i, 0, 1). El propio
  // LiquidImage suaviza esto con lerp — acá solo se escribe el objetivo.
  const stackRef = useRef(null)
  const stickyRef = useRef(null)
  const headerRef = useRef(null)
  const rowElRefs = useRef([])
  const foldRefs = useRef([])
  useEffect(() => {
    let pending = false
    const read = () => {
      pending = false
      const stack = stackRef.current
      const sticky = stickyRef.current
      if (!stack || !sticky) return
      const headerH = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0
      sticky.style.top = `${headerH}px`
      sticky.style.height = `calc(100vh - ${headerH}px)`

      const segment = window.innerHeight || 1
      const raw = Math.max(0, -stack.getBoundingClientRect().top) / segment
      const progresses = workRows.map((_, i) => Math.min(1, Math.max(0, raw - i)))
      workRows.forEach((_, i) => {
        if (!foldRefs.current[i]) foldRefs.current[i] = { current: 0 }
        const progress = progresses[i]
        foldRefs.current[i].current = progress

        // El shader ya desvanece el canvas cerca del final del curl, pero
        // el texto (título/categoría) es HTML normal, siempre superpuesto
        // en el mismo lugar para todas las filas. Sin esto, el texto de
        // TODAS las filas se ve a la vez (mezclado) desde el principio,
        // porque cada fila "en espera" también arranca en opacidad 1.
        // fadeOut: se apaga cerca del final de su propio pliegue.
        // fadeIn: no aparece hasta que la fila anterior va bien avanzada.
        const el = rowElRefs.current[i]
        if (el) {
          const fadeOut = progress <= 0.78 ? 1 : progress >= 0.96 ? 0 : 1 - (progress - 0.78) / (0.96 - 0.78)
          let fadeIn = 1
          if (i > 0) {
            const p = progresses[i - 1]
            fadeIn = p <= 0.5 ? 0 : p >= 1 ? 1 : (p - 0.5) / 0.5
          }
          const domFade = fadeIn * fadeOut
          el.style.opacity = String(domFade)
          el.style.pointerEvents = domFade < 0.05 ? 'none' : 'auto'
        }
      })
    }
    const onScroll = () => { if (pending) return; pending = true; requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [filter, workRows.length])

  const go = useCallback((id) => {
    // Cerrar el overlay de contacto no libera el scroll del body hasta que
    // termina su animación de salida (1.3s) — sin este reset inmediato,
    // scrollTo no tiene nada que mover y el clic en el menú no hace nada
    // visible hasta un rato después (o nunca, si Lenis lo pierde por el
    // camino).
    setContactOpen(false)
    document.body.style.overflow = ''
    scrollTo(`#${id}`)
    setMenuOpen(false)
  }, [scrollTo])

  // Píldora flotante de contacto: aparece cuando el footer se acerca a la
  // pantalla (rootMargin extiende el área de detección hacia abajo, para
  // que se muestre un poco antes de llegar al final, no solo al tocarlo).
  const footerRef = useRef(null)
  const [showContact, setShowContact] = useState(false)
  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setShowContact(entry.isIntersecting), { rootMargin: '0px 0px 200px 0px', threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Preloader onExit={(withSound) => { setPreloaderDone(true); if (withSound) playMusic() }} />
      <LandingOverlay t={t} onToggleLang={() => setLang((p) => (p === 'es' ? 'en' : 'es'))} soundOn={soundOn} onToggleSound={toggleMusic} active={preloaderDone} />
      <div className="site-bg" aria-hidden="true" />
      <Cursor />
      <Grain />

      <div className="shell">
        <nav className={`top${docked ? ' docked' : ''}`}>
          <div className="top-in">
            <a className="brand" href="#inicio" onClick={(e) => { e.preventDefault(); setContactOpen(false); scrollTo(0) }}>
              <span className="brand-name">Daniela Rodríguez</span>
              <span className="brand-role">{t.top.role}</span>
            </a>
            <ul className="nav-links">
              {SECTIONS.filter((s) => NAV_COMPACT_IDS.includes(s.id)).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={active === s.id ? 'on' : ''} onClick={(e) => { e.preventDefault(); go(s.id) }} data-cursor-shape="pill">
                    {s[lang]}
                  </a>
                </li>
              ))}
            </ul>
            <div className="top-side">
              <button onClick={() => setLang((p) => (p === 'es' ? 'en' : 'es'))} data-cursor="EN/ES">{lang.toUpperCase()}</button>
              <a className="hide-mobile" href={CV_FILE} download data-cursor="↓">{t.top.cv}</a>
              <button className="menu-dots" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-haspopup="true" aria-label={lang === 'es' ? 'Abrir menú' : 'Open menu'}>
                <span />
              </button>
            </div>
          </div>
        </nav>

        {menuOpen && (
          <div className="full-menu" role="dialog" aria-modal="true">
            <span className="full-menu-name">Daniela Rodríguez</span>
            <button className="full-menu-close" onClick={() => setMenuOpen(false)} aria-label={lang === 'es' ? 'Cerrar menú' : 'Close menu'}>✕</button>
            <ul className="full-menu-list">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className={active === s.id ? 'current' : ''}>
                  <button onClick={() => go(s.id)}>
                    <span className="full-menu-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="full-menu-word">{s[lang]}</span>
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => { setMenuOpen(false); setContactOpen(true) }}>
                  <span className="full-menu-n">{String(SECTIONS.length + 1).padStart(2, '0')}</span>
                  <span className="full-menu-word">{lang === 'es' ? 'Contacto' : 'Contact'}</span>
                </button>
              </li>
            </ul>
            <div className="full-menu-social">
              <a href="https://github.com/Danirodrigzz" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/danielaa-rodriguezz/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={`mailto:${MAIL}`}>Email</a>
            </div>
          </div>
        )}

        <main>
          {/* Proyectos — vuelve a ser lo primero en el documento; la
              pantalla de "Daniela Rodríguez" ya no vive acá, es un overlay
              aparte (LandingOverlay) que se descarta y no vuelve a
              aparecer al hacer scroll hacia arriba. */}
          <section className="wrap proyectos-first" id="proyectos">
            {/* El sticky de "Proyectos" + filtros queda dentro de este
                envoltorio junto con la grilla de imágenes, no con toda la
                sección — así se suelta justo donde terminan las imágenes,
                en vez de seguir flotando sobre "Trabajo interno". */}
            <div className="proyectos-images">
              <div className="proyectos-sticky" ref={headerRef}>
                <BandHead title={t.proyectos.title} center />

                <Rise className="filters center" delay={120}>
                  <button className={`filter-pill${filter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>
                    {t.proyectos.filters.all}<sup>{WORKS.length}</sup>
                  </button>
                  {CATS.map((cat) => {
                    const n = WORKS.filter((w) => w.cat === cat).length
                    if (!n) return null
                    return (
                      <button key={cat} className={`filter-pill${filter === cat ? ' on' : ''}`} onClick={() => setFilter(cat)}>
                        {t.proyectos.filters[cat]}<sup>{n}</sup>
                      </button>
                    )
                  })}
                </Rise>
              </div>

              <div className="works-stack" ref={stackRef} style={{ height: `${workRows.length * 100}vh` }}>
                <div className="works-stack-sticky" ref={stickyRef}>
                  {workRows.map((row, ri) => {
                    if (!foldRefs.current[ri]) foldRefs.current[ri] = { current: 0 }
                    return (
                      <div
                        className="works-row"
                        key={row.map((w) => w.id).join('-')}
                        ref={(el) => { rowElRefs.current[ri] = el }}
                        style={{ zIndex: workRows.length - ri }}
                      >
                        {row.map((w, ci) => (
                          <WorkCard
                            key={w.id}
                            w={w}
                            lang={lang}
                            t={t.proyectos}
                            delay={ci * 60}
                            accent={(ri + ci) % 2 === 0 ? 'accent-tiffany' : 'accent-coral'}
                            foldRef={foldRefs.current[ri]}
                          />
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <Rise className="sealed-panel">
              <h3 className="row-name">{t.proyectos.sealedTitle}</h3>
              <p className="lede sealed-note">{t.proyectos.sealed} — {t.proyectos.sealedNote}</p>
              <SealedOrbit lang={lang} />
            </Rise>
          </section>

          {/* Directorio Interactivo 3D — proyecto destacado, título y
              descripción arriba (no encima) del video, que queda contenido
              en vez de a sangrado completo. */}
          <section className="showcase wrap" id="directorio">
            <h2 className="showcase-title">{t.directorio.title}</h2>
            <p className="showcase-desc">{t.directorio.desc}</p>
            <video className="showcase-media" src="/directorio-loop.mp4" autoPlay loop muted playsInline aria-hidden="true" />
          </section>

          {/* Lagro — trabajo remoto para un cliente, en un marco de
              teléfono (la app es móvil, no un kiosco de pantalla ancha),
              con un loop corto de lagrovideo.mp4. Texto a la izquierda,
              teléfono a la derecha. */}
          <section className="phone-showcase wrap" id="lagro">
            <div className="phone-showcase-text">
              <h2 className="showcase-title">{t.lagro.title}</h2>
              <p className="showcase-desc">{t.lagro.desc}</p>
            </div>
            <div className="phone-frame">
              <div className="phone-notch" aria-hidden="true" />
              <video className="phone-video" src="/lagro-loop.mp4" autoPlay loop muted playsInline aria-hidden="true" />
            </div>
          </section>

          <Mosaic lang={lang} t={t} />

          {/* Stack */}
          <section className="band" id="stack">
            <div className="wrap">
              <BandHead title={t.stack.title} lede={t.stack.lede} />
            </div>
            <ToolsStack lang={lang} />
          </section>

          {/* Trayectoria */}
          <section className="band wrap" id="trayectoria">
            <BandHead title={t.trayectoria.title} lede={t.trayectoria.lede} />
            {JOBS.map((job) => <JobItem key={job.org} job={job} lang={lang} />)}
          </section>

        </main>

        <div ref={footerRef} aria-hidden="true" />

        <button
          type="button"
          className={`filter-pill on contact-pill${showContact ? ' show' : ''}`}
          onClick={() => setContactOpen(true)}
          data-cursor="↗"
        >
          {lang === 'es' ? '¿Quieres contactarme?' : 'Want to reach out?'}
        </button>

        <ContactOverlay
          lang={lang}
          t={t}
          active={contactOpen}
          onClose={() => setContactOpen(false)}
          soundOn={soundOn}
          onToggleSound={toggleMusic}
          onToggleLang={() => setLang((p) => (p === 'es' ? 'en' : 'es'))}
        />

        {/* Barra fija inferior: igual que el fondo (.site-bg, fixed) esto
            se queda pegado a la ventana desde el primer scroll, no hay que
            llegar hasta el footer del documento para verlo. Por debajo del
            Preloader y de LandingOverlay (z-index 500 y 50) para que no se
            note mientras esos todavía tapan la pantalla. */}
        <div className="site-foot">
          <button className={`landing-foot-btn${soundOn ? ' eq-playing' : ''}`} type="button" onClick={toggleMusic} data-cursor={soundOn ? 'Pausar' : 'Música'} aria-label="Música" aria-pressed={soundOn}>
            <span className="landing-eq" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </span>
          </button>
          <button className="landing-foot-btn foot-lang" type="button" onClick={() => setLang((p) => (p === 'es' ? 'en' : 'es'))} data-cursor="EN/ES" aria-label="Idioma">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </button>
          <span className="landing-copyright">{t.foot.text}</span>
        </div>
      </div>
    </>
  )
}
