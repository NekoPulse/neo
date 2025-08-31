// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto de Supabase

const SUPABASE_CONFIG = {
    url: 'https://xgptcribksljbincffia.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncHRjcmlia3NsamJpbmNmZmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MjMzOTYsImV4cCI6MjA3MjE5OTM5Nn0.5JKb4REp6KUycVLWqM_02jyC7NHM3inS6U3VllL1UnM',
    bucketName: 'uguu'
};

// Función para inicializar Supabase
function initSupabase( ) {
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded. Please include the Supabase CDN script.');
        return null;
    }
    
    return supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}

// Función para subir archivo a Supabase Storage
async function uploadToSupabase(file, onProgress = null) {
    const supabaseClient = initSupabase();
    if (!supabaseClient) {
        throw new Error('No se pudo inicializar Supabase');
    }
    
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;
    
    try {
        // Subir archivo
        const { data, error } = await supabaseClient.storage
            .from(SUPABASE_CONFIG.bucketName)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) {
            throw error;
        }
        
        // Obtener URL pública
        const { data: urlData } = supabaseClient.storage
            .from(SUPABASE_CONFIG.bucketName)
            .getPublicUrl(fileName);
        
        return {
            fileName: fileName,
            url: urlData.publicUrl,
            size: file.size,
            type: file.type
        };
        
    } catch (error) {
        console.error('Error uploading to Supabase:', error);
        throw error;
    }
}

// Función para verificar si el bucket existe
async function checkBucketExists() {
    const supabaseClient = initSupabase();
    if (!supabaseClient) {
        return false;
    }
    
    try {
        const { data, error } = await supabaseClient.storage.listBuckets();
        if (error) {
            console.error('Error checking buckets:', error);
            return false;
        }
        
        return data.some(bucket => bucket.name === SUPABASE_CONFIG.bucketName);
    } catch (error) {
        console.error('Error checking bucket existence:', error);
        return false;
    }
}

// Exportar configuración para uso global
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.uploadToSupabase = uploadToSupabase;
window.checkBucketExists = checkBucketExists;
