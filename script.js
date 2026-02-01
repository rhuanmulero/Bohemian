/* ==========================================================================
   1. BANCO DE DADOS (DATA)
   ========================================================================== */
const combatDB = {
    d10: { name: "Combatente", dice: "d10", desc: "Especialista marcial. Focado em técnica, disciplina e aço." },
    d12: { name: "Campeão", dice: "d12", desc: "A força imparável. Tanque, presença esmagadora." },
    d8:  { name: "Trapaceiro", dice: "d8",  desc: "Mobilidade e jogo sujo. Especialista em dano crítico." },
    d6:  { name: "Trunfo", dice: "d6",  desc: "O Wildcard sobrenatural. Frágil fisicamente, mas controla o campo." }
};

const occupationDB = {
    // GRUPO A: MÍDIA
    influencer: { 
        name: "Influencer", 
        skills: ["Persuasão", "Performance"],
        desc: "Habilidade: 'Parceria'. Em qualquer cidade grande, consegue hospedagem ou comida de graça em troca de divulgação. Risco: Localização rastreável." 
    },
    jornalista: { 
        name: "Jornalista", 
        skills: ["Investigação", "Intuição"],
        desc: "Habilidade: 'Fontes Ocultas'. Sabe onde encontrar informações. Tem acesso a arquivos de jornais e contatos no submundo." 
    },
    artista: { 
        name: "Ídolo", 
        skills: ["Performance", "Enganação"],
        desc: "Habilidade: 'Fã Clube'. Pode conjurar uma pequena multidão para criar distração ou bloquear um caminho." 
    },

    // GRUPO B: LEI E CRIME
    detetive: { 
        name: "Detetive", 
        skills: ["Investigação", "Percepção"],
        desc: "Habilidade: 'Cena do Crime'. Ao analisar um local por 1 minuto, reconstrói mentalmente o que aconteceu lá." 
    },
    policial: { 
        name: "Policial", 
        skills: ["Intimidação", "Atletismo"],
        desc: "Habilidade: 'Autoridade'. Civis tendem a obedecer ordens diretas. Tem acesso a frequências de rádio da polícia." 
    },
    criminoso: { 
        name: "Criminoso", 
        skills: ["Furtividade", "Prestidigitação"],
        desc: "Habilidade: 'Rede do Submundo'. Sabe onde comprar armas ilegais e vender itens roubados sem perguntas." 
    },

    // GRUPO C: CIÊNCIA
    medico: { 
        name: "Médico", 
        skills: ["Medicina", "Natureza"],
        desc: "Habilidade: 'Triagem'. Estabiliza aliados morrendo sem teste (Ação). Recupera mais PV em descansos curtos." 
    },
    engenheiro: { 
        name: "Engenheiro", 
        skills: ["Tecnologia", "Pilotagem"], // Pilotagem adaptado para 'Ferramentas' se não houver na lista
        desc: "Habilidade: 'Manutenção'. Conserta veículos e armas. Pode sobrecarregar uma máquina para 200% de eficácia por um turno (quebra depois)." 
    },
    hacker: { 
        name: "Hacker", 
        skills: ["Computação", "Investigação"],
        desc: "Habilidade: 'Backdoor'. Invade sistemas de segurança, clona cartões e apaga registros digitais." 
    },

    // GRUPO D: EXPLORAÇÃO
    navegador: { 
        name: "Navegador", 
        skills: ["Sobrevivência", "Pilotagem"],
        desc: "Habilidade: 'GPS Mental'. Nunca se perde. Preve tempestades com antecedência." 
    },
    cozinheiro: { 
        name: "Cozinheiro", 
        skills: ["Sobrevivência", "Natureza"], // Adaptado: Utensílios não é perícia padrão, mantive Natureza/Sobrevivência
        desc: "Habilidade: 'Banquete de Combate'. Cozinhar no descanso dá PV temporário ou recupera 1 Fôlego extra para o grupo." 
    },
    arqueologo: { 
        name: "Arqueólogo", 
        skills: ["História", "Arcanismo"],
        desc: "Habilidade: 'Decifrar'. Lê línguas mortas e identifica artefatos Namelarios antigos e seus valores." 
    },

    // GRUPO E: ELITE
    nobre: { 
        name: "Nobre", 
        skills: ["Persuasão", "História"],
        desc: "Habilidade: 'Carteirada'. Exige audiência com autoridades ou entra em festas exclusivas pelo sobrenome. Começa com mais dinheiro." 
    },
    politico: { 
        name: "Político", 
        skills: ["Enganação", "Intuição"],
        desc: "Habilidade: 'Imunidade'. Difícil ser preso por crimes menores. Consegue salvo-condutos para viajar." 
    }
};
/* --- RAÇAS (Mantêm bônus de atributo) --- */
const raceDB = {
    humano: { 
        name: "Humano", 
        desc: "Padrão: +1 em tudo. Com Variação: +2 CON, +1 FOR.",
        bonuses: {} // Calculado via lógica especial
    },
    elfo: { 
        name: "Elfo", 
        bonuses: { SAB: 2, DES: 1 }, 
        desc: "Visão Mística e Transe." 
    },
    sereia: { 
        name: "Sereia", 
        bonuses: { FOR: 2, CON: 1 }, 
        desc: "Anfíbio e Mordida/Pele Dura." 
    },
    angeriano: { 
        name: "Angeriano", 
        bonuses: { DES: 2, CAR: 1 }, 
        desc: "Voo e Visão Aguçada." 
    }
};

