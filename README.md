# Reproductor de Música desde GitHub

Esta es una aplicación web que te permite escuchar tu música almacenada en un repositorio privado de GitHub directamente desde tu navegador.

## Características

- Reproduce archivos de audio desde tu repositorio privado de GitHub
- Interfaz de usuario intuitiva y responsiva
- Listas de reproducción organizadas en carpetas
- Reproducción en segundo plano
- Barra de progreso interactiva
- Controles de reproducción (anterior, reproducir/pausar, siguiente)
- Soporte para múltiples formatos de audio (MP3, WAV, OGG, etc.)

## Configuración

### 1. Crear un repositorio en GitHub

1. Crea un nuevo repositorio privado en GitHub
2. Crea la siguiente estructura de carpetas:

   ```
   tu-repositorio/
   ├── playlists.json
   └── playlists/
       ├── playlist-1/
       │   ├── cover.jpg
       │   ├── cancion1.mp3
       │   └── cancion2.mp3
       └── playlist-2/
           ├── cover.jpg
           └── cancion1.mp3
   ```

### 2. Configurar el archivo `playlists.json`

Crea un archivo `playlists.json` con la siguiente estructura:

```json
{
    "playlists": [
        {
            "id": "playlist-1",
            "name": "Mi Playlist 1",
            "description": "Descripción de la playlist 1",
            "coverUrl": "https://raw.githubusercontent.com/tu-usuario/tu-repositorio/main/playlists/playlist-1/cover.jpg",
            "tracks": [
                {
                    "id": "1",
                    "name": "Canción 1",
                    "file": "cancion1.mp3"
                },
                {
                    "id": "2",
                    "name": "Canción 2",
                    "file": "cancion2.mp3"
                }
            ]
        }
    ]
}
```

### 3. Configurar el archivo `app.js`

En el archivo `app.js`, actualiza la configuración con tus datos de GitHub:

```javascript
const CONFIG = {
    github: {
        token: 'TU_TOKEN_DE_GITHUB', // Crea un token en GitHub con acceso a repositorios
        repo: 'tu-usuario/tu-repositorio', // Reemplaza con tu usuario/repositorio
        branch: 'main' // O la rama que estés usando
    }
};
```

Para crear un token de acceso personal en GitHub:

1. Ve a [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Haz clic en "Generate new token"
3. Selecciona el alcance `repo` para acceder a repositorios privados
4. Copia el token generado y guárdalo en un lugar seguro

## Uso

### Desarrollo local

1. Instala un servidor web local (si no tienes uno):
   ```bash
   npm install -g http-server
   ```

2. Inicia el servidor web en la carpeta del proyecto:
   ```bash
   http-server -p 8080 --cors
   ```
   > **Nota:** El flag `--cors` es necesario para permitir solicitudes a la API de GitHub

3. Abre tu navegador y ve a `http://localhost:8080`

4. ¡Listo! La aplicación cargará automáticamente tus listas de reproducción desde GitHub

### Despliegue en producción

Puedes desplegar la aplicación en cualquier servicio de alojamiento estático como:

1. **GitHub Pages** (solo para repositorios públicos)
   ```bash
   # Crea una rama llamada 'gh-pages'
   git checkout -b gh-pages
   git push -u origin gh-pages
   ```
   Luego activa GitHub Pages en la configuración de tu repositorio

2. **Netlify**

   - Arrastra y suelta la carpeta del proyecto en [Netlify Drop](https://app.netlify.com/drop)
   - O conecta tu repositorio de GitHub

3. **Vercel**

   - Importa tu repositorio de GitHub en [Vercel](https://vercel.com/)
   - Configura el proyecto como un sitio estático

## Personalización

### Cambiar el tema

Puedes personalizar los colores modificando las variables CSS en el archivo `styles.css`:

```css
:root {
    --primary-color: #1db954; /* Color principal (verde de Spotify) */
    --background-color: #121212; /* Color de fondo */
    --surface-color: #181818; /* Color de superficies */
    --text-color: #ffffff; /* Color de texto principal */
    --text-secondary: #b3b3b3; /* Color de texto secundario */
}
```

### Agregar más listas de reproducción
1. Crea una nueva carpeta en el directorio `playlists/`
2. Añade las canciones y una imagen de portada
3. Actualiza el archivo `playlists.json` con la nueva lista:

```json
{
    "playlists": [
        {
            "id": "nueva-playlist",
            "name": "Nombre de la lista",
            "description": "Descripción de la lista",
            "coverUrl": "https://raw.githubusercontent.com/tu-usuario/tu-repositorio/main/playlists/nueva-playlist/cover.jpg",
            "tracks": [
                {
                    "id": "1",
                    "name": "Canción 1",
                    "file": "cancion1.mp3"
                }
            ]
        }
    ]
}
```

## Limitaciones

- La aplicación requiere conexión a Internet para acceder a los archivos en GitHub
- Solo se pueden reproducir formatos de audio compatibles con el navegador (MP3, AAC, OGG, WAV)
- El reproductor puede tener limitaciones en algunos navegadores móviles debido a restricciones de autoplay
- Los archivos de audio deben ser accesibles a través de raw.githubusercontent.com

## Solución de problemas

### No se pueden cargar las listas de reproducción
- Verifica que el token de GitHub tenga los permisos necesarios
- Asegúrate de que la ruta del repositorio sea correcta (usuario/repositorio)
- Comprueba que el archivo `playlists.json` tenga la estructura correcta

### No se pueden reproducir las canciones
- Verifica que las rutas de los archivos en `playlists.json` sean correctas
- Asegúrate de que los archivos de audio estén en el repositorio
- Comprueba que el token de GitHub tenga acceso al repositorio

### Error 403 (Forbidden)
- Asegúrate de que el token de GitHub sea válido y tenga los permisos necesarios
- Verifica que el repositorio exista y sea accesible
- Si el repositorio es privado, asegúrate de que el token tenga acceso a repositorios privados

## Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo y modificarlo según tus necesidades.
