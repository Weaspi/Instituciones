# Documentación del proceso — Sistema de Registro Institucional

**Corte de revisión:** 13 de noviembre de 2026  
**Rama revisada:** `test`  
**Último cambio visible en la rama:** 12 de noviembre de 2026 (commit `ff049d30`, mensaje `v20`).  
**Propósito:** dejar constancia del alcance implementado, el estado observado y una estimación de esfuerzo por actividad. Este contenido también puede usarse como guion para una presentación en Canva.

> **Importante sobre los tiempos:** el repositorio no contiene hojas de horas ni registros de duración por tarea. Por tanto, las horas de este documento son una **estimación retrospectiva de esfuerzo de desarrollo**, no horas reales trabajadas ni fechas comprometidas. Deben validarse con el equipo antes de presentarlas como tiempos ejecutados.

## 1. Resumen ejecutivo

En la rama `test` hay una aplicación web de registro de instituciones construida con React, TypeScript, Vite y Tailwind CSS. La aplicación tiene navegación para alta individual, consulta/edición de instituciones y una pantalla de carga masiva. El frontend consume servicios REST para instituciones y catálogos de ubicación.

El flujo de alta individual y la consulta de registros cuentan con integración al API definida en el código. La carga masiva, en cambio, es una **interfaz demostrativa**: presenta pasos y datos de ejemplo, pero no procesa realmente el Excel ni envía registros al API. La revisión se limita al código visible en la rama; no se ejecutó el sistema ni se verificó la disponibilidad del API.

## 2. Alcance y entregables observados

### Implementado en el frontend

- Estructura base del proyecto con React, TypeScript, Vite y Tailwind CSS.
- Diseño general con encabezado, navegación lateral y pie de página con identidad visual institucional.
- Cambio de idioma español/inglés en la interfaz (la traducción no está aplicada a todos los textos).
- Formulario de alta con datos institucionales, tipo nacional/extranjera, clasificación por niveles, país, entidad y municipio, fuente de información y observaciones.
- Autocompletado para catálogos, búsqueda con espera breve (debounce), normalización de texto y carga/caché de catálogos.
- Reglas de interfaz: para instituciones nacionales se fija el país; para extranjeras se limpian/bloquean ciertos campos; se requiere entidad al guardar una institución nacional.
- Consulta de instituciones con búsqueda, filtros de país/tipo, paginación y selección de tamaño de página.
- Edición parcial de registros, confirmación y eliminación mediante llamadas al API.
- Manejo básico de errores de comunicación y estados de carga.
- Pantalla de carga masiva con cinco etapas visuales: plantilla, archivo, validación, revisión y carga.

### Parcial, simulado o pendiente de confirmar

- **Carga masiva:** no se observa descarga funcional de plantilla, lectura/validación del Excel, envío de lote, reporte real ni conexión a API. La pantalla incluye contenido de ejemplo; completar el asistente de pasos no equivale a realizar una carga real.
- **Contacto:** el formulario muestra nombre y correo, pero el payload de alta visible no los incluye. Confirmar con backend si esos campos deben persistirse.
- **Pruebas:** `package.json` define build y lint, pero no se identificó un conjunto de pruebas automatizadas. No se afirma que build/lint o pruebas funcionales hayan pasado.
- **API/ambientes:** el frontend usa una dirección IP privada (`http://172.16.11.22:8000`). Confirmar configuración por ambiente, accesibilidad desde usuarios y requisitos de seguridad antes de publicar.
- **Edición y validaciones:** revisar consistencia de todos los campos entre alta, edición y API; algunos campos del formulario de edición no aparecen en los cambios enviados.
- **Documentación técnica:** el README sigue siendo principalmente el README del template React/Vite; hace falta documentar instalación, configuración, API y operación.

## 3. Proceso realizado hasta el corte

1. **Preparación del proyecto:** se conserva una base React/Vite/TypeScript con dependencias y scripts de desarrollo, build y lint.
2. **Estructura visual:** se implementan componentes reutilizables para layout, encabezado, pie de página, formulario, tabla y modal de confirmación.
3. **Captura individual:** se construye el formulario, sus campos y reglas condicionales para institución nacional/extranjera.
4. **Catálogos:** se conectan países, entidades y municipios a endpoints; se añade carga paginada y caché en memoria.
5. **Integración de instituciones:** se implementan operaciones de consulta, alta, actualización y eliminación mediante solicitudes HTTP.
6. **Consulta y mantenimiento:** se agregan tabla, búsqueda, filtros, paginación, edición y eliminación con confirmación.
7. **Internacionalización y presentación:** se incluyen textos español/inglés y elementos visuales institucionales; la cobertura de traducciones debe completarse.
8. **Carga masiva:** se desarrolla una maqueta navegable del flujo, pendiente de integrar con archivos, reglas de validación y API.
9. **Siguiente etapa recomendada:** completar documentación y pruebas, verificar contratos con backend y cerrar brechas antes de considerar una versión productiva.

## 4. Estimación de esfuerzo por actividad

Las cifras siguientes representan una estimación de horas-persona para construir o completar/revisar las actividades descritas. El rango refleja incertidumbre; no es una medición histórica. Las actividades de validación con backend o usuarios dependen de disponibilidad de terceros.

