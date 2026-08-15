const API_URL = 'http://localhost:8080/api/analyze';

// ── ELEMENTOS ────────────────────────────────────────────────
const textInput     = document.getElementById('text-input');
const analyzeBtn    = document.getElementById('analyze-btn');
const wordCount     = document.getElementById('word-count');
const resultsSection = document.getElementById('results-section');
const emptyState    = document.getElementById('empty-state');
const tooltip       = document.getElementById('tooltip');

const countSpell  = document.getElementById('count-spell');
const countRule   = document.getElementById('count-rule');
const countAccent = document.getElementById('count-accent');

const listSpell  = document.getElementById('list-spell');
const listRule   = document.getElementById('list-rule');
const listAccent = document.getElementById('list-accent');

// ── ANIMACIÓN DE ENTRADA ─────────────────────────────────────
anime({
    targets: '.quill-icon',
    opacity: [0, 1],
    translateY: [-10, 0],
    easing: 'easeOutExpo',
    duration: 900,
    delay: 200
});

anime({
    targets: '.logo-text',
    opacity: [0, 1],
    translateX: [-15, 0],
    easing: 'easeOutExpo',
    duration: 800,
    delay: 400
});

anime({
    targets: '.tagline',
    opacity: [0, 1],
    easing: 'easeOutExpo',
    duration: 600,
    delay: 700
});

anime({
    targets: '.editor-section',
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutExpo',
    duration: 800,
    delay: 600
});

// ── CONTADOR DE PALABRAS ─────────────────────────────────────
textInput.addEventListener('input', () => {
    const words = textInput.value.trim().split(/\s+/).filter(w => w.length > 0);
    wordCount.textContent = `${words.length} palabra${words.length !== 1 ? 's' : ''}`;
});

// ── ANALIZAR ─────────────────────────────────────────────────
analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return;

    // estado cargando
    analyzeBtn.classList.add('loading');
    analyzeBtn.querySelector('.btn-text').textContent = 'Analizando...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: text
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        renderResults(data);

    } catch (err) {
        console.error('Error al conectar con la API:', err);
        alert('No se pudo conectar con la API. ¿Está corriendo en localhost:8080?');
    } finally {
        analyzeBtn.classList.remove('loading');
        analyzeBtn.querySelector('.btn-text').textContent = 'Analizar texto';
    }
});

// ── RENDERIZAR RESULTADOS ────────────────────────────────────
function renderResults(data) {
    const { spellErrors = [], ruleViolations = [], accentErrors = [] } = data;

    // mostrar sección
    emptyState.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // limpiar listas
    listSpell.innerHTML = '';
    listRule.innerHTML = '';
    listAccent.innerHTML = '';

    // animar contadores
    animateCounter(countSpell, spellErrors.length);
    animateCounter(countRule, ruleViolations.length);
    animateCounter(countAccent, accentErrors.length);

    // animar barras
    anime({ targets: '#stat-spell .stat-bar', width: spellErrors.length > 0 ? '100%' : '0%', duration: 800, easing: 'easeOutExpo' });
    anime({ targets: '#stat-rule .stat-bar',  width: ruleViolations.length > 0 ? '100%' : '0%', duration: 800, easing: 'easeOutExpo' });
    anime({ targets: '#stat-accent .stat-bar', width: accentErrors.length > 0 ? '100%' : '0%', duration: 800, easing: 'easeOutExpo' });

    // animar tarjetas de estadísticas
    anime({
        targets: '.stat-card',
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        duration: 600
    });

    // llenar listas
    spellErrors.forEach(e => {
        listSpell.appendChild(createErrorItem(
            e.word,
            `Línea ${e.line}, pos. ${e.position}`,
            e.suggestions?.length ? `¿Quisiste decir? ${e.suggestions.slice(0, 3).join(', ')}` : null,
            'red'
        ));
    });

    ruleViolations.forEach(r => {
        listRule.appendChild(createErrorItem(
            r.rule,
            r.message,
            null,
            'blue'
        ));
    });

    accentErrors.forEach(a => {
        listAccent.appendChild(createErrorItem(
            a.word,
            'Error de acento',
            a.suggestion ? `Sugerencia: ${a.suggestion}` : null,
            'gold'
        ));
    });

    // animar paneles
    anime({
        targets: '.error-panel',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(120, { start: 200 }),
        easing: 'easeOutExpo',
        duration: 700
    });

    // animar items de la lista
    setTimeout(() => {
        anime({
            targets: '.error-item',
            opacity: [0, 1],
            translateX: [-8, 0],
            delay: anime.stagger(40),
            easing: 'easeOutExpo',
            duration: 400
        });
    }, 400);
}

// ── CREAR ITEM DE ERROR ──────────────────────────────────────
function createErrorItem(word, msg, suggestion, color) {
    const li = document.createElement('li');
    li.className = 'error-item';
    li.innerHTML = `
        <div class="error-word" style="color: var(--${color})">${escapeHtml(word)}</div>
        <div class="error-msg">${escapeHtml(msg)}</div>
        ${suggestion ? `<div class="error-suggestion">${escapeHtml(suggestion)}</div>` : ''}
    `;
    return li;
}

// ── ANIMAR CONTADOR ──────────────────────────────────────────
function animateCounter(el, target) {
    const obj = { val: 0 };
    anime({
        targets: obj,
        val: target,
        round: 1,
        duration: 800,
        easing: 'easeOutExpo',
        update: () => { el.textContent = obj.val; }
    });
}

// ── ESCAPE HTML ──────────────────────────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}