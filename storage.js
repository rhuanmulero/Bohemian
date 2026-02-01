/* ==========================================================================
   STORAGE GLOBAL (SALVAR, CARREGAR, EXPORTAR)
   ========================================================================== */
const GLOBAL_KEY = 'bohemian_grimoire_data_v1';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configura botão de Configurações da Sidebar
    const btnSettings = document.querySelector('.nav-footer .nav-btn');
    if(btnSettings) {
        btnSettings.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.remove('hidden');
        });
    }

    // 2. Tenta carregar dados salvos
    loadAllData();

    // 3. Adiciona Listener de Auto-Save em TUDO
    // (Qualquer input que mudar na página dispara o save)
    document.body.addEventListener('input', debounceSave);
    document.body.addEventListener('change', debounceSave);
    
    // Salvar também quando clica em botões de seleção (Raça, Classe, etc)
    // Usamos MutationObserver para detectar mudanças nos textos dos botões
    const observers = ['race-display', 'occupation-display', 'armor-display', 'shield-display'];
    observers.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            new MutationObserver(debounceSave).observe(el, { childList: true, attributes: true });
        }
    });
});

let timeoutId;
function debounceSave() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(saveGlobalData, 1000); // Salva 1s após parar de mexer
}

/* --- SALVAR --- */
window.saveGlobalData = function() {
    const data = {
        // 1. Dados Básicos (Inputs com ID)
        inputs: {},
        // 2. Dados Complexos (Textos dos botões de seleção e seus atributos)
        selections: {},
        // 3. Notas (Pega do notes.js)
        notes: window.getNotesData ? window.getNotesData() : [],
        // 4. Arsenal (Salva o HTML interno da lista de armas)
        weaponsHTML: document.getElementById('weapon-container').innerHTML,
        // 5. Perícias (Salva quais estão treinadas)
        skills: getSkillsState(),
        photo: document.getElementById('char-photo-preview').src 
    };

    // Coleta todos inputs de texto/numero
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => {
        if(el.id) data.inputs[el.id] = el.value;
    });

    // Coleta seleções (Raça, etc)
    const selIds = ['race-display', 'variation-display', 'occupation-display', 'combat-display', 'armor-display', 'shield-display'];
    selIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            data.selections[id] = {
                text: el.innerText,
                key: el.getAttribute('data-key'),
                bonus: el.getAttribute('data-bonus')
            };
        }
    });

    localStorage.setItem(GLOBAL_KEY, JSON.stringify(data));
    console.log("Dados salvos automaticamente.");
}

/* --- CARREGAR --- */
function loadAllData() {
    const raw = localStorage.getItem(GLOBAL_KEY);
    if(!raw) return;

    const data = JSON.parse(raw);

    // 1. Restaura Inputs
    for (const [id, value] of Object.entries(data.inputs)) {
        const el = document.getElementById(id);
        if(el && id !== 'current-note-title' && id !== 'current-note-body') { // Ignora editor de notas
            el.value = value;
        }
    }

    // 2. Restaura Seleções
    if(data.selections) {
        for (const [id, info] of Object.entries(data.selections)) {
            const el = document.getElementById(id);
            if(el) {
                el.innerText = info.text;
                if(info.key) el.setAttribute('data-key', info.key);
                if(info.bonus) el.setAttribute('data-bonus', info.bonus);
                
                // Restaura o badge visual se existir
                const type = id.split('-')[0]; // ex: 'armor'
                const badge = document.getElementById(`${type}-badge`);
                if(badge && info.bonus) badge.innerText = `+${info.bonus}`;
            }
        }
    }
    if (data.photo && data.photo.startsWith('data:image')) {
        const preview = document.getElementById('char-photo-preview');
        const icon = document.querySelector('.photo-uploader .material-icons-round');
        preview.src = data.photo;
        preview.style.display = 'block';
        if (icon) icon.style.display = 'none';
    }

    // 3. Restaura Notas
    if(window.loadNotesFromStorage) {
        window.loadNotesFromStorage(data.notes);
    }

    // 4. Restaura Armas
    if(data.weaponsHTML) {
        document.getElementById('weapon-container').innerHTML = data.weaponsHTML;
    }

    // 5. Restaura Perícias
    if(data.skills) {
        restoreSkillsState(data.skills);
    }


    // Força recalcular tudo (Atributos, Defesa, Vida)
    if(window.recalculateAllBonuses) window.recalculateAllBonuses();
    if(window.updateCombatStats) window.updateCombatStats();
}

/* --- HELPER DE PERÍCIAS --- */
function getSkillsState() {
    const state = [];
    // Varre as perícias (assumindo que a ordem não muda)
    document.querySelectorAll('.skill-check').forEach((el, index) => {
        const level = el.getAttribute('data-level');
        const trainVal = document.getElementById(`train-val-${index}`).innerText;
        state.push({ level: level, train: trainVal });
    });
    return state;
}

function restoreSkillsState(skillsData) {
    skillsData.forEach((item, index) => {
        // Restaura Proficiência
        if(window.toggleSkillProficiency) {
            window.toggleSkillProficiency(index, parseInt(item.level));
        }
        // Restaura Treino Numérico
        const trainDisplay = document.getElementById(`train-val-${index}`);
        if(trainDisplay) trainDisplay.innerText = item.train;
    });
    // Atualiza totais
    if(window.updateSkills) window.updateSkills();
}

/* --- EXPORTAR / IMPORTAR (JSON) --- */
window.exportData = function() {
    saveGlobalData(); // Garante que tá atualizado
    const raw = localStorage.getItem(GLOBAL_KEY);
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bohemian_Grimoire_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.importData = function(input) {
    const file = input.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Validação simples
            JSON.parse(e.target.result); 
            localStorage.setItem(GLOBAL_KEY, e.target.result);
            alert("Ficha importada com sucesso! A página será recarregada.");
            location.reload();
        } catch (err) {
            alert("Erro ao ler arquivo: Formato inválido.");
        }
    };
    reader.readAsText(file);
}

window.resetAllData = function() {
    if(confirm("TEM CERTEZA? Isso apagará toda a ficha e notas deste navegador.")) {
        localStorage.removeItem(GLOBAL_KEY);
        location.reload();
    }
}