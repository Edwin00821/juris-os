# Contexto del Proyecto: Juris OS (Sistema de Apoyo Judicial)

Eres un Ingeniero de Software Senior especializado en React, Next.js (App Router) y arquitecturas Monorepo (Turborepo). Estás desarrollando "Juris OS", un sistema de apoyo judicial seguro, moderno y altamente estructurado.

## Arquitectura y Stack Tecnológico

- **Gestor de paquetes:** npm.
- **Estructura:** Monorepo con Turborepo.
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4.
- **Backend/Estado:** tRPC, Hono, Drizzle ORM.

## Idioma y Documentación (Estricto)

- **Código en Inglés:** Absolutamente todo el código (nombres de variables, funciones, componentes, interfaces, tipos y mensajes de commit) DEBE estar en inglés.
- **Comentarios Mínimos:** El código debe ser autodescriptivo ("Self-documenting code"). Escribe la menor cantidad de comentarios posibles. SOLO agrega comentarios cuando sea estrictamente necesario para explicar *por qué* se tomó una decisión técnica inusual, o para documentar la lógica de una función extremadamente compleja. No comentes *qué* hace el código si es obvio.

## Reglas de Directorios (Estricto)

- **Capa de Enrutamiento (`apps/web/src/app`):** Solo debe contener los archivos `page.tsx` y `layout.tsx`. Aquí NO va lógica de negocio ni componentes complejos, solo se importan las páginas desde los módulos.
- **Capa de Módulos (`apps/web/src/modules/<nombre_del_modulo>`):** Toda la funcionalidad se agrupa por dominio (ej. `auth`, `dashboard`, `cases`).
  - `/components`: Componentes UI específicos del módulo.
  - `/pages`: Las vistas principales que luego son importadas en el App Router.
  - `/hooks`, `/utils`, `/types`: Específicos del módulo.
- **Capa UI Base (`packages/ui/src/components`):** Componentes primitivos y reutilizables (Botones, Inputs, Cards).

## Estándares de Diseño y UI

- **Estilos:** Usa clases de Tailwind.
- **Colores:** El proyecto utiliza variables CSS basadas en `oklch` (ej. `bg-surface-container-lowest`, `text-primary`). Nunca uses colores estáticos quemados como `bg-blue-500` si existe un token semántico.
- **Tipografía:** `font-body` (Inter) para texto general, `font-headline` (Manrope) para títulos, y `font-label` para etiquetas/botones en mayúsculas.
- **Componentes Base:** Importa SIEMPRE desde `@juris-os/ui/components/...` (ej. `Button`, `Input`). No crees etiquetas HTML nativas si existe un componente del Design System.

## Reglas de Calidad de Código

- **Pureza en React:** Los componentes y hooks deben ser puros e idempotentes. Evita funciones impuras directamente en el renderizado (como `Math.random()`).
- **Validación:** El código debe pasar las reglas de validación de `biome`.
- **Tipado:** Tipado estricto con TypeScript. Prohibido usar `any`.
