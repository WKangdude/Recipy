# Plan de desarrollo de Recipy

## Objetivo

Crear una aplicación web en español para convertir el plan alimenticio de una nutrióloga en una herramienta de consulta, preparación de platillos y planificación semanal. El documento y sus datos confirmados serán la fuente de verdad: la aplicación calculará equivalencias y comparará porciones, sin inventar recomendaciones nutricionales.

## Alcance inicial

- Importar PDF (digital o escaneado), JPG o PNG con grupos de alimentos, equivalencias por porción y tabla de porciones por comida.
- Revisar y corregir la extracción antes de activar el plan. Ofrecer captura manual cuando el documento no pueda interpretarse.
- Consultar alimentos por grupo y buscar sus equivalencias; consultar objetivos por comida.
- Guardar platillos con ingredientes, cantidades, rendimiento, receta y procedimiento.
- Comparar una cantidad seleccionada de un platillo con los objetivos de una comida.
- Planificar por fecha, horario y comida, seleccionando uno o varios platillos guardados.
- Interfaz móvil, adaptable a escritorio, con temas claro, oscuro y según el sistema.
- Cuenta personal y persistencia privada entre dispositivos.

El MVP no incluirá cálculo de calorías o macros si el documento no los proporciona, recomendaciones automáticas, comunidad, lista de compras ni registro de consumo real. El calendario representa lo planeado; el seguimiento de lo consumido se puede añadir después.

## Flujo principal

1. Crear una cuenta e importar el documento del plan.
2. Revisar los grupos, alimentos, equivalencias y objetivos por comida detectados.
3. Corregir campos pendientes y confirmar una versión del plan.
4. Consultar el catálogo y crear platillos usando sus alimentos.
5. Indicar el rendimiento de cada receta y la cantidad que se comerá.
6. Elegir una comida para visualizar la comparación por grupo.
7. Añadir platillos al calendario con día, hora y cantidad; revisar el total de la comida.

## Secciones y experiencia

| Sección | Contenido y acciones |
| --- | --- |
| Inicio | Comidas del día, resumen por grupos y acceso al plan activo. |
| Mi plan | Documento, estado de importación, revisión y versiones confirmadas. |
| Consulta | Buscador de alimentos, filtros por grupo, equivalencias y tabla de objetivos. |
| Platillos | Lista, búsqueda, creación y edición; ingredientes, rendimiento y pasos. |
| Planificador | Vistas diaria y semanal; asignación, edición y eliminación de comidas. |
| Ajustes | Tema, cuenta y gestión de datos personales. |

En móvil se usará navegación inferior para Inicio, Consulta, Platillos y Planificador; Mi plan estará accesible desde Inicio y Ajustes. En escritorio se aprovechará una barra lateral y más espacio para tablas y calendario.

El estilo será minimalista: fondos neutros, tipografía legible, espacios amplios y un color principal discreto. Los estados usarán texto, iconos y color, con contraste accesible y controles táctiles cómodos. Los formularios tendrán etiquetas claras, mensajes de error junto al campo y estados vacíos, de carga y de fallo.

## Importación del documento

### Proceso

1. Validar tipo, tamaño y número de páginas, con límites explícitos en la interfaz.
2. Guardar el archivo en almacenamiento privado y crear un trabajo de importación.
3. Extraer texto de PDF digital; utilizar OCR o un modelo con visión para páginas escaneadas e imágenes.
4. Convertir el contenido a un esquema validado: grupos, alimentos, cantidad equivalente a una porción, unidades, comidas y objetivos por grupo.
5. Mostrar una revisión junto al documento o fragmento de origen. Marcar campos ausentes, ambiguos o con unidades no reconocidas.
6. Permitir corregir, añadir y eliminar filas. No completar datos nutricionales mediante suposiciones.
7. Activar el plan únicamente después de confirmación; conservar su versión y procedencia.

### Consideraciones

- La tecnología final de extracción se elegirá probándola con una hoja real anonimizada. No se asumirá que todos los documentos comparten formato.
- Las claves del proveedor de extracción permanecerán en el servidor. Habrá límites de uso, errores recuperables y protección contra importaciones duplicadas.
- Se tratará el documento como datos, nunca como instrucciones para herramientas o acciones.
- La captura manual y la corrección deben funcionar aunque falle el proveedor externo.
- Antes de integrar un servicio externo se definirá qué datos recibe, su retención y cómo eliminar documentos y datos personales.

## Cálculo de equivalencias y cumplimiento

### Conceptos

- **Porción del grupo:** unidad de intercambio definida por la nutrióloga.
- **Cantidad del alimento:** cantidad física equivalente a una porción, por ejemplo 1 tortilla o 30 g.
- **Ración del platillo:** fracción de la receta que se sirve; no es una porción de grupo.

Cada ingrediente podrá registrarse directamente en porciones del grupo o en una cantidad física compatible con su equivalencia. No se convertirán gramos a mililitros ni piezas a gramos sin una equivalencia explícita para ese alimento.

