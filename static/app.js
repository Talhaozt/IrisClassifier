// --- Parametric iris silhouette -------------------------------------------
// Draws a stylised iris bloom whose "falls" (lower petals) are sized from
// the sepal measurements and whose "standards" (upright petals) are sized
// from the petal measurements. Real feature values in, real shape out.

const RANGES = {
    sepal_length: [4.0, 8.0],
    sepal_width: [2.0, 4.5],
    petal_length: [1.0, 7.0],
    petal_width: [0.1, 2.5],
};

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function scale(value, [inMin, inMax], [outMin, outMax]) {
    const v = clamp(value, inMin, inMax);
    return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function petalPath(length, width) {
    // teardrop shape, tip pointing "up" (negative y) from origin
    const w = width / 2;
    return `M0,0 C ${-w},${-length * 0.28} ${-w * 0.55},${-length * 0.88} 0,${-length} ` +
           `C ${w * 0.55},${-length * 0.88} ${w},${-length * 0.28} 0,0 Z`;
}

function petalGroup(cx, cy, rotateDeg, length, width, fill, opacity = 1) {
    return `<g transform="translate(${cx},${cy}) rotate(${rotateDeg})">` +
           `<path d="${petalPath(length, width)}" fill="${fill}" opacity="${opacity}" ` +
           `stroke="#23301f" stroke-width="1"/></g>`;
}

function flowerSVG(measurements, { size = "full", stroke = "#23301f" } = {}) {
    const cx = size === "full" ? 160 : 90;
    const cy = size === "full" ? 150 : 78;

    const fallLen = scale(measurements.sepal_length, RANGES.sepal_length, [40, 108]);
    const fallWid = scale(measurements.sepal_width, RANGES.sepal_width, [22, 46]);
    const standardLen = scale(measurements.petal_length, RANGES.petal_length, [26, 96]);
    const standardWid = scale(measurements.petal_width, RANGES.petal_width, [10, 34]);

    const falls = [145, 180, 215]
        .map((a) => petalGroup(cx, cy + 6, a, fallLen, fallWid, "#8768a0", 0.9))
        .join("");
    const standards = [-32, 0, 32]
        .map((a) => petalGroup(cx, cy - 4, a, standardLen, standardWid, "#5b3a73"))
        .join("");
    const stem = `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy + (size === "full" ? 130 : 60)}" stroke="${stroke}" stroke-width="2"/>`;
    const center = `<circle cx="${cx}" cy="${cy}" r="3" fill="${stroke}"/>`;

    return `${stem}${falls}${standards}${center}`;
}

function readForm() {
    return {
        sepal_length: parseFloat(document.getElementById("sepal_length").value) || RANGES.sepal_length[0],
        sepal_width: parseFloat(document.getElementById("sepal_width").value) || RANGES.sepal_width[0],
        petal_length: parseFloat(document.getElementById("petal_length").value) || RANGES.petal_length[0],
        petal_width: parseFloat(document.getElementById("petal_width").value) || RANGES.petal_width[0],
    };
}

function renderPreview() {
    const svg = document.getElementById("flower-preview");
    svg.innerHTML = flowerSVG(readForm());
}

// --- Reference species strip ------------------------------------------------
// Approximate class means from the classic Iris dataset (Fisher, 1936).

const SPECIES = [
    { key: "setosa", label: "setosa", sepal_length: 5.0, sepal_width: 3.4, petal_length: 1.5, petal_width: 0.2 },
    { key: "versicolor", label: "versicolor", sepal_length: 5.9, sepal_width: 2.8, petal_length: 4.3, petal_width: 1.3 },
    { key: "virginica", label: "virginica", sepal_length: 6.6, sepal_width: 3.0, petal_length: 5.6, petal_width: 2.0 },
];

function renderReferenceGrid(matchKey = null) {
    const grid = document.getElementById("reference-grid");
    grid.innerHTML = SPECIES.map((s) => `
        <div class="reference-card${s.key === matchKey ? " is-match" : ""}" data-species="${s.key}">
            <svg viewBox="0 0 180 160">${flowerSVG(s, { size: "ref" })}</svg>
            <span class="ref-name">${s.label}</span>
        </div>
    `).join("");
}

// --- Focus highlighting on the callouts -------------------------------------

function bindCalloutHighlights() {
    const standardIds = ["petal_length", "petal_width"];
    const fallIds = ["sepal_length", "sepal_width"];
    const standardCallout = document.querySelector(".callout--standard");
    const fallCallout = document.querySelector(".callout--fall");

    document.querySelectorAll("input[type=number]").forEach((input) => {
        input.addEventListener("focus", () => {
            standardCallout.classList.toggle("is-active", standardIds.includes(input.id));
            fallCallout.classList.toggle("is-active", fallIds.includes(input.id));
        });
        input.addEventListener("blur", () => {
            standardCallout.classList.remove("is-active");
            fallCallout.classList.remove("is-active");
        });
        input.addEventListener("input", renderPreview);
    });
}

// --- Prediction ---------------------------------------------------------

const form = document.getElementById("predict-form");
const resultBox = document.getElementById("result");
const speciesName = document.getElementById("species-name");
const confidence = document.getElementById("confidence");
const probList = document.getElementById("prob-list");
const errorBox = document.getElementById("error");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");
    submitBtn.disabled = true;

    const payload = readForm();

    try {
        const res = await fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Bir hata oluştu");
        }

        const data = await res.json();
        showResult(data);
    } catch (err) {
        errorBox.textContent = err.message;
        errorBox.classList.remove("hidden");
        resultBox.classList.add("hidden");
    } finally {
        submitBtn.disabled = false;
    }
});

function showResult(data) {
    speciesName.textContent = data.species;
    confidence.textContent = `Güven: %${data.confidence}`;

    const entries = Object.entries(data.probabilities);
    const winner = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

    probList.innerHTML = entries.map(([name, pct]) => `
        <li class="${name === winner ? "is-winner" : ""}">
            <span>${name}</span>
            <span class="bar-track"><span class="bar-fill" style="transform: scaleX(${pct / 100})"></span></span>
            <span>%${pct}</span>
        </li>
    `).join("");

    resultBox.classList.remove("hidden");
    renderReferenceGrid(String(data.species).toLowerCase());
}

// --- Init -----------------------------------------------------------------

renderPreview();
renderReferenceGrid();
bindCalloutHighlights();