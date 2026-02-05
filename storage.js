/* ==========================================================================
   STORAGE GLOBAL (SALVAR, CARREGAR, EXPORTAR)
   ========================================================================== */
const GLOBAL_KEY = 'bohemian_grimoire_data_v1';
let timeoutId; // Variável global para controlar o Auto-Save

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configura botão de Configurações da Sidebar
    const btnSettings = document.querySelector('.nav-footer .nav-btn');
    if(btnSettings) {
        btnSettings.addEventListener('click', () => {
            const modal = document.getElementById('settings-modal');
            if(modal) modal.classList.remove('hidden');
        });
    }

    // 2. Tenta carregar dados salvos
    loadAllData();

    // 3. Adiciona Listener de Auto-Save em TUDO
    document.body.addEventListener('input', debounceSave);
    document.body.addEventListener('change', debounceSave);
    
    // Salvar também quando clica em botões de seleção (Raça, Classe, etc)
    const observers = ['race-display', 'occupation-display', 'armor-display', 'shield-display'];
    observers.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            new MutationObserver(debounceSave).observe(el, { childList: true, attributes: true });
        }
    });
});

/* --- LÓGICA DE AUTO-SAVE --- */
function debounceSave() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(saveGlobalData, 1000); // Salva 1s após parar de mexer
}

/* --- SALVAR --- */
window.saveGlobalData = function() {
    const data = {
        inputs: {},
        selections: {},
        notes: window.getNotesData ? window.getNotesData() : [],
        weaponsHTML: document.getElementById('weapon-container') ? document.getElementById('weapon-container').innerHTML : '',
        skills: getSkillsState(),
        photo: document.getElementById('char-photo-preview') ? document.getElementById('char-photo-preview').src : ''
    };

    // Coleta inputs
    document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => {
        if(el.id) data.inputs[el.id] = el.value;
    });

    // Coleta seleções
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

    try {
        const data = JSON.parse(raw);

        // 1. Restaura Inputs
        if(data.inputs) {
            for (const [id, value] of Object.entries(data.inputs)) {
                const el = document.getElementById(id);
                if(el && id !== 'current-note-title' && id !== 'current-note-body') {
                    el.value = value;
                }
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
                    
                    const type = id.split('-')[0];
                    const badge = document.getElementById(`${type}-badge`);
                    if(badge && info.bonus) badge.innerText = `+${info.bonus}`;
                }
            }
        }

        // 3. Foto
        if (data.photo && data.photo.startsWith('data:image')) {
            const preview = document.getElementById('char-photo-preview');
            const icon = document.querySelector('.photo-uploader .material-icons-round');
            if(preview) {
                preview.src = data.photo;
                preview.style.display = 'block';
            }
            if (icon) icon.style.display = 'none';
        }

        // 4. Módulos
        if(window.loadNotesFromStorage && data.notes) window.loadNotesFromStorage(data.notes);
        if(data.weaponsHTML && document.getElementById('weapon-container')) {
            document.getElementById('weapon-container').innerHTML = data.weaponsHTML;
        }
        if(data.skills) restoreSkillsState(data.skills);

        // Recalcula Totais
        if(window.recalculateAllBonuses) window.recalculateAllBonuses();
        if(window.updateCombatStats) window.updateCombatStats();

    } catch (e) {
        console.error("Erro ao carregar dados:", e);
    }
}

/* --- HELPER DE PERÍCIAS --- */
function getSkillsState() {
    const state = [];
    document.querySelectorAll('.skill-check').forEach((el, index) => {
        const level = el.getAttribute('data-level');
        const trainEl = document.getElementById(`train-val-${index}`);
        const trainVal = trainEl ? trainEl.innerText : "0";
        state.push({ level: level, train: trainVal });
    });
    return state;
}

function restoreSkillsState(skillsData) {
    skillsData.forEach((item, index) => {
        if(window.toggleSkillProficiency) window.toggleSkillProficiency(index, parseInt(item.level));
        const trainDisplay = document.getElementById(`train-val-${index}`);
        if(trainDisplay) trainDisplay.innerText = item.train;
    });
    if(window.updateSkills) window.updateSkills();
}

/* --- EXPORTAR (JSON) --- */
window.exportData = function() {
    saveGlobalData(); 
    const raw = localStorage.getItem(GLOBAL_KEY);
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grimoire_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/* --- IMPORTAR (JSON) - VERSÃO CORRIGIDA E SEGURA --- */
window.importData = function(input) {
    const file = input.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Tenta ler o JSON
            const json = JSON.parse(e.target.result);

            // Validação simples para evitar arquivos errados
            if (!json.inputs && !json.selections) {
                throw new Error("Arquivo inválido: Estrutura da ficha não encontrada.");
            }

            // Salva e Recarrega
            localStorage.setItem(GLOBAL_KEY, JSON.stringify(json));
            alert("Ficha importada com sucesso!");
            location.reload();

        } catch (err) {
            console.error(err);
            if (err.name === 'QuotaExceededError') {
                alert("Erro: Arquivo muito grande (provavelmente a foto). Remova a foto e tente novamente.");
            } else {
                alert("Erro ao importar: " + err.message);
            }
        } finally {
            // Reseta o input para permitir selecionar o mesmo arquivo novamente se der erro
            input.value = '';
        }
    };
    reader.readAsText(file);
}

/* --- RESETAR TUDO (COM CORREÇÃO DO AUTO-SAVE) --- */
window.resetAllData = function() {
    if(confirm("ATENÇÃO: Isso apagará a ficha, notas e arquivos da biblioteca PERMANENTEMENTE.")) {
        
        // 1. Cancela o Auto-Save pendente para não salvar enquanto apaga
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);

        // 2. Apaga LocalStorage
        localStorage.removeItem(GLOBAL_KEY);

        // 3. Apaga Banco de Arquivos (IndexedDB)
        const req = indexedDB.deleteDatabase("GrimoireLibrary");
        
        req.onsuccess = req.onerror = req.onblocked = function () {
            location.reload();
        };

        // Fallback: Recarrega em 500ms se o banco demorar
        setTimeout(() => location.reload(), 500);
    }
}
