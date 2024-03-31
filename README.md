# Pre

- Crear un contenedor con MySQL usando docker-compose. Crear una base de datos default dentro del contenedor para poder habilitar el desarrollo.

# Paso 1

- Setup del proyecto.
- Instalación y verificación de shadcn y de tailwind.
- Commit inicial.

# Paso 2

- Install next.nav
- Setup Clerk account and create Auth Project.
- Crear middleware.ts para gestionar protección de rutas.
- Agregar las carpetas para sign-in y sign-up con sus respectivas pages.
- Agregar un layout para la sección de autenticación para centrar los compoenentes de signup y signin.
- Agregar al middleware.ts la lista de rutas públicas.

# Paso 3

- Crear componente Logo.
- Creación del Sidebar.
- Crear la ruta Search/Browse y la página.
- Crear el NavigationBar
  - Crear el MobileSidebar usando Sheet con shadcn
  - Instalar shadcn Sheet componente.
  - Verificar que funcione correctamente en mobile.
  - Crear el NavbarRoutes con el USerButton adentro
  - Crar el Navbar y agregar NavbarRoutes y MobileSidebar
- Agregar condiciones para modo Teacher o Estudiante
- Agregar rutas para Cursos y Analiticas en modo Teacher

# Paso 4

- Crear Pagina de creación de cursos
  - Instalar shacn form y Shadcn input
  - Agregar a la página de listado de cursos la opción agregar curso.
  - Agregar la ruta de creación de curso
  - Agregar axios como dependencia.
  - Agregar react-hot-toast y crear un componente proveedor que retorna el toaster.
  - Agregar el proveedor del toaster en el layout principal dentro del body.
  - Importar el toaster en la página de creación y usarlo cuando hay error.
  - Crear el form de captura del nombre del curso.

# Paso 5

- Crear la dependencia con Prisma, agregarla al proyecto.
- Crear conexión y setup de prisma
- Incializar Prisma
