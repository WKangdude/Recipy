# Recipy

Frontend de una aplicación personal para consultar un plan alimenticio, guardar recetas y planificar comidas. Construido con Next.js App Router, React y TypeScript.

## Desarrollo

Requiere Node.js 22 o superior y npm.

```sh
npm ci
npm run dev
```

## Comprobaciones

```sh
npm run typecheck
npm run build
npm test
```

Las pruebas Playwright arrancan el servidor de producción; ejecutar primero `npm run build`. La configuración utiliza Chromium en `/usr/bin/chromium`. Para otro binario, indicar `CHROMIUM_PATH`; alternativamente instalar el navegador compatible con Playwright y ajustar `launchOptions`.

## Funciones disponibles

- Mi día: comidas y resumen de porciones planeadas.
- Mi plan: equivalencias consultables, búsqueda, filtros y objetivos editables por comida.
- Mis platillos: crear, consultar, editar y eliminar recetas con ingredientes, porciones, rendimiento y procedimiento.
- Planificador: elegir fecha y horario, asignar platillos, ajustar raciones y quitar entradas.
- Comparación por grupo con etiquetas de cumplimiento y totales de varios platillos por comida.
- Inventario por alimento, con cantidades físicas y etiquetas de existencias en el catálogo y las recetas.
- Tema claro y oscuro; navegación móvil y diseño adaptable.
- Persistencia local en el navegador mediante `localStorage`.

## Datos y límites de esta etapa

**Todos los alimentos, equivalencias y objetivos iniciales son demostrativos y no constituyen un plan nutricional.** El catálogo se encuentra centralizado en `lib/data.ts` para sustituirlo con la lista real pendiente de recibir. No se implementó lectura de documentos, conforme al alcance actual.

Los ingredientes se capturan en porciones del grupo para la receta completa; el rendimiento indica cuántas raciones produce. La aplicación divide las porciones entre el rendimiento y multiplica por las raciones que se planean comer. El calendario representa intención, no consumo registrado.

Los datos se guardan únicamente en este navegador y origen. No hay cuenta, servidor de datos, sincronización ni copia de seguridad. Borrar los datos del navegador elimina los cambios. Los ejemplos permanecen hasta reemplazarlos; una futura carga real debe incluir migración o reinicio explícito de los datos locales. Editar una receta actualiza también sus cálculos en el calendario: el historial con versiones será parte del backend.

Las fuentes están incluidas en las dependencias y se sirven desde la propia aplicación. No se requieren credenciales para ejecutar este frontend. Consulta `planning.md` para la visión completa, incluyendo las fases futuras de persistencia privada e importación asistida.

## Inventario

Registra o reemplaza la cantidad total de un alimento desde Inventario. Las cantidades se guardan con los datos anteriores, sin borrar recetas ni calendario. Las equivalencias numéricas y unidades están centralizadas en `lib/inventory.ts`; deben actualizarse junto con el catálogo al recibir el plan real.

- Sin registrar: no se ha indicado una cantidad, por lo que no se asume que el alimento esté agotado.
- Sin existencias: cantidad registrada en cero.
- Pronto a acabarse: cantidad positiva que alcanza para menos de tres porciones completas.
- Disponible: alcanza para tres o más porciones.

Ejemplo: 65 g cocidos de pollo / 30 g cocidos por porción = 2.17 porciones; se muestra «Pronto a acabarse». No se convierten cantidades crudas a cocidas ni entre unidades incompatibles. Las existencias se actualizan manualmente: añadir una receta al calendario no representa consumo y no descuenta inventario.
