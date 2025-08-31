// Elementos del DOM
const uploadArea = document.querySelector(".upload-area");
const uploadInput = document.getElementById("upload-input");
const uploadBtn = document.getElementById("upload-btn");
const uploadProgress = document.getElementById("upload-progress");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const fileList = document.getElementById("upload-filelist");

// Límite de tamaño de archivo (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
    initializeEventListeners();
    // No necesitamos checkSupabaseConnection para Catbox
    showMessage("Usando Catbox.moe para subidas de archivos.", "info");
});

function initializeEventListeners() {
    // Click en el área de subida
    uploadArea.addEventListener("click", () => {
        uploadInput.click();
    });

    // Cambio en el input de archivos
    uploadInput.addEventListener("change", handleFileSelect);

    // Eventos de drag and drop
    uploadArea.addEventListener("dragover", handleDragOver);
    uploadArea.addEventListener("dragleave", handleDragLeave);
    uploadArea.addEventListener("drop", handleDrop);

    // Prevenir comportamiento por defecto del navegador
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragOver(e) {
    uploadArea.classList.add("dragover");
}

function handleDragLeave(e) {
    uploadArea.classList.remove("dragover");
}

function handleDrop(e) {
    uploadArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    [...files].forEach((file) => {
        if (validateFile(file)) {
            uploadFile(file);
        }
    });
}

function validateFile(file) {
    // Verificar tamaño
    if (file.size > MAX_FILE_SIZE) {
        showError(`El archivo "${file.name}" excede el límite de 50MB`);
        return false;
    }

    // Verificar tipo de archivo (imágenes y videos)
    const allowedTypes = ["image/", "video/"];
    const isAllowed = allowedTypes.some((type) => file.type.startsWith(type));

    if (!isAllowed) {
        showError(
            `El archivo "${file.name}" no es un tipo de archivo permitido (solo imágenes y videos)`
        );
        return false;
    }

    return true;
}

async function uploadFile(file) {
    try {
        showProgress();

        const formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("fileToUpload", file);

        const response = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error al subir a Catbox: ${response.statusText}`);
        }

        const url = await response.text();

        if (url.startsWith("https://")) {
            addFileToList(file, url);
            hideProgress();
        } else {
            throw new Error(`Respuesta inesperada de Catbox: ${url}`);
        }
    } catch (error) {
        console.error("Error al subir archivo:", error);
        showError(`Error al subir "${file.name}": ${error.message}`);
        hideProgress();
    }
}

function showProgress() {
    uploadProgress.style.display = "block";
    progressFill.style.width = "0%";
    progressText.textContent = "Subiendo...";
}

function updateProgress(percentage) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Subiendo... ${Math.round(percentage)}%`;
}

function hideProgress() {
    setTimeout(() => {
        uploadProgress.style.display = "none";
    }, 1000);
}

function addFileToList(file, url) {
    const fileItem = document.createElement("li");
    fileItem.className = "file-item";

    const fileSize = formatFileSize(file.size);

    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <a href="${url}" target="_blank" class="file-url">Ver archivo</a>
    `;

    fileList.appendChild(fileItem);

    // Animar la entrada
    setTimeout(() => {
        fileItem.style.opacity = "1";
        fileItem.style.transform = "translateY(0)";
    }, 100);
}

function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function showError(message) {
    showMessage(message, "error");
}

function showMessage(message, type = "info") {
    // Crear elemento de mensaje
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;

    const colors = {
        error: "#ff4757",
        success: "#2ed573",
        warning: "#ffa502",
        info: "#3742fa",
    };

    messageDiv.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        text-align: center;
        animation: slideIn 0.3s ease;
        position: relative;
        z-index: 1000;
    `;
    messageDiv.textContent = message;

    // Añadir al DOM
    uploadArea.parentNode.insertBefore(messageDiv, uploadArea.nextSibling);

    // Remover después de 5 segundos (menos tiempo para mensajes de éxito)
    const timeout = type === "success" ? 3000 : 5000;
    setTimeout(() => {
        messageDiv.remove();
    }, timeout);
}

// Estilos CSS adicionales para animaciones
const additionalStyles = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .file-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .error-message {
        animation: slideIn 0.3s ease;
    }
`;

// Añadir estilos adicionales
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