const variationDB = {
    padrao: { name: "Padrão", bonuses: {}, vant: "Nenhuma", desv: "Nenhum" },
    
    // COLOSSOS
    gigante: { 
        name: "Gigante", 
        bonuses: { FOR: 1, DES: -1 }, 
        vant: "Tamanho Grande e Alcance.", 
        desv: "Alvo Fácil (-furtividade, inimigos tem vantagem)." 
    },
    troll: { 
        name: "Troll", 
        bonuses: { CON: 1, INT: -1 }, 
        vant: "Regeneração de PV por turno.", 
        desv: "Vulnerabilidade a Fogo e Ácido." 
    },
    oni: { 
        name: "Oni", 
        bonuses: { FOR: 1, SAB: -1 }, 
        vant: "Pele de Ferro (CA Natural).", 
        desv: "Código de Honra (Duelos obrigatórios)." 
    },
    anao: { 
        name: "Anão", 
        bonuses: { CON: 1, DES: -1 }, 
        vant: "Resiliência a Magia e Veneno.", 
        desv: "Deslocamento reduzido (7,5m)." 
    },

    // SOMBRIOS
    vampiro: { 
        name: "Vampiro", 
        bonuses: { CAR: 1, CON: -1 }, 
        vant: "Dreno Vital (Recupera PV ao morder).", 
        desv: "Enfraquecem na Luz Solar." 
    },
    lobisomem: { 
        name: "Lobisomem", 
        bonuses: { FOR: 1, INT: -1 }, 
        vant: "Transformação Híbrida (1x dia).", 
        desv: "Vulnerabilidade a Prata." 
    },
    kitsune: { 
        name: "Kitsune", 
        bonuses: { INT: 1, CON: -1 }, 
        vant: "Ilusões gratuitas.", 
        desv: "Constituição Frágil (-PV por nível)." 
    },

    // EXÓTICOS
    bestial: { 
        name: "Bestial", 
        bonuses: { DES: 1, CAR: -1 }, 
        vant: "Ataques com dano Elétrico.", 
        desv: "Instinto Primal (Vuln. a Medo/Provocação)." 
    },
    draconato: { 
        name: "Draconato", 
        bonuses: { FOR: 1, SAB: -1 }, 
        vant: "Sopro Elemental (Área).", 
        desv: "Sangue Frio (Lentos se levarem dano de Gelo)." 
    },
    quimera: { 
        name: "Quimera", 
        bonuses: { CON: 1, INT: -1 }, 
        vant: "2 Traços de Insolitude.", 
        desv: "Fome insaciável (Exaustão se não comer muito)." 
    },
    membros_longos: { 
        name: "Membros Longos", 
        bonuses: { DES: 1, CON: -1 }, 
        vant: "Alcance maior.", 
        desv: "Desajeitados em locais apertados." 
    },

    // ESPECIAIS
    matreon: { 
        name: "Matreon", 
        bonuses: { INT: 1, SAB: -1 }, 
        vant: "Imune a doenças e venenos.", 
        desv: "Magia de cura tem 50% de eficácia." 
    },
    olhos_negros: { 
        name: "Olhos Negros", 
        bonuses: { DES: 1, CAR: -1 }, 
        vant: "Instinto Assassino (Crítico 16-20 ou Crítico x2).", 
        desv: "Sedento (Chance de atacar aliados ao matar inimigo)." 
    },
    hibrido: { 
        name: "Híbrido", 
        bonuses: { ALL: 0 }, // Especial
        vant: "Herança passiva da 2ª raça.", 
        desv: "Sem vantagem social de nenhuma raça." 
    }
};


const weaponDB = {
    "lamina_leve":    { name: "Lâmina Leve",    dmg: "1d6" },
    "lamina_media":   { name: "Lâmina Média",   dmg: "1d8" },
    "lamina_pesada":   { name: "Lâmina Pesada",   dmg: "1d10" },
    "impacto_pesado": { name: "Impacto Pesado", dmg: "1d12" },
    "haste":          { name: "Haste",          dmg: "1d10" },
    "pistola":        { name: "Pistola",        dmg: "1d8" },
    "escopeta":       { name: "Escopeta",       dmg: "2d8" },
    "rifle":          { name: "Rifle Assalto",  dmg: "1d10" },
    "sniper":         { name: "Sniper",         dmg: "1d12" }
};

