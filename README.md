# Explorador de Algoritmos: BFS y DFS en Laberintos
### Centro Universitario de Ciencias Exactas e Ingenierias (CUCEI) · Universidad de Guadalajara

Aplicacion web educativa, luminosa e interactiva para la ensenanza y comprension paso a paso de los algoritmos de **Busqueda en Amplitud (BFS)** y **Busqueda en Profundidad (DFS)**.

La aplicacion esta disenada para ejecutarse completamente en el navegador (cliente) sin dependencias de backend, lista para su publicacion en **GitHub Pages**.

---

## Creditos Institucionales
- **Institucion:** Centro Universitario de Ciencias Exactas e Ingenierias (CUCEI).
- **Alumnado:** Angel Gael Garcia Ramos, Valeria Martin Llamas, Maricarmen Hernandez Gomez.

*(Accesible directamente en la aplicacion a traves del boton **Creditos** en la barra superior).*

---

## Caracteristicas Principales

1. **Dashboard de Una Sola Pantalla:**
   - Sin pestanas ocultas: la cuadricula del laberinto, el codigo Python, la explicacion paso a paso y los controles estan a la vista al mismo tiempo.

2. **Tour Guiado Ligero (Guia Interactiva):**
   - Modal interactivo accesible desde el boton **"Guia"** que recorre cada seccion clave de la aplicacion (matriz, selector, codigo, explicacion, estructura de datos y controles).

3. **Codigo de Colores de la Cuadricula:**
   - **Inicio (Dorado):** Casilla de origen identificada con estrella y etiqueta INICIO.
   - **Meta (Rojo):** Destino a alcanzar identificado con bandera.
   - **Muros (Gris):** Obstaculos intransitables.
   - **Explorado (Azul cielo):** Casillas visitadas por el algoritmo.
   - **Camino Final (Verde brillante):** Ruta definitiva encontrada numerada paso a paso.

4. **Tamanos de Cuadricula desde 3x3 hasta 10x10:**
   - Permite trabajar con laberintos reducidos (3x3, 4x4) para comprender el flujo en pocos pasos sin saturacion.

5. **Alternar Rutas DFS en el MISMO Laberinto:**
   - Permite cambiar la prioridad de direccion de giro de DFS (Ruta A, Ruta B, Ruta C...) en el **mismo laberinto sin cambiar los muros**, demostrando como DFS descubre caminos diferentes segun el orden de apilado.

6. **Tres Niveles de Control de Reinicio:**
   - **Reiniciar Simulacion:** Vuelve al paso 0 conservando el mismo laberinto y la misma ruta para repetir la animacion.
   - **Cambiar Ruta DFS:** Mantiene el laberinto identico pero cambia la estrategia de exploracion de ramas de DFS.
   - **Nuevo Laberinto:** Genera una distribucion de obstaculos y muros completamente nueva.

7. **Atajos de Teclado Globales:**
   - `Espacio`: Iniciar o Pausar la simulacion.
   - `Flecha Derecha (→)`: Avanzar un paso (Step Forward).
   - `Flecha Izquierda (←)`: Retroceder un paso (Step Backward).
   - `Tecla R`: Reiniciar la simulacion al paso 0.
   - `Escape`: Cerrar cualquier ventana modal activa.

8. **Codigo Python con Resaltado y Panel de Explicacion:**
   - Visualizador de codigo Python 3 con iluminacion en tiempo real de la linea activa.
   - Panel de **Explicacion** que describe con claridad la instruccion en ejecucion sin emojis.

9. **Estructuras de Datos en Vivo:**
   - **BFS:** Fila de espera (Cola FIFO).
   - **DFS:** Torre de bloques (Pila LIFO).

10. **Comparacion Real de Rutas (BFS vs DFS):**
   - Modal comparativo con minimapas lado a lado:
     - **BFS:** Se expande como una onda de agua y garantiza siempre el camino mas corto.
     - **DFS:** Desciende a lo largo de un pasillo a maxima profundidad; encuentra un camino valido pero frecuentemente no optimo. Permite alternar variantes de DFS en el mismo mapa.

---

## Estructura de Carpetas

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Despliegue automatico en GitHub Pages
├── index.html                  # Punto de entrada HTML
├── package.json                # Dependencias del proyecto
├── tsconfig.json               # Configuracion TypeScript
├── vite.config.ts              # Configuracion Vite con base relativa './'
├── src/
│   ├── main.tsx                # Punto de entrada de React
│   ├── App.tsx                 # Contenedor principal de la aplicacion
│   ├── index.css               # Estilos globales
│   ├── types/
│   │   └── index.ts            # Tipos e interfaces
│   ├── utils/
│   │   └── algorithms.ts       # Logica de BFS, variantes DFS y laberintos
│   └── components/
│       ├── Header.tsx          # Barra superior con Tour, Comparador y Creditos
│       ├── GridMatrix.tsx      # Matriz interactiva de celdas
│       ├── SimulationControls.tsx # Controles de video y botones de reinicio
│       ├── CodeViewer.tsx      # Codigo Python y panel de Explicacion
│       ├── TheoryPanel.tsx     # Selector y conceptos teoricos
│       ├── DataStructureVisualizer.tsx # Visualizador de Cola FIFO y Pila LIFO
│       ├── ComparisonModal.tsx # Ventana de comparacion simultanea
│       ├── AuthorsModal.tsx    # Ventana modal con creditos de CUCEI
│       └── TourOverlay.tsx     # Guia interactiva paso a paso
```

---

## Ejecucion Local

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <CARPETA>
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor local:
   ```bash
   npm run dev
   ```

---

## Despliegue en GitHub Pages

1. Subir los cambios a la rama principal (`main`) en GitHub.
2. En el repositorio de GitHub, navegar a **Settings > Pages**.
3. En **Build and deployment > Source**, seleccionar **GitHub Actions**.
4. El archivo `.github/workflows/deploy.yml` compilara y desplegara la web automaticamente.
