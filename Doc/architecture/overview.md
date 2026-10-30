# Arquitectura del Sistema - Eventos Vero

## 1. Vision General

La plataforma "V.v Decoracion de eventos y cotillon" implementa una arquitectura desacoplada estructurada en cuatro modulos independientes:

```
/Eventos_Vero
  ├── /Frontend       # Aplicacion Web React + Vite (Publico + Panel Admin escritorio)
  ├── /Movil          # App Movil nativa para el dueno (React Native / Expo en campo)
  ├── /Backend        # DDL, migraciones SQL, esquemas y politicas RLS de Supabase
  ├── /Shared         # Tipos TypeScript y tokens de diseno compartidos
  └── /Doc            # Documentacion tecnica, guias de despliegue y arquitectura
```

## 2. Principios de Desacople

1. **Independencia de Proyectos**:
   - `/Frontend` no emula ni aloja la app movil dentro de marcos web.
   - `/Movil` es un proyecto nativo con Expo en su propio directorio con acceso a hardware (camara).
2. **Cero Hardcoding**:
   - Toda variable de contacto (WhatsApp, llamadas, redes) reside en la tabla `configuracion_negocio`.
3. **Persistencia Unificada**:
   - Supabase como backend BaaS unico (PostgreSQL, Auth y Storage).
