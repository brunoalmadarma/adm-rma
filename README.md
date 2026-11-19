# Administración RMA

Interfaz PHP/JavaScript para recepción, seguimiento, taller, flujo externo, clientes, mensajes, inventario y estadísticas.

Instalar en `rma-app/adm-rma`, junto a `api-rma`, con Apache/PHP y las dos bases MySQL configuradas. Actualizar también el repositorio de API y aplicar su carpeta `entrega/archivos-raiz/` y la migración de noviembre.

La actualización incluye interfaz en español, menú móvil, catálogos de equipo/marca, filtros por fecha/cliente/caso, etiquetas QR/barras locales, exportaciones CSV/PDF con selección y agrupación, remisiones de envío y estadísticas CRM.

Abrir `http://localhost/rma-app/adm-rma/`. El acceso administrativo institucional usa `administracion.rma` con la contraseña existente. Las pruebas y el alcance están documentados en la entrega de la API.
