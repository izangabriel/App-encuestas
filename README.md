# Live Polls

Encuestas con resultados en tiempo real. Cualquiera puede crear una encuesta y votar sin registrarse, y los conteos se actualizan al instante en todas las pantallas abiertas, sin recargar.

**Demo:** https://appvotation.netlify.app/

## Qué hace

- Crear encuestas con una pregunta y de 2 a 5 opciones.
- Votar sin cuenta: cada navegador recibe un identificador anónimo.
- Un voto por navegador en cada encuesta, con aviso si ya votaste.
- Resultados en vivo: cuando alguien vota desde otra ventana o dispositivo, el conteo cambia solo.

## Tecnologías

React (Vite) · Supabase (PostgreSQL y Realtime) · Tailwind CSS

## Decisiones técnicas

- **Tiempo real con Supabase Realtime.** Cada encuesta se suscribe a los `INSERT` de la tabla `votes`, filtrados por su `poll_id`, y la suscripción se cancela al desmontar el componente.
- **Votos en su propia tabla.** No hay un contador guardado por opción: los totales se calculan agrupando los votos, así existe una sola fuente de verdad y se puede saber quién ya votó.
- **Identidad anónima sin login.** El `voterId` se genera una vez con `crypto.randomUUID()` y se guarda en `localStorage`. No es estado de React porque nunca cambia después de crearse.
- **RLS permisivo a propósito.** Sin cuentas no hay dueño de los datos, así que las políticas permiten leer y crear a cualquier visitante.

## Cómo correrlo en local

1. Clona el repositorio e instala dependencias:
   ```bash
   git clone [URL DEL REPOSITORIO]
   cd live-polls
   npm install
   ```
2. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta el contenido de `supabase/schema.sql` en el SQL Editor. Incluye la activación de Realtime para `votes`.
3. Copia `.env.example` a `.env` y completa los valores (Project Settings, API). La URL debe ser la base del proyecto, sin rutas al final.
4. Inicia la app:
   ```bash
   npm run dev
   ```

## Limitaciones conocidas

- El voto único es por navegador: borrando los datos del sitio o abriendo una ventana de incógnito se puede votar otra vez. Es un demo, no una votación segura.
- La comprobación de voto duplicado se hace desde el cliente. La base de datos no tiene una restricción única sobre `(poll_id, voter_id)`.
- Las políticas permiten insertar a cualquier visitante y no validan que `option_index` corresponda a una opción real.
- El backend corre en el plan gratuito de Supabase, que pausa los proyectos con poca actividad. Si el demo no carga, avísame y lo reactivo.
- No tiene pruebas automatizadas.