Para cada ingrediente:

`porciones de grupo = cantidad usada / cantidad equivalente a una porción`

Para una receta con rendimiento de N raciones:

`porciones servidas del grupo = suma de porciones del grupo en la receta × raciones seleccionadas / N`

Ejemplo: una receta usa 4 tortillas y el plan indica que 1 tortilla equivale a 1 porción de cereales. Si rinde 2 raciones, una ración aporta 2 porciones de cereales. Si el objetivo para esa comida es 3, se mostrará «Por debajo: falta 1 porción».

### Estados por grupo

| Condición | Etiqueta | Presentación propuesta |
| --- | --- | --- |
| Aporte igual al objetivo | Cumple | Verde e icono de confirmación. |
| Aporte menor al objetivo | Por debajo | Ámbar y cantidad faltante. |
| Aporte mayor al objetivo | Por encima | Rojo y cantidad excedente. |
| Falta equivalencia u objetivo | Sin evaluar | Gris y explicación del dato pendiente. |

Se conservará precisión decimal durante el cálculo y se redondeará únicamente al mostrar valores. La comparación usará precisión decimal definida, sin una tolerancia nutricional arbitraria. Los valores cero serán distintos de los objetivos ausentes; «libre» se representará explícitamente y no se interpretará como cero.

El resumen de una comida sumará todos sus platillos y cantidades. Un platillo aislado puede estar por debajo y completar la comida al combinarse con otro. No se mostrará «Cumple» global si existe un grupo sin evaluar o fuera del objetivo; se indicarán los grupos que necesitan atención.

La valoración depende de la comida seleccionada: un mismo platillo puede cumplir para el desayuno y exceder la cena. Los resultados indicarán la versión del plan utilizada.

## Arquitectura propuesta

- **Next.js con App Router y TypeScript:** páginas, componentes de servidor y endpoints del backend.
- **Tailwind CSS y shadcn/ui:** diseño adaptable, componentes accesibles y temas mediante next-themes.
- **React Hook Form y Zod:** formularios y validación compartida de entradas y resultados de extracción.
- **Supabase:** PostgreSQL, autenticación y almacenamiento privado. Las políticas por usuario se verificarán tanto para registros como para archivos.
- **Módulo de dominio independiente:** conversiones, sumas y evaluación por grupo, separado de la interfaz y del proveedor de extracción.
- **Procesamiento de importación:** trabajos persistentes con estados pendiente, procesando, requiere revisión, completado y fallido. La infraestructura del trabajador se elegirá según los límites del alojamiento; evitar OCR prolongado dentro de una petición web.
- **Vitest y Testing Library:** pruebas del cálculo y componentes críticos.
- **Playwright:** flujos de usuario en tamaños móvil y escritorio.
- **Despliegue propuesto:** Vercel para Next.js y Supabase para datos; confirmar compatibilidad del procesamiento de documentos antes del despliegue.

Las versiones estables y compatibles se fijarán al iniciar la implementación y se conservará el lockfile. Las credenciales se configurarán de forma segura, sin almacenarlas en Git ni exponer claves privilegiadas al navegador.

## Modelo de datos inicial

| Entidad | Datos principales |
| --- | --- |
| Usuario | Identidad, preferencias y zona horaria. |
| Documento | Propietario, ubicación privada, tipo y metadatos. |
| Importación | Documento, estado, error y resultado provisional. |
| Versión del plan | Propietario, documento de origen, estado y fecha de activación. |
| Grupo de alimentos | Nombre y pertenencia a una versión del plan. |
| Alimento | Grupo, nombre, cantidad/unidad equivalente y procedencia. |
| Comida del plan | Nombre, orden y horario sugerido opcional. |
| Objetivo | Comida, grupo, cantidad o condición explícita de libre. |
| Platillo y versión | Nombre, notas, rendimiento y procedimiento ordenado. |
| Ingrediente del platillo | Alimento/equivalencia de referencia, cantidad, unidad y porciones calculadas. |
| Comida planificada | Fecha local, hora local, zona horaria, comida y versión del plan. |
| Platillo planificado | Comida planificada, versión del platillo y raciones seleccionadas. |

Las recetas y entradas del calendario conservarán referencias a versiones para que una edición posterior no cambie silenciosamente registros anteriores. Al cambiar de plan se pedirá revisar equivalencias y objetivos afectados. Para el MVP bastará un usuario por cuenta, sin colaboración entre cuentas.

## Fases de implementación

### 1. Base técnica y diseño

- Inicializar Next.js, TypeScript, estilos, validaciones y herramientas de calidad.
- Crear navegación adaptable, temas y componentes compartidos.
- Documentar instalación, variables, comandos y ejecución en la nube.

**Criterio de cierre:** aplicación arrancando; compilación, tipos y lint correctos; navegación usable en móvil y escritorio y tema persistente.

### 2. Cuenta, datos y plan manual

