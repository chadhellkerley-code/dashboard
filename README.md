# Sales Analytics Dashboard

Dashboard de ventas en tiempo real construido con React + Recharts.

## Archivos principales

- `src/App.jsx` — Dashboard completo (3 páginas + panel de configuración)
- `src/ConfiguracionNegocio.jsx` — Formulario de configuración del negocio
- `src/GuiaGoogleForm.jsx` — Guía interactiva de setup de Google Sheets

## Instalación

```bash
npm install
npm start
```

## Próximos pasos (con Codex)

1. Conectar Google Sheets API (reemplazar datos de ejemplo)
2. Auth con usuario/contraseña
3. Deploy en Vercel
4. Responsive mobile
5. Auto-refresh con indicador visual
6. Exportar CSV/Excel

## Configuración de Google Sheets

Necesitas 2 hojas públicas:
- **Hoja de Respuestas**: vinculada a tu Google Form (14 columnas)
- **Hoja de Leads**: columna A = nombre, columna D = fecha

Pega las URLs en el panel ⚙️ Configurar dentro del dashboard.