const attributes = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];
const skillsList = [
    { name: "Acrobacia", attr: "DES" },
    { name: "Adestramento", attr: "SAB" },
    { name: "Arcanismo", attr: "INT" },
    { name: "Atletismo", attr: "FOR" },
    { name: "Atuação", attr: "CAR" },
    { name: "Enganação", attr: "CAR" },
    { name: "Engenharia", attr: "INT" },
    { name: "Furtividade", attr: "DES" },
    { name: "História", attr: "INT" },
    { name: "Intimidação", attr: "CAR" },
    { name: "Intuição", attr: "SAB" },
    { name: "Investigação", attr: "INT" },
    { name: "Medicina", attr: "SAB" },
    { name: "Natureza", attr: "INT" },
    { name: "Percepção", attr: "SAB" },
    { name: "Performance", attr: "CAR" },
    { name: "Pilotagem", attr: "DES" },
    { name: "Pompitologia", attr: "INT" },
    { name: "Pontaria", attr: "DES" },
    { name: "Prestidigitação", attr: "DES" },
    { name: "Religião", attr: "INT" },
    { name: "Sobrevivência", attr: "SAB" }
];

/* --- BANCO DE DADOS: ARMADURAS E ESCUDOS --- */
const armorDB = {
    civil: { 
        name: "Roupas Civis", 
        bonus: 0, 
        desc: "Sem proteção adicional. Máxima mobilidade.", 
        vant: "Nenhuma", desv: "Nenhum" 
    },
    couro: { 
        name: "Jaqueta de Couro", 
        bonus: 1, 
        desc: "Couro reforçado ou sintético resistente. Comum entre motociclistas e arruaceiros.", 
        vant: "Estilosa e discreta.", desv: "Proteção mínima contra tiros." 
    },
    kevlar: { 
        name: "Colete Kevlar", 
        bonus: 2, 
        desc: "Colete balístico leve, pode ser usado por baixo de casacos.", 
        vant: "Protege órgãos vitais.", desv: "Esquenta e limita levemente o tronco." 
    },
    tatico: { 
        name: "Traje Tático", 
        bonus: 3, 
        desc: "Equipamento militar completo com ombreiras e caneleiras.", 
        vant: "Muitos bolsos e suporte para armas.", desv: "Chama muita atenção socialmente." 
    },
    choque: { 
        name: "Armadura de Choque", 
        bonus: 4, 
        desc: "Pesada, feita de placas de cerâmica e polímero.", 
        vant: "Alta resistência a impacto.", desv: "Desvantagem em Furtividade (-2)." 
    },
    exo: { 
        name: "Exo-Protótipo", 
        bonus: 5, 
        desc: "Estrutura mecânica experimental roubada ou comprada no mercado negro.", 
        vant: "Aumenta capacidade de carga.", desv: "Necessita de baterias (Cargas)." 
    }
};

const shieldDB = {
    nenhum: { 
        name: "Nenhum", 
        bonus: 0, 
        desc: "Mãos livres para armas de duas mãos ou interações.", 
        vant: "-", desv: "-" 
    },
    bracelete: { 
        name: "Bracelete Arcano", 
        bonus: 1, 
        desc: "Metal gravado com runas ou reforçado tecnologicamente.", 
        vant: "Não ocupa a mão.", desv: "Proteção leve." 
    },
    polimero: { 
        name: "Escudo Tático", 
        bonus: 2, 
        desc: "Escudo transparente de polímero usado por forças especiais.", 
        vant: "Cobertura móvel.", desv: "Ocupa uma mão." 
    },
    torre: { 
        name: "Escudo de Torre", 
        bonus: 3, 
        desc: "Uma parede de metal móvel.", 
        vant: "Pode fornecer cobertura total.", desv: "Reduz deslocamento pela metade." 
    }
};

/* ==========================================================================
   2. ESTADO GLOBAL
   ========================================================================== */
let activeBonuses = { FOR:0, DES:0, CON:0, INT:0, SAB:0, CAR:0 };
let currentSelectionContext = null;
let tempSelectionValue = null;
let lastAppliedVariationSkill = null; // Para remover a perícia se trocar a variação

