# Validación de la fase 1

Realizada el 20 de octubre de 2026.

- `npm install`: completado, auditoría reportó cero vulnerabilidades.
- `npm test`: cuatro pruebas aprobadas sobre recuperación, secuencia, duplicados y acceso persistente al regalo tras reiniciar.
- `npm run build`: compilación de producción completada.
- Vista previa local con Vite: portada renderizada en navegador de escritorio, con fuentes y SVG locales.
- Sobre: abre su carta y cambia Mochi de feliz a enamorado.
- Botón principal: abre el diálogo de invitación y coloca el foco en Cerrar.
- Conocer el recorrido: muestra las cinco estaciones e indica su estado de desarrollo.
- Escape: cierra el diálogo y devuelve el foco al botón que lo abrió.

La captura `portada.png` corresponde a esta fase. No se realizó una prueba en teléfono físico ni una auditoría automatizada de accesibilidad. Las reglas responsive y de movimiento reducido están implementadas, pendientes de comprobación en dispositivos. Tampoco se probó el recorrido completo: pertenece a las fases siguientes. No se ha publicado en Vercel.

El aislamiento de Windows bloqueó inicialmente la instalación y los subprocesos de Node/Vite. Instalación, pruebas y compilación se completaron con los permisos solicitados.