- Configurar autenticación, esquema, migraciones y acceso privado.
- Implementar grupos, alimentos, equivalencias y objetivos por comida.
- Construir consulta y edición manual; activar versiones confirmadas.

**Criterio de cierre:** un usuario guarda y consulta su plan; otra cuenta no puede acceder a sus registros ni archivos.

### 3. Platillos y motor de cálculo

- Crear, consultar, editar y eliminar platillos con rendimiento e instrucciones.
- Añadir ingredientes con equivalencias válidas y seleccionar raciones servidas.
- Mostrar aporte por grupo, diferencias y etiquetas por comida.

**Criterio de cierre:** los cálculos coinciden con casos manuales verificados, incluyendo fracciones, objetivos cero y datos incompletos.

### 4. Planificación diaria y semanal

- Asignar día, horario, comida, platillos y cantidades.
- Sumar aportes de varios platillos y comparar contra objetivos.
- Editar, eliminar y copiar una comida a otra fecha mediante confirmación.

**Criterio de cierre:** una semana se guarda y restaura correctamente; cambiar cantidades actualiza los totales; las fechas respetan la zona horaria del usuario.

### 5. Importación asistida

- Probar extracción con el documento real anonimizado y elegir proveedor.
- Implementar subida privada, trabajos, validación estructurada y revisión.
- Conectar el resultado confirmado con el plan ya implementado.

**Criterio de cierre:** PDF digital e imagen de prueba producen datos revisables; un error no activa un plan ni pierde correcciones. La captura manual sigue disponible.

### 6. Validación y preparación para uso

- Ejecutar pruebas funcionales, de permisos y accesibilidad de los flujos principales.
- Revisar estados vacíos, fallos de red, reintentos y persistencia.
- Configurar despliegue, migraciones y variables; documentar mantenimiento y eliminación de datos.

**Criterio de cierre:** flujo completo verificado en móvil y escritorio: importar, revisar, crear platillo y planificar una comida. Compilación y pruebas pasan; limitaciones conocidas quedan documentadas.

Este orden permite validar la parte central con datos manuales antes de depender de la extracción automática. Todas las fases anteriores forman parte del MVP solicitado.

## Estrategia de pruebas

- **Cálculo:** fracciones, unidades compatibles e incompatibles, rendimiento, múltiples ingredientes y platillos, precisión decimal, objetivos cero, libres y ausentes.
- **Importación:** documentos incompletos, tablas ambiguas, archivo inválido, fallo del proveedor y correcciones antes de activar.
- **Persistencia:** aislamiento entre usuarios, almacenamiento privado y conservación de versiones.
- **Interfaz:** crear y editar recetas, seleccionar una comida, revisar diferencias y planificar en móvil.
- **Extremo a extremo:** cuenta → plan confirmado → platillo → calendario → recarga con datos conservados.
- **Calidad:** compilación de producción, TypeScript, lint y navegación por teclado. Las pruebas automáticas usarán documentos ficticios y no datos personales.

## Decisiones pendientes y supuestos

- Para diseñar la extracción se necesitará una muestra anonimizada de la hoja; esto no bloquea la base, el plan manual, las recetas ni el calendario.
- Se asumirá inicialmente un plan activo, comidas definidas por el documento y cantidades fraccionarias permitidas.
- No se supondrá que los grupos son los mismos entre nutriólogas ni que una celda vacía significa cero.
- El proveedor de extracción, límites de archivos y costes se decidirán tras la prueba con documentos representativos.
- Autenticación y persistencia se proponen con Supabase; su configuración y el despliegue requerirán acceso a los servicios elegidos cuando se llegue a esas fases.
- No se incluye funcionamiento sin conexión en el MVP.

## Entrega esperada

Aplicación Next.js con consulta del plan, importación revisable, biblioteca de platillos y calendario de comidas; diseño adaptable claro/oscuro; pruebas de los cálculos y flujos críticos; migraciones y documentación de instalación, configuración y despliegue. El desarrollo se realizará en el entorno en la nube del repositorio existente.

## Avance de implementación: primera etapa de frontend

Por indicación del usuario, la lectura de documentos se pospone. La carga inicial real se realizará cuando comparta el listado de alimentos y equivalencias.

Implementado en esta etapa:

- Next.js, TypeScript, navegación adaptable y temas claro/oscuro.
- Consulta de un catálogo demostrativo centralizado en `lib/data.ts` y objetivos editables.
- Creación, edición y eliminación de platillos, ingredientes, rendimiento y preparación.
- Comparación de una ración contra una comida y suma de los platillos planeados por grupo.
- Planificación por fecha y horario, con eliminación de entradas.
- Persistencia local del navegador y pruebas funcionales en móvil y escritorio.

Pendiente: lista real, carga inicial de sus datos, backend, autenticación, sincronización, historial con versiones, edición directa de entradas del calendario, vista semanal y despliegue público. La implementación inicial usa CSS propio y componentes React, sin incorporar todavía Tailwind o shadcn/ui; el diseño y las validaciones avanzadas podrán consolidarse en la siguiente etapa.