/* ==========================================================================
   3. INICIALIZAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    renderAttributes();
    renderSkills();
    initWeaponOptions();
    setupNavigation();
    
    const btnAddWeapon = document.getElementById('btn-add-weapon');
    if(btnAddWeapon) {
        btnAddWeapon.addEventListener('click', window.openWeaponModal);
    }
    const domSelect = document.getElementById('hybrid-dom');
    const recSelect = document.getElementById('hybrid-rec');
    
    if(domSelect) domSelect.addEventListener('change', recalculateAllBonuses);
    if(recSelect) recSelect.addEventListener('change', recalculateAllBonuses);
});

/* ==========================================================================
   4. SISTEMA DE ATRIBUTOS E BÔNUS
   ========================================================================== */
function renderAttributes() {
    const container = document.querySelector('.attributes-grid');
    if(!container) return;
    container.innerHTML = '';
    
    attributes.forEach(attr => {
        const card = document.createElement('div');
        card.className = 'attr-card';
        card.innerHTML = `
            <span class="attr-label">${attr}</span>
            <div style="position:relative; width:100%; display:flex; justify-content:center;">
                <input type="number" id="attr-${attr}" class="attr-input" value="10" min="0" oninput="window.handleAttrChange('${attr}')">
                <span id="bonus-display-${attr}" class="attr-racial-bonus" style="display:none">+0</span>
            </div>
            <div id="mod-${attr}" class="attr-mod-badge">+0</div>
        `;
        container.appendChild(card);
    });
    updatePointBuy();
}

window.handleAttrChange = function(attr) {
    updatePointBuy();
}

function updatePointBuy() {
    let totalSpent = 0;
    const maxPoints = 60;

    attributes.forEach(attr => {
        const input = document.getElementById(`attr-${attr}`);
        const modDisplay = document.getElementById(`mod-${attr}`);
        const bonusDisplay = document.getElementById(`bonus-display-${attr}`);
        
        let baseVal = parseInt(input.value);
        if (isNaN(baseVal)) baseVal = 0;
        totalSpent += baseVal;

        const racialBonus = activeBonuses[attr] || 0;
        
        if (racialBonus > 0) {
            bonusDisplay.style.display = 'block';
            bonusDisplay.innerText = `+${racialBonus}`;
        } else {
            bonusDisplay.style.display = 'none';
        }

        const finalValue = baseVal + racialBonus;
        const mod = finalValue - 10;

        modDisplay.innerText = (mod >= 0 ? "+" : "") + mod;
        modDisplay.style.backgroundColor = mod < 0 ? "#ff4d4d" : "var(--primary)";
    });

    const remaining = maxPoints - totalSpent;
    const remainingEl = document.getElementById('points-remaining');
    if(remainingEl) {
        remainingEl.innerText = remaining;
        if(remaining < 0) remainingEl.style.color = "#ff4d4d";
        else if(remaining === 0) remainingEl.style.color = "#4dff88";
        else remainingEl.style.color = "var(--primary)";
    }

    updateSkills();
    updateCombatStats();
    
}

/* ==========================================================================
   CALCULO DE VIDA (CON * 1.5)
   ========================================================================== */
function updateMaxHP() {
    const conInput = document.getElementById('attr-CON');
    if (!conInput) return;

    // Pega o valor base do input
    let baseCon = parseInt(conInput.value) || 0;
    
    // Pega o bônus racial que já foi calculado na variável global
    let racialBonus = activeBonuses['CON'] || 0;
    
    // Valor Total de Constituição
    let totalCon = baseCon + racialBonus;

    // Fórmula: CON * 1.5 (Arredondado para baixo)
    let maxHP = Math.floor(totalCon * 1.5);

    // Atualiza na tela
    const hpDisplay = document.getElementById('hp-display');
    if(hpDisplay) {
        hpDisplay.innerText = maxHP;
    }
}

/* ==========================================================================
   5. PERÍCIAS
   ========================================================================== */
function renderSkills() {
    const container = document.getElementById('skills-container');
    if(!container) return;
    container.innerHTML = '';
    
    skillsList.forEach((skill, index) => {
        const div = document.createElement('div');
        div.className = 'skill-row';
        div.innerHTML = `
            <div style="display:flex; align-items:center;">
                <div class="skill-check" id="check-skill-${index}" data-level="0" onclick="window.toggleSkillProficiency(${index})">
                    <span class="skill-indicator"></span>
                </div>
                <span class="skill-name">${skill.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap: 8px;">
                <span class="skill-attr">${skill.attr}</span>
                <div class="train-controls">
                    <button class="btn-train minus" onclick="window.changeTraining(${index}, -1)">-</button>
                    <span class="train-val" id="train-val-${index}">0</span>
                    <button class="btn-train plus" onclick="window.changeTraining(${index}, 1)">+</button>
                </div>
                <span class="skill-total" id="total-skill-${index}">+0</span>
            </div>
        `;
        container.appendChild(div);
    });
    updateSkills();
}

