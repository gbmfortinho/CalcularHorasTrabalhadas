function parseTime(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

function formatTime(minutes) {
    const sinal = minutes < 0 ? '-' : '';
    minutes = Math.abs(minutes);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${sinal}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const dias = {
    "16 - Ter": ["06:50", "12:50"],
    "17 - Qua": ["06:50", "12:51"],
    "18 - Qui": ["06:50", "12:50"],
    "19 - Sex": ["06:50", "12:50"],
    "22 - Seg": ["06:50", "12:50"],
    "23 - Ter": ["06:50", "12:53"],
    "24 - Qua": ["06:50", "12:51"],
    "25 - Qui": ["06:50", "12:50"],
    "26 - Sex": ["06:50", "12:50"],
    "29 - Seg": ["06:50", "12:50"],
    "30 - Ter": ["06:50", "12:30"],
    "01 - Qua": ["06:50", "12:52"],
    "02 - Qui": ["06:50", "13:03"],
    "03 - Sex": ["06:50", "13:07"],
    "06 - Seg": ["06:50", "12:51"],
    "07 - Ter": ["06:50", "12:50"],
    "08 - Qua": ["06:25", "11:10"], 
    "09 - Qui": ["06:50", "13:30"],
    "10 - Sex": ["06:50", "12:50"],
    "13 - Seg": ["06:50", "13:01"]
};

const jornadaMinutos = 6 * 60; // 6 horas
const horaEntradaEsperada = parseTime("06:50");
const horaSaidaEsperada = horaEntradaEsperada + jornadaMinutos;

let totalTrabalhado = 0;
let totalEsperado = 0;

let contadores = {
    normal: 0,
    extra: 0,
    atraso: 0,
    adiantado: 0,
    falta: 0
};

console.log("Resumo por dia:\n");

for (const [dia, horario] of Object.entries(dias)) {
    if (!horario || horario.length !== 2) {
        console.log(`${dia}: ❌ Falta`);
        contadores.falta++;
        continue;
    }

    const entrada = parseTime(horario[0]);
    const saida = parseTime(horario[1]);
    const minutosTrabalhados = saida - entrada;
    const saldo = minutosTrabalhados - jornadaMinutos;

    totalTrabalhado += minutosTrabalhados;
    totalEsperado += jornadaMinutos;

    let status = "✅ Normal";

    if (minutosTrabalhados < jornadaMinutos) {
        if (entrada > horaEntradaEsperada) {
            status = "⚠️ Atraso";
            contadores.atraso++;
        } else if (saida < horaSaidaEsperada) {
            status = "🕘 Saída antecipada";
            contadores.adiantado++;
        } else {
            status = "⚠️ Jornada incompleta";
        }
    } else if (minutosTrabalhados > jornadaMinutos) {
        status = "⏰ Hora extra";
        contadores.extra++;
    } else {
        contadores.normal++;
    }

    console.log(`${dia}: Trabalhou ${formatTime(minutosTrabalhados)} | Saldo: ${formatTime(saldo)} | ${status}`);
}

// Totais
const saldoTotal = totalTrabalhado - totalEsperado;

console.log("\n==============================");
console.log("Total esperado:   ", formatTime(totalEsperado));
console.log("Total trabalhado: ", formatTime(totalTrabalhado));
console.log("Saldo total:      ", formatTime(saldoTotal));

console.log("\n📊 Resumo Final:");
console.log(`✅ Dias normais:         ${contadores.normal}`);
console.log(`⏰ Dias com hora extra:  ${contadores.extra}`);
console.log(`⚠️ Dias com atraso:      ${contadores.atraso}`);
console.log(`🕘 Saídas antecipadas:   ${contadores.adiantado}`);
console.log(`❌ Faltas:               ${contadores.falta}`);