| Actividad | Estado observado al corte | Estimación | Evidencia/resultado esperado |
|---|---|---:|---|
| Preparación del proyecto y configuración base | Implementado | 4–6 h | React, TypeScript, Vite, Tailwind y scripts de proyecto |
| Estructura de navegación, layout e identidad visual | Implementado | 6–10 h | Encabezado, menú, áreas de contenido y pie |
| Modelo del formulario y captura de datos | Implementado parcialmente | 8–12 h | Campos institucionales, ubicación, clasificación y contacto |
| Reglas condicionales, campos requeridos y normalización | Implementado parcialmente | 6–10 h | Diferencias nacional/extranjera, validación y formato |
| Catálogos de país, entidad y municipio | Implementado | 6–10 h | Consultas, paginación de catálogos y caché |
| Integración de consulta de instituciones | Implementado | 6–10 h | Búsqueda, filtros, paginación y estados de carga/error |
| Alta, edición y eliminación conectadas al API | Implementado parcialmente | 8–14 h | Operaciones HTTP; falta verificar todos los campos y respuestas |
| Internacionalización y revisión de contenido | Parcial | 4–8 h | Completar traducciones y quitar textos fijos inconsistentes |
| Maqueta de carga masiva | Implementada como prototipo | 4–8 h | Asistente visual de cinco pasos con contenido simulado |
| Carga masiva real (plantilla, parseo, validación, envío y reporte) | Pendiente | 24–40 h | Flujo funcional integrado; depende de formato y API acordados |
| Pruebas funcionales, accesibilidad y regresión | Pendiente de evidencia | 12–20 h | Casos de alta/consulta/edición/baja, idiomas y escenarios de error |
| Configuración de ambientes y revisión de integración | Pendiente de confirmar | 6–12 h | URL configurable, CORS, manejo de fallos y verificación con backend |
| Documentación de instalación, operación y mantenimiento | Pendiente/parcial | 4–8 h | README, variables, endpoints, pasos de ejecución y soporte |

**Total orientativo para el alcance listado:** 98–168 horas-persona.  
El rango incluye trabajo ya reflejado en el frontend y tareas pendientes; no debe interpretarse como horas ya consumidas. La suma no contempla tiempos de espera, reuniones, aprobación institucional, cambios de alcance ni trabajo del equipo backend.

## 5. Plan de trabajo sugerido desde el corte

| Fase siguiente | Actividades | Estimación | Criterio de salida |
|---|---|---:|---|
| 1. Alineación funcional y API | Confirmar campos obligatorios, contrato de alta/edición, reglas y formato de Excel | 4–8 h | Reglas y contrato aprobados por responsables |
| 2. Cierre del alta y edición | Persistir campos acordados, completar validaciones y alinear formularios con API | 8–16 h | Alta/edición coherentes y datos verificados |
| 3. Carga masiva real | Plantilla, lectura del archivo, validación, errores, confirmación, envío y reporte | 24–40 h | Lote de prueba procesado correctamente de extremo a extremo |
| 4. Calidad y seguridad de integración | Pruebas, accesibilidad, errores, configuración por ambiente y revisión de API | 12–20 h | Casos críticos aprobados; sin depender de una IP fija en producción |
| 5. Documentación y transferencia | Guía técnica, guía de usuario y sesión de entrega | 4–8 h | Documentación revisada y equipo receptor informado |

**Estimación de trabajo pendiente sugerida:** 52–92 horas-persona, sujeta a confirmación del alcance de carga masiva y del API. Las horas de alineación, QA y entrega pueden variar según disponibilidad de usuarios y backend.

## 6. Riesgos y decisiones que requieren validación

- Confirmar si los endpoints de API están disponibles y qué autenticación, permisos y política CORS aplican.
- Sustituir la dirección IP codificada por configuración por ambiente y validar HTTPS antes de producción.
- Acordar contrato de campos, identificadores y respuestas; revisar los datos de contacto y observaciones.
- Definir límites de Excel: tamaño, número de registros, formatos permitidos, duplicados y estrategia de corrección de errores.
- Definir si los errores de carga deben detener todo el lote o permitir registros válidos parcialmente.
- Completar traducción de textos actualmente fijos y revisar accesibilidad con teclado/lector de pantalla.
- Ejecutar build, lint y pruebas funcionales en un entorno conectado; registrar los resultados en el proyecto.

## 7. Guion listo para Canva

Propuesta de presentación de 8 láminas, basada en este corte y sin presentar las estimaciones como horas históricas:

1. **Portada:** Sistema de Registro Institucional — avance al 13 de noviembre de 2026; rama `test`.
2. **Objetivo:** centralizar altas y consulta de instituciones; simplificar captura y mantenimiento de datos.
3. **Qué existe:** formulario, catálogos, tabla con filtros/paginación, edición/baja y navegación bilingüe parcial.
4. **Flujo del usuario:** captura → validación del formulario → envío al API → consulta y mantenimiento.
5. **Carga masiva:** mostrar los cinco pasos del prototipo y destacar que la integración real está pendiente.
6. **Esfuerzo estimado:** presentar las actividades en rangos y aclarar visiblemente “estimación, no horas registradas”.
7. **Próximos pasos:** acordar API y reglas → completar alta/carga masiva → probar → documentar y transferir.
8. **Riesgos y decisiones:** API/ambientes, campos por persistir, Excel, pruebas y aprobación funcional.

## 8. Referencias de revisión

- Rama: [`test`](https://github.com/Weaspi/Instituciones/tree/test)
- Último commit observado: [`ff049d30`](https://github.com/Weaspi/Instituciones/commit/ff049d30bb0b24499297a278da65700e2b1bee88)
- Componentes principales revisados: `src/App.tsx`, `src/components/FormularioAlta.tsx`, `src/components/TablaInstituciones.tsx`, `src/components/CargaMasiva.tsx`, `src/services/instituciones.ts`, `src/services/catalogos.ts`.

---

**Nota de actualización:** revisar este documento cuando se incorporen nuevos cambios en `test`; actualizar el corte, estado, evidencias y estimaciones con tiempos efectivamente registrados si el equipo comienza a llevarlos.