// Suporta forceSet para auto-aplicar perícia de variação
window.toggleSkillProficiency = function(index, forceSet = null) {
    const check = document.getElementById(`check-skill-${index}`);
    if(!check) return;

    let level = parseInt(check.getAttribute('data-level')) || 0;
    
    if (forceSet !== null) {
        level = forceSet;
    } else {
        level = (level + 1) % 3;
    }

    check.setAttribute('data-level', level);
    check.className = `skill-check ${level === 1 ? 'trained' : (level === 2 ? 'expert' : '')}`;
    updateSkills();
}

window.changeTraining = function(index, amount) {
    const display = document.getElementById(`train-val-${index}`);
    let current = parseInt(display.innerText) || 0;
    current = Math.max(0, current + amount);
    display.innerText = current;
    updateSkills();
}

function updateSkills() {
    const mods = {};
    attributes.forEach(attr => {
        const base = parseInt(document.getElementById(`attr-${attr}`).value) || 0;
        const racial = activeBonuses[attr] || 0;
        mods[attr] = (base + racial) - 10;
    });

    const profBonus = 2; 

    skillsList.forEach((skill, index) => {
        const check = document.getElementById(`check-skill-${index}`);
        const trainDisplay = document.getElementById(`train-val-${index}`);
        const totalDisplay = document.getElementById(`total-skill-${index}`);
        
        if(check && totalDisplay) {
            const profLevel = parseInt(check.getAttribute('data-level')) || 0;
            const trainBonus = parseInt(trainDisplay.innerText) || 0;
            
            let total = mods[skill.attr] + trainBonus;
            if (profLevel === 1) total += profBonus;
            if (profLevel === 2) total += (profBonus * 2);
            
            totalDisplay.innerText = (total >= 0 ? "+" : "") + total;
            totalDisplay.style.color = (profLevel > 0 || trainBonus > 0) ? "var(--primary)" : "#fff";
        }
    });
}

/* ==========================================================================
   6. MODAL E LÓGICA DE SELEÇÃO
   ========================================================================== */
window.openSelectionModal = function(context) {
    currentSelectionContext = context;
    const list = document.getElementById('modal-list-container');
    
    // Limpa a lista anterior
    list.innerHTML = '';
    
    // Define o Título do Modal
    const titleMap = {
        combat: "DADO DE COMBATE",
        occupation: "OCUPAÇÃO",
        race: "RAÇA",
        variation: "VARIAÇÃO",
        armor: "ARMADURA",
        shield: "ESCUDO / ACESSÓRIO"
    };
    document.getElementById('modal-selection-title').innerText = titleMap[context] || context.toUpperCase();
    
    // Seleciona o Banco de Dados correto
    let db = {};
    if(context === 'combat') db = combatDB;
    if(context === 'occupation') db = occupationDB;
    if(context === 'race') db = raceDB;
    if(context === 'variation') db = variationDB;
    if(context === 'armor') db = armorDB;   // NOVO
    if(context === 'shield') db = shieldDB; // NOVO

    // Gera a lista de opções
    for (const [key, data] of Object.entries(db)) {
        const div = document.createElement('div');
        div.className = 'selection-option';
        div.innerText = data.name;
        
        div.onclick = () => {
            tempSelectionValue = key;
            
            // Visual de seleção na lista
            document.querySelectorAll('.selection-option').forEach(e => e.classList.remove('selected'));
            div.classList.add('selected');
            
            // Preenche os Detalhes (Lado Direito do Modal)
            document.getElementById('detail-title').innerText = data.name;
            document.getElementById('detail-desc').innerText = data.desc || "";
            
            let html = "";
            
            // 1. Exibe Bônus de Atributos (Raça/Variação)
            if(data.bonuses) {
                const b = Object.entries(data.bonuses)
                    .filter(([k, v]) => v !== 0)
                    .map(([k,v]) => `${k} ${v > 0 ? '+' : ''}${v}`)
                    .join(', ');
                if(b) html += `<span class="stat-badge">${b}</span>`;
            }

            // 2. Exibe Bônus de Defesa (Armadura/Escudo) - NOVO
            if (data.bonus !== undefined) {
                // Cria um badge verde específico para defesa
                html += `<span class="stat-badge" style="border-color:#4dff88; color:#4dff88; background:rgba(77, 255, 136, 0.1);">DEFESA +${data.bonus}</span>`;
            }

            // 3. Exibe Vantagens e Desvantagens
            if(data.vant && data.vant !== "Nenhuma") {
                html += `<div style="margin-top:15px; color:#4dff88; font-size:0.9rem;"><strong>Vantagem:</strong> ${data.vant}</div>`;
            }
            if(data.desv && data.desv !== "Nenhum") {
                html += `<div style="margin-top:5px; color:#ff4d4d; font-size:0.9rem;"><strong>Desvantagem:</strong> ${data.desv}</div>`;
            }
            
            document.getElementById('detail-stats').innerHTML = html;
        };
        list.appendChild(div);
    }
    
    document.getElementById('selection-modal').classList.remove('hidden');
    document.getElementById('btn-confirm-selection').onclick = confirmSelection;
}

