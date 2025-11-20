let jogos = [];
const idsPermitidos = [352, 500, 58, 79, 88];
const urlParams = new URLSearchParams(window.location.search);
const jogoId = urlParams.get("id");
const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");

window.addEventListener("pageshow", () => {
    // Remove qualquer animação que tenha ficado na tela
    document.querySelectorAll(".animacao-jogo").forEach(el => el.remove());

    // Libera cliques novamente se estava desativado
    document.body.style.pointerEvents = "auto";
});

fetch('./jogos.json')
    .then(res => res.json())
    .then(data => {
        jogos = data;
        if (jogoId !== null) {
            carregarJogo();
        } else {
            mostrarJogos();
        }
    });

window.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector('#inputpesquisa');
    const sugestoesDiv = document.querySelector('#resultado');

    input.addEventListener('input', pesquisar);

    function pesquisar() {
        const texto = input.value.toLowerCase();

        if (!texto) {
            sugestoesDiv.style.display = "none";
            sugestoesDiv.innerHTML = "";
            return;
        }

        const resultados = jogos
            .filter(jogo => jogo.nome.toLowerCase().includes(texto))
            .slice(0, 5);

        // limpa sugestões
        sugestoesDiv.innerHTML = "";

        if (resultados.length === 0) {
            sugestoesDiv.style.display = "none";
            return;
        }

        resultados.forEach(jogo => {
            const item = document.createElement("div");
            item.classList.add("sugestao");

            item.innerHTML = `
        <section class="resultado-item">
            <img src="${jogo.capa}" alt="${jogo.nome}">
            <span>${jogo.nome}</span>
        </section>
        `;


            item.dataset.link = `jogo.html?id=${jogo.id}`;
            item.addEventListener("click", (ev) => {
                document.body.style.pointerEvents = "none";
                ev.stopPropagation(); // evita cliques cascata
                sugestoesDiv.style.display = "none"; // fecha a lista

                // clona a imagem da sugestão e faz a animação (mesma lógica dos cards)
                const imgElem = item.querySelector("img");
                if (!imgElem) return;
                const imgClone = imgElem.cloneNode(true);
                imgClone.classList.add("animacao-jogo");
                document.body.appendChild(imgClone);

                setTimeout(() => {
                    imgClone.classList.add("ativo")
                    main.classList.add("esconder");
                    header.classList.add("esconder");
                    footer.classList.add("esconder");
                }, 10);
                setTimeout(() => imgClone.classList.add("bordaseluz"), 350);
                setTimeout(() => imgClone.classList.add("expandir"), 1500);
                setTimeout(() => {
                    main.classList.remove("esconder");
                    header.classList.remove("esconder");
                    footer.classList.remove("esconder");
                    window.location.href = item.dataset.link
                }, 2500);
            });

            sugestoesDiv.appendChild(item);
        });

        sugestoesDiv.style.display = "block";
    }
});

function mostrarJogos() {
    const main = document.querySelector("#jogos");
    main.innerHTML = "";

    const filtrados = jogos.filter(jogo => idsPermitidos.includes(jogo.id));

    filtrados.forEach(jogo => {
        const card = document.createElement("div");
        card.classList.add("card-jogo");

        card.innerHTML = `
        <img src="${jogo.capa}" alt="${jogo.nome}">
        <h3>${jogo.nome}</h3>
        <p>${jogo.genero}</p>`;

        card.dataset.link = `jogo.html?id=${jogo.id}`;

        // ativa a animação ao clicar
        card.addEventListener("click", animarTransicao);

        main.appendChild(card);
    });
}

function animarTransicao(e) {
    document.body.style.pointerEvents = "none";
    const card = e.currentTarget;
    const img = card.querySelector("img");
    const link = card.dataset.link;

    if (!img) return;

    const imgClone = img.cloneNode(true);
    imgClone.classList.add("animacao-jogo");
    document.body.appendChild(imgClone);

    setTimeout(() => {
        imgClone.classList.add("ativo");
        main.classList.add("esconder");
        header.classList.add("esconder");
        footer.classList.add("esconder");
    }, 10);
    setTimeout(() => {
        imgClone.classList.add("bordaseluz");
    }, 350);
    setTimeout(() => {
        imgClone.classList.add("expandir");
    }, 1500);
    setTimeout(() => {
        main.classList.remove("esconder");
        header.classList.remove("esconder");
        footer.classList.remove("esconder");
        window.location.href = link;
    }, 2500);
}

if (jogoId !== null) {
    carregarJogo();
}


function carregarJogo() {
    const jogo = jogos.find(j => j.id === Number(jogoId));


    const jogoitem = document.querySelector("#jogoitem");

    if (!jogo) {
        jogoitem.innerHTML = "<h2>Jogo não encontrado!</h2>";
        return;
    }

    jogoitem.innerHTML = `
            <div class="nome-capa-jogo">
            <img src="${jogo.capa}" alt="${jogo.nome}">
            <h1>${jogo.nome}</h1>
            </div>
            <article><p>${jogo.descricao}</p>
            <p><strong>Gênero:</strong> ${jogo.genero}</p>
            <p><strong>Lançamento:</strong> ${jogo.ano_lancamento}</p>
            <p><strong>Plataforma:</strong> ${jogo.plataforma}</p>
            </article>
    `;

}
