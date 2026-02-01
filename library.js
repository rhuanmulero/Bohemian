const dbName = "GrimoireLibrary";
let db;

// Inicializa o banco de dados
const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    console.log("Banco de dados da Biblioteca aberto.");
    renderFileList(); // Renderiza assim que abrir
};

// Upload de Arquivo
document.getElementById('file-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const transaction = db.transaction(["files"], "readwrite");
        const store = transaction.objectStore("files");
        
        const fileData = {
            name: file.name,
            type: file.type,
            data: event.target.result,
            date: new Date().toLocaleDateString()
        };

        const addRequest = store.add(fileData);
        addRequest.onsuccess = () => {
            console.log("Arquivo salvo com sucesso!");
            renderFileList();
        };
    };
    reader.readAsDataURL(file);
});

function renderFileList() {
    const container = document.getElementById('file-list');
    if (!container) return;
    container.innerHTML = '';

    const transaction = db.transaction(["files"], "readonly");
    const store = transaction.objectStore("files");

    store.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            const file = cursor.value;
            const div = document.createElement('div');
            div.className = 'file-item';
            
            const isPDF = file.type.includes('pdf');
            const icon = isPDF ? 'picture_as_pdf' : 'description';

            div.innerHTML = `
                <span class="material-icons-round file-icon">${icon}</span>
                <span class="file-name">${file.name}</span>
                <div class="file-actions">
                    <button class="btn-file-dl" onclick="downloadFile(${file.id})">Baixar</button>
                    <button class="btn-file-del" onclick="deleteFile(${file.id})">Excluir</button>
                </div>
            `;
            container.appendChild(div);
            cursor.continue();
        }
    };
}

window.downloadFile = (id) => {
    const transaction = db.transaction(["files"], "readonly");
    transaction.objectStore("files").get(id).onsuccess = (e) => {
        const file = e.target.result;
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    };
};

let fileToDeleteId = null;

window.deleteFile = (id) => {
    fileToDeleteId = id; // Armazena o ID do arquivo que será deletado
    
    // 1. Mostra o mesmo modal que usamos para as notas
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('hidden');

    // 2. Configura o botão de confirmação dentro do modal
    const confirmBtn = document.getElementById('btn-confirm-delete-action');
    
    confirmBtn.onclick = () => {
        executeFileDeletion();
    };
};

function executeFileDeletion() {
    if (!fileToDeleteId) return;

    const transaction = db.transaction(["files"], "readwrite");
    const store = transaction.objectStore("files");
    
    store.delete(fileToDeleteId).onsuccess = () => {
        console.log("Arquivo removido com sucesso!");
        renderFileList(); // Atualiza a grade visual
        closeConfirmModal(); // Fecha o modal usando a função que já existe
        fileToDeleteId = null; // Reseta a variável
    };
}