function confirmSelection() {
    if (!tempSelectionValue) return;

    // 1. Identifica o Banco de Dados
    const dbs = {
        race: raceDB,
        variation: variationDB,
        occupation: occupationDB,
        combat: combatDB,
        armor: armorDB,   // NOVO
        shield: shieldDB  // NOVO
    };
    const db = dbs[currentSelectionContext];
    const selectedData = db[tempSelectionValue];

    // 2. Atualiza o Texto Principal do Botão
    const displayElement = document.getElementById(`${currentSelectionContext}-display`);
    if (displayElement) {
        displayElement.innerText = selectedData.name;
        displayElement.setAttribute('data-key', tempSelectionValue);

        // NOVO: Atualiza o Badge de Bônus (ex: o "+2" verde dentro do botão)
        if (selectedData.bonus !== undefined) {
            // Salva o valor numérico num atributo para facilitar a conta depois
            displayElement.setAttribute('data-bonus', selectedData.bonus);
            
            // Atualiza o visual do badge
            const badgeElement = document.getElementById(`${currentSelectionContext}-badge`);
            if (badgeElement) {
                badgeElement.innerText = `+${selectedData.bonus}`;
            }
        }
    }

    // 3. Lógica Específica de Perícia (Variação)
    if (currentSelectionContext === 'variation') {
        if (lastAppliedVariationSkill) {
            const oldIndex = skillsList.findIndex(s => s.name === lastAppliedVariationSkill);
            if (oldIndex !== -1) window.toggleSkillProficiency(oldIndex, 0);
        }
        if (selectedData.skillBonus) {
            const newIndex = skillsList.findIndex(s => s.name === selectedData.skillBonus);
            if (newIndex !== -1) {
                window.toggleSkillProficiency(newIndex, 1);
                lastAppliedVariationSkill = selectedData.skillBonus;
            }
        } else {
            lastAppliedVariationSkill = null;
        }
    }

    // 4. Dispara os Cálculos
    // Se mudou raça/variação, recalcula atributos
    if (currentSelectionContext === 'race' || currentSelectionContext === 'variation') {
        recalculateAllBonuses(); 
    }
    
    // Sempre recalcula stats de combate (pois Defesa pode ter mudado)
    updateCombatStats(); 
    
    closeSelectionModal();
}

function recalculateAllBonuses() {
    activeBonuses = { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };

    const raceKey = document.getElementById('race-display').getAttribute('data-key');
    const varKey = document.getElementById('variation-display').getAttribute('data-key');

    if (!raceKey) return;

    let finalRaceKey = raceKey;
    let recessiveRaceKey = null;

    // --- REGRA ESPECIAL: HÍBRIDO (Loteria Genética) ---
    if (varKey === 'hibrido') {
        // Pega as raças dos selects
        finalRaceKey = document.getElementById('hybrid-dom').value;
        recessiveRaceKey = document.getElementById('hybrid-rec').value;
    }

    // --- APLICAÇÃO DE ATRIBUTOS BASE DA RAÇA (OU DOMINANTE) ---
    if (finalRaceKey === 'humano') {
        // Regra do Humano: Se tiver variação (incluindo híbrido), ganha +2 CON +1 FOR
        if (varKey === 'padrao') {
            attributes.forEach(a => activeBonuses[a] += 1);
        } else {
            activeBonuses.CON += 2;
            activeBonuses.FOR += 1;
        }
    } else {
        // Outras raças pegam bônus normal
        const rb = raceDB[finalRaceKey].bonuses;
        for (const [attr, val] of Object.entries(rb)) {
            activeBonuses[attr] += val;
        }
    }

    // --- BÔNUS DA VARIAÇÃO (+1 / -1) ---
    if (varKey && varKey !== 'padrao' && varKey !== 'hibrido') {
        const vb = variationDB[varKey].bonuses;
        for (const [attr, val] of Object.entries(vb)) {
            activeBonuses[attr] += val;
        }
    }

    // --- ATUALIZAÇÃO DA INTERFACE DE INFO ---
    updateGeneticsInfo(varKey, finalRaceKey, recessiveRaceKey);
    updatePointBuy();
}

