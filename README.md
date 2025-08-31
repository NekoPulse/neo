# Uguu Clone - Plataforma de Subida de Archivos

Una réplica exacta del popular servicio Uguu.se con integración a Supabase Storage para almacenamiento permanente de archivos.

## 🚀 Características

- **Diseño idéntico** al sitio original Uguu.se
- **Subida de archivos** hasta 50MB
- **Almacenamiento permanente** con Supabase Storage
- **Drag & Drop** y selección de archivos
- **Enlaces directos** a los archivos subidos
- **Botones de donación** integrados (Bitcoin, Ethereum, PayPal, Ko-Fi)
- **Responsive design** para móviles y escritorio
- **Modo simulación** cuando Supabase no está configurado

## 📁 Estructura del Proyecto

```
uguu-uploader/
├── index.html              # Página principal
├── style.css               # Estilos (idénticos a Uguu.se)
├── script.js               # Lógica de subida de archivos
├── supabase-config.js      # Configuración de Supabase
└── README.md               # Este archivo
```

## 🛠️ Configuración

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Storage** y crea un bucket llamado `uploads`
4. Configura las políticas de acceso público para el bucket
5. Edita el archivo `supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    anonKey: 'tu-clave-anonima-de-supabase',
    bucketName: 'uploads'
};
```

### 2. Configurar Políticas de Supabase Storage

En el panel de Supabase, ve a **Storage > Policies** y crea estas políticas para el bucket `uploads`:

**Política de INSERT (Subida):**
```sql
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'uploads');
```

**Política de SELECT (Lectura):**
```sql
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');
```

## 🚀 Despliegue en Cloudflare Pages

### Método 1: Desde GitHub

1. Sube el proyecto a un repositorio de GitHub
2. Ve a [Cloudflare Pages](https://pages.cloudflare.com)
3. Conecta tu repositorio
4. Configura el build:
   - **Build command:** (dejar vacío)
   - **Build output directory:** `/`
5. Despliega el proyecto

### Método 2: Upload directo

1. Ve a [Cloudflare Pages](https://pages.cloudflare.com)
2. Selecciona "Upload assets"
3. Arrastra la carpeta del proyecto o selecciona los archivos
4. Configura el dominio personalizado si lo deseas

## 🔧 Uso

1. **Sin configurar Supabase:** La aplicación funcionará en modo simulación
2. **Con Supabase configurado:** Los archivos se subirán realmente y se generarán enlaces permanentes

### Tipos de archivo soportados
- Imágenes: JPG, PNG, GIF, WebP, etc.
- Videos: MP4, WebM, AVI, MOV, etc.

### Límites
- Tamaño máximo: 50MB por archivo
- Almacenamiento: Según tu plan de Supabase

## 🎨 Personalización

### Cambiar límite de tamaño
Edita la variable `MAX_FILE_SIZE` en `script.js`:
```javascript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
```

### Cambiar tipos de archivo permitidos
Edita el atributo `accept` en `index.html`:
```html
<input type="file" accept="image/*,video/*" ...>
```

### Personalizar botones de donación
Edita los enlaces en la sección de donaciones en `index.html`.

## 🐛 Solución de Problemas

### La aplicación no sube archivos
1. Verifica que Supabase esté configurado correctamente
2. Revisa las políticas de Storage en Supabase
3. Comprueba la consola del navegador para errores

### Error de CORS
Asegúrate de que las políticas de Supabase permitan acceso público desde tu dominio.

### Archivos muy grandes
Verifica que el archivo no exceda los 50MB y que tu plan de Supabase soporte el tamaño.

## 📝 Licencia

Este proyecto es una réplica educativa de Uguu.se. Respeta los términos de uso del servicio original.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas:

1. Revisa esta documentación
2. Verifica la configuración de Supabase
3. Consulta la consola del navegador para errores
4. Abre un issue en GitHub

---

**¡Disfruta tu clon de Uguu!** 🎉

