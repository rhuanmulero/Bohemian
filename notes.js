/* ==========================================================================
   SISTEMA DE ANOTAÇÕES (MASTER-DETAIL)
   ========================================================================== */
let notes = [];
let activeNoteId = null;

// Paleta de cores sutil (Hex)
const NOTE_COLORS = [
    '#7c3aed', // Roxo (Padrão)
    '#ff6b6b', // Vermelho
    '#4dff88', // Verde
    '#ffd700', // Amarelo
    '#3b82f6', // Azul
    '#e11d48'  // Rosa
];

document.addEventListener('DOMContentLoaded', () => {
    // Carregamento inicial é feito pelo storage.js, 
    // mas configuramos os listeners aqui
    
    document.getElementById('btn-add-note').addEventListener('click', createNote);
    document.getElementById('btn-delete-note').addEventListener('click', deleteActiveNote);
    
    // Listeners de Input (Auto-save)
    document.getElementById('current-note-title').addEventListener('input', (e) => {
        updateActiveNote('title', e.target.value);
    });
    document.getElementById('current-note-body').addEventListener('input', (e) => {
        updateActiveNote('content', e.target.value);
    });

    renderColorPicker();
});

/* --- FUNÇÕES PÚBLICAS (Chamadas pelo Storage) --- */
window.loadNotesFromStorage = function(data) {
    if(Array.isArray(data)) {
        notes = data;
    } else {
        notes = [];
    }
    renderNotesList();
}

window.getNotesData = function() {
    return notes;
}

/* --- LÓGICA CORE --- */
function createNote() {
    const newNote = {
        id: Date.now(),
        title: 'Nova Nota',
        content: '',
        color: NOTE_COLORS[0], // Cor padrão
        date: new Date().toLocaleDateString('pt-BR')
    };
    
    notes.unshift(newNote); // Adiciona no topo
    activeNoteId = newNote.id; // Já seleciona ela
    
    saveGlobalData(); // Chama o Storage para salvar
    renderNotesList();
    loadActiveNote();
}

function deleteActiveNote() {
    if(!activeNoteId) return;

    // 1. Mostra o modal
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('hidden');

    // 2. Configura o botão de confirmação dentro do modal
    const confirmBtn = document.getElementById('btn-confirm-delete-action');
    
    // Usamos onclick direto para garantir que não acumule eventos de cliques anteriores
    confirmBtn.onclick = () => {
        executeDeletion();
    };
}

function executeDeletion() {
    // A lógica real de apagar
    notes = notes.filter(n => n.id !== activeNoteId);
    activeNoteId = null;
    
    saveGlobalData();    // Salva no LocalStorage
    renderNotesList();   // Atualiza a lista lateral
    loadActiveNote();    // Volta para o estado vazio do editor
    closeConfirmModal(); // Fecha o modal
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
}

function updateActiveNote(field, value) {
    if(!activeNoteId) return;
    const note = notes.find(n => n.id === activeNoteId);
    if(note) {
        note[field] = value;
        note.date = new Date().toLocaleDateString('pt-BR'); // Atualiza data
        
        // Atualiza visual da lista em tempo real (apenas título e preview)
        if(field === 'title' || field === 'content') {
            updateListPreview(note.id, field, value);
        }
        
        saveGlobalData(); // Debounce idealmente seria usado aqui
    }
}

function setActiveColor(color) {
    if(!activeNoteId) return;
    const note = notes.find(n => n.id === activeNoteId);
    if(note) {
        note.color = color;
        saveGlobalData();
        renderNotesList(); // Para atualizar a borda colorida na lista
        renderColorPicker(); // Para atualizar a bolinha selecionada
    }
}

/* --- RENDERIZAÇÃO --- */
function renderNotesList() {
    const container = document.getElementById('notes-list');
    container.innerHTML = '';
    
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
        div.style.borderLeftColor = note.color; // A cor sutil na borda
        div.onclick = () => {
            activeNoteId = note.id;
            renderNotesList(); // Re-renderiza para mudar classe active
            loadActiveNote();
        };

        const preview = note.content.slice(0, 30).replace(/\n/g, ' ') + (note.content.length > 30 ? '...' : '');
        
        div.innerHTML = `
            <span class="note-item-title" id="list-title-${note.id}">${note.title || 'Sem Título'}</span>
            <span class="note-item-preview" id="list-preview-${note.id}">${preview || 'Vazio'}</span>
        `;
        container.appendChild(div);
    });
}

function loadActiveNote() {
    const emptyState = document.getElementById('empty-note-state');
    const editor = document.getElementById('active-note-form');
    
    if(!activeNoteId) {
        emptyState.classList.remove('hidden');
        editor.classList.add('hidden');
        return;
    }

    const note = notes.find(n => n.id === activeNoteId);
    if(!note) return;

    emptyState.classList.add('hidden');
    editor.classList.remove('hidden');

    document.getElementById('current-note-title').value = note.title;
    document.getElementById('current-note-body').value = note.content;
    document.getElementById('current-note-date').innerText = note.date || 'Hoje';
    
    renderColorPicker();
}

function updateListPreview(id, field, value) {
    if(field === 'title') {
        const el = document.getElementById(`list-title-${id}`);
        if(el) el.innerText = value || 'Sem Título';
    }
    if(field === 'content') {
        const el = document.getElementById(`list-preview-${id}`);
        if(el) el.innerText = value.slice(0, 30).replace(/\n/g, ' ') + '...';
    }
}

function renderColorPicker() {
    const container = document.getElementById('note-color-picker');
    container.innerHTML = '';
    
    if(!activeNoteId) return;
    const currentNote = notes.find(n => n.id === activeNoteId);

    NOTE_COLORS.forEach(color => {
        const dot = document.createElement('div');
        dot.className = `color-dot ${currentNote.color === color ? 'selected' : ''}`;
        dot.style.backgroundColor = color;
        dot.onclick = () => setActiveColor(color);
        container.appendChild(dot);
    });
}