function updateGeneticsInfo(varKey, domKey, recKey) {
    const infoBox = document.getElementById('race-info');
    if (!infoBox) return;

    if (varKey === 'hibrido') {
        const domName = raceDB[domKey].name;
        const recName = raceDB[recKey].name;
        infoBox.innerHTML = `
            <div style="color: var(--primary); font-weight: bold; margin-bottom: 5px;">Híbrido: ${domName} + ${recName}</div>
            <div style="font-size: 0.85rem; line-height: 1.4;">
                <span style="color: #4dff88;">• Fisiologia (Atributos):</span> ${domName}<br>
                <span style="color: #7c3aed;">• Poder Herdado:</span> Você possui a Habilidade Principal de <strong>${recName}</strong>, substituindo a de ${domName}.
            </div>
        `;
    } else if (varKey && varKey !== 'padrao') {
        const data = variationDB[varKey];
        infoBox.innerHTML = `
            <div style="margin-bottom: 5px; color: #4dff88;"><strong>Vantagem:</strong> ${data.vant}</div>
            <div style="color: #ff4d4d;"><strong>Desvantagem:</strong> ${data.desv}</div>
        `;
    } else {
        infoBox.innerHTML = "Selecione uma variação para ver os detalhes.";
    }
}

/* ==========================================================================
   INICIALIZAÇÃO (IMPORTANTE)
   ========================================================================== */
// No seu DOMContentLoaded ou no final do arquivo, garanta que o 
// Humano e o Padrão tenham a data-key correta por padrão:

document.getElementById('race-display').setAttribute('data-key', 'humano');
document.getElementById('variation-display').setAttribute('data-key', 'padrao');

function recalculateAllBonuses() {
    // 1. Zera os bônus atuais
    activeBonuses = { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 };

    const raceName = document.getElementById('race-display').innerText;
    const raceKey = Object.keys(raceDB).find(k => raceDB[k].name === raceName);
    
    const varName = document.getElementById('variation-display').innerText;
    const varKey = Object.keys(variationDB).find(k => variationDB[k].name === varName);

    if (!raceKey) return;

    // --- LÓGICA ESPECIAL PARA HUMANOS ---
    if (raceKey === 'humano') {
        if (varKey === 'padrao') {
            // Humano Padrão: +1 em Tudo
            attributes.forEach(a => activeBonuses[a] += 1);
        } else {
            // Humano com Variação: +2 CON, +1 FOR
            activeBonuses.CON += 2;
            activeBonuses.FOR += 1;
        }
    } else {
        // Outras Raças: Bônus normais do raceDB
        const b = raceDB[raceKey].bonuses;
        for (const [attr, val] of Object.entries(b)) {
            activeBonuses[attr] += val;
        }
    }

    // --- BÔNUS DA VARIAÇÃO (+1 / -1) ---
    if (varKey && varKey !== 'padrao') {
        const vb = variationDB[varKey].bonuses;
        for (const [attr, val] of Object.entries(vb)) {
            if (activeBonuses[attr] !== undefined) {
                activeBonuses[attr] += val;
            }
        }
    }

    // --- ATUALIZA OBSERVAÇÃO NA FICHA ---
    updateGeneticsInfo(varKey);

    updatePointBuy(); // Atualiza a UI dos atributos
}

function updateGeneticsInfo(varKey) {
    const infoBox = document.getElementById('race-info');
    if (!infoBox) return;

    if (!varKey || varKey === 'padrao') {
        infoBox.innerHTML = "Selecione uma variação para ver os detalhes.";
        return;
    }

    const data = variationDB[varKey];
    infoBox.innerHTML = `
        <div style="margin-bottom: 5px; color: #4dff88;"><strong>Vantagem:</strong> ${data.vant}</div>
        <div style="color: #ff4d4d;"><strong>Desvantagem:</strong> ${data.desv}</div>
    `;
}


window.closeSelectionModal = function() {
    document.getElementById('selection-modal').classList.add('hidden');
}

/* ==========================================================================
   7. ARMAS & UTILS
   ========================================================================== */
window.openWeaponModal = () => document.getElementById('weapon-modal').classList.remove('hidden');
window.closeWeaponModal = () => document.getElementById('weapon-modal').classList.add('hidden');

window.initWeaponOptions = function() {
    const sel = document.getElementById('modal-weapon-type');
    if(!sel) return;
    sel.innerHTML = '<option value="" disabled selected>Selecione...</option>';
    for(const [key, val] of Object.entries(weaponDB)) {
        sel.innerHTML += `<option value="${key}">${val.name}</option>`;
    }
}

window.previewModalDamage = function() {
    const type = document.getElementById('modal-weapon-type').value;
    const qual = document.getElementById('modal-weapon-quality').value;
    const display = document.getElementById('modal-weapon-dmg');
    if(!type) return;
    let dmg = weaponDB[type].dmg;
    if(qual === 'obra_prima') dmg += " + 1";
    display.innerText = dmg;
}

