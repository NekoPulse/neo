# 🚀 Guía de Despliegue en Cloudflare Pages

Esta guía te ayudará a desplegar tu clon de Uguu en Cloudflare Pages paso a paso.

## 📋 Requisitos Previos

- Una cuenta de Cloudflare (gratuita)
- Los archivos del proyecto Uguu
- (Opcional) Una cuenta de GitHub para despliegue automático

## 🌐 Método 1: Despliegue Directo (Recomendado)

### Paso 1: Acceder a Cloudflare Pages
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Inicia sesión en tu cuenta
3. Selecciona **Pages** en el menú lateral
4. Haz clic en **Create a project**

### Paso 2: Subir Archivos
1. Selecciona **Upload assets**
2. Arrastra toda la carpeta `uguu-uploader` o selecciona todos los archivos:
   - `index.html`
   - `style.css`
   - `script.js`
   - `supabase-config.js`
   - `README.md`
3. Haz clic en **Deploy site**

### Paso 3: Configurar Dominio
1. Una vez desplegado, ve a **Custom domains**
2. Haz clic en **Set up a custom domain** (opcional)
3. Ingresa tu dominio personalizado
4. Sigue las instrucciones para configurar los DNS

## 🔄 Método 2: Despliegue desde GitHub

### Paso 1: Subir a GitHub
1. Crea un repositorio en GitHub
2. Sube todos los archivos del proyecto
3. Asegúrate de que el repositorio sea público o que Cloudflare tenga acceso

### Paso 2: Conectar con Cloudflare
1. En Cloudflare Pages, selecciona **Connect to Git**
2. Autoriza el acceso a GitHub
3. Selecciona tu repositorio
4. Configura el build:
   - **Project name:** `uguu-clone` (o el nombre que prefieras)
   - **Production branch:** `main`
   - **Build command:** (dejar vacío)
   - **Build output directory:** `/`

### Paso 3: Desplegar
1. Haz clic en **Save and Deploy**
2. Espera a que termine el despliegue
3. Tu sitio estará disponible en la URL proporcionada

## ⚙️ Configuraciones Adicionales

### Variables de Entorno (Opcional)
Si quieres ocultar las credenciales de Supabase:

1. Ve a **Settings > Environment variables**
2. Añade las siguientes variables:
   - `SUPABASE_URL`: Tu URL de Supabase
   - `SUPABASE_ANON_KEY`: Tu clave anónima
3. Modifica `supabase-config.js` para usar estas variables

### Configurar Redirects
Crea un archivo `_redirects` en la raíz del proyecto:
```
/api/* https://tu-proyecto.supabase.co/rest/v1/:splat 200
```

### Headers de Seguridad
Crea un archivo `_headers` en la raíz:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## 🔧 Configuración de Supabase para Producción

### 1. Configurar CORS
En tu proyecto de Supabase:
1. Ve a **Settings > API**
2. En **CORS origins**, añade tu dominio de Cloudflare:
   ```
   https://tu-proyecto.pages.dev
   https://tu-dominio-personalizado.com
   ```

### 2. Configurar Políticas de Storage
Asegúrate de que las políticas permitan acceso desde tu dominio:

```sql
-- Política para subidas
CREATE POLICY "Allow uploads from website" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'uploads' AND
  auth.role() = 'anon'
);

-- Política para acceso público
CREATE POLICY "Public access" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');
```

## 🚀 Optimizaciones para Producción

### 1. Minificar Archivos
Antes de subir, puedes minificar:
- CSS con herramientas online
- JavaScript con herramientas de minificación

### 2. Configurar Cache
Cloudflare automáticamente cachea archivos estáticos, pero puedes configurar reglas personalizadas en **Page Rules**.

### 3. Habilitar Brotli
Cloudflare comprime automáticamente con Brotli para mejor rendimiento.

## 📊 Monitoreo y Analytics

### 1. Web Analytics
1. Ve a **Analytics** en tu proyecto
2. Habilita **Web Analytics**
3. Añade el script a tu `index.html` si lo deseas

### 2. Real User Monitoring
Cloudflare proporciona métricas de rendimiento automáticamente.

## 🔒 Seguridad

### 1. Configurar WAF
En el dashboard de Cloudflare:
1. Ve a **Security > WAF**
2. Configura reglas para proteger contra ataques

### 2. Rate Limiting
Configura límites de velocidad para prevenir abuso:
1. Ve a **Security > Rate Limiting**
2. Crea reglas para limitar subidas por IP

## 🐛 Solución de Problemas

### Error 404 en archivos
- Verifica que todos los archivos se hayan subido correctamente
- Revisa que los nombres de archivo coincidan exactamente

### Problemas de CORS
- Añade tu dominio a la configuración CORS de Supabase
- Verifica que las políticas de Storage estén configuradas

### Sitio no actualiza
- Ve a **Deployments** y fuerza una nueva implementación
- Limpia la cache del navegador

### Errores de Supabase
- Verifica las credenciales en `supabase-config.js`
- Revisa los logs en el panel de Supabase

## 📱 Pruebas

### Antes del despliegue
1. Prueba localmente con `python -m http.server`
2. Verifica que la subida funcione
3. Prueba en diferentes navegadores

### Después del despliegue
1. Prueba la subida de archivos
2. Verifica que los enlaces funcionen
3. Prueba en dispositivos móviles

## 🎉 ¡Listo!

Tu clon de Uguu ahora está desplegado en Cloudflare Pages. El sitio será:
- **Rápido** gracias a la CDN global de Cloudflare
- **Seguro** con HTTPS automático
- **Escalable** para manejar mucho tráfico
- **Gratuito** en el plan básico de Cloudflare

### URLs típicas:
- **Desarrollo:** `https://tu-proyecto.pages.dev`
- **Producción:** `https://tu-dominio-personalizado.com`

¡Disfruta tu nueva plataforma de subida de archivos! 🚀

