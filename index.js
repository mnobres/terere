const botaoLeitura = document.getElementById("btn-leitura");
const synth = window.speechSynthesis;
let falaAtual = null;
let lendo = false;
let vozesDisponiveis = [];

function carregarVozes() {
    vozesDisponiveis = synth.getVoices();
    if (!vozesDisponiveis.length) {
        synth.onvoiceschanged = () => {
            vozesDisponiveis = synth.getVoices();
        };
    }
}
carregarVozes();

function selecionarVoz() {
    return vozesDisponiveis.find(
        voz => voz.lang === "pt-BR" && voz.name.toLowerCase().includes("google")
    ) || vozesDisponiveis.find(voz => voz.lang === "pt-BR") || null;
}

function iniciarLeitura(texto) {
    if (!synth) {
        alert("Seu navegador não suporta leitura de texto 😢");
        return;
    }

    synth.cancel();

    falaAtual = new SpeechSynthesisUtterance(texto);
    falaAtual.lang = "pt-BR";
    falaAtual.rate = 1;     
    falaAtual.pitch = 1.2;  
    falaAtual.volume = 1;   
    falaAtual.voice = selecionarVoz();

    falaAtual.onend = () => {
        lendo = false;
        botaoLeitura.textContent = "🔊 Ler Página";
        falaAtual = null;
    };

    falaAtual.onerror = () => {
        lendo = false;
        botaoLeitura.textContent = "🔊 Ler Página";
        falaAtual = null;
        alert("Ocorreu um erro na leitura de texto.");
    };

    synth.speak(falaAtual);
    lendo = true;
    botaoLeitura.textContent = "⏸️ Pausar";
}

botaoLeitura.addEventListener("click", () => {
    if (!falaAtual) {
        const textoSelecionado = window.getSelection().toString().trim();
        const texto = textoSelecionado || document.body.innerText;
        iniciarLeitura(texto);
        return;
    }

    if (synth.speaking) {
        if (synth.paused) {
            synth.resume();
            botaoLeitura.textContent = "⏸️ Pausar";
        } else {
            synth.pause();
            botaoLeitura.textContent = "▶️ Retomar";
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const botoesFiltro = document.querySelectorAll(".filtros button");
    const produtos = document.querySelectorAll(".catalogo .produto");

    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            const filtro = botao.getAttribute("data-filtro");

            produtos.forEach(produto => {
                if (filtro === "todos") {
                    produto.style.display = "block";
                } else if (produto.classList.contains(filtro)) {
                    produto.style.display = "block";
                } else {
                    produto.style.display = "none";
                }
            });
        });
    });
});