window.confirmAddWeapon = function() {
    const name = document.getElementById('modal-weapon-name').value || "Arma";
    const type = document.getElementById('modal-weapon-type').value;
    const dmg = document.getElementById('modal-weapon-dmg').innerText;
    if(!type) return;
    const div = document.createElement('div');
    div.className = 'weapon-card-display';
    div.innerHTML = `
        <div class="wc-info">
            <span class="wc-name">${name}</span>
            <div class="wc-meta">${weaponDB[type].name}</div>
        </div>
        <div style="display:flex; align-items:center;">
            <div class="wc-dmg">${dmg}</div>
            <button class="btn-del" onclick="this.closest('.weapon-card-display').remove()">
                <span class="material-icons-round">delete</span>
            </button>
        </div>
    `;
    document.getElementById('weapon-container').appendChild(div);
    closeWeaponModal();
}

window.showPowerForm = function(type, btn) {
    document.querySelectorAll('.p-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.power-form').forEach(f => f.classList.add('hidden'));
    document.getElementById(`form-${type}`).classList.remove('hidden');
}

function setupNavigation() {
    document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.getAttribute('data-tab'));
            if(target) target.classList.add('active');
        });
    });
}

/* ==========================================================================
   CÁLCULO DE STATUS DE COMBATE (ATUALIZADO)
   ========================================================================== */
function updateCombatStats() {
    const conInput = document.getElementById('attr-CON');
    const sabInput = document.getElementById('attr-SAB');
    const desInput = document.getElementById('attr-DES');

    const totalCON = (parseInt(conInput?.value) || 0) + (activeBonuses['CON'] || 0);
    const totalSAB = (parseInt(sabInput?.value) || 0) + (activeBonuses['SAB'] || 0);
    const totalDES = (parseInt(desInput?.value) || 0) + (activeBonuses['DES'] || 0);

    const maxHP = Math.floor(totalCON * 1.5);
    const maxStamina = totalCON;
    const maxNamel = Math.floor(totalSAB * 1.25);

    // Atualiza os textos de exibição (/ 20)
    document.getElementById('hp-max').innerText = "/ " + maxHP;
    document.getElementById('stamina-max').innerText = "/ " + maxStamina;
    document.getElementById('namel-max').innerText = "/ " + maxNamel;

    // Configura o limite máximo nos inputs e valida o valor atual
    const resources = [
        { id: 'hp-current', max: maxHP },
        { id: 'stamina-current', max: maxStamina },
        { id: 'namel-current', max: maxNamel }
    ];

    resources.forEach(res => {
        const input = document.getElementById(res.id);
        if (input) {
            input.max = res.max; // Define o limite nativo do HTML
            
            // Se o campo estiver vazio (ficha nova), preenche com o máximo
            if (input.value === "") {
                input.value = res.max;
            } 
            // Se o valor atual for maior que o novo máximo (ex: mudou atributo), reduz para o máximo
            else if (parseInt(input.value) > res.max) {
                input.value = res.max;
            }
        }
    });

    // Cálculo de Defesa (Mantido o original)
    const armorBonus = parseInt(document.getElementById('armor-display')?.getAttribute('data-bonus')) || 0;
    const shieldBonus = parseInt(document.getElementById('shield-display')?.getAttribute('data-bonus')) || 0;
    let agiBonus = Math.floor((totalDES - 10) / 2);
    if (agiBonus < 0) agiBonus = 0;
    if (armorBonus >= 4) agiBonus = 0; 
    else if (armorBonus === 3) agiBonus = Math.min(agiBonus, 2);

    const defense = 10 + agiBonus + armorBonus + shieldBonus;
    document.getElementById('def-display').innerText = defense;
}

// --- LÓGICA DE FOTO DO PERSONAGEM ---
document.getElementById('char-photo-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Validação de tamanho (Opcional: alerta se for maior que 1MB para não estourar o localStorage)
        if (file.size > 1048576) { 
            alert("A imagem é muito grande! Escolha uma imagem de até 1MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64String = event.target.result;
            const preview = document.getElementById('char-photo-preview');
            const icon = document.querySelector('.photo-uploader .material-icons-round');

            // Atualiza o visual
            preview.src = base64String;
            preview.style.display = 'block';
            if (icon) icon.style.display = 'none';

            // Salva automaticamente após carregar a foto
            window.saveGlobalData();
        };
        reader.readAsDataURL(file);
    }
});

// Impede que recursos ultrapassem o máximo ao digitar
['hp-current', 'stamina-current', 'namel-current'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', function() {
            const max = parseInt(this.max);
            const val = parseInt(this.value);

            if (val > max) this.value = max;
            if (val < 0) this.value = 0;
            
            window.saveGlobalData(); // Salva a alteração
        });
    }
});