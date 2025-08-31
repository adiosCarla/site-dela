let filmes = [];
let assistidos = JSON.parse(localStorage.getItem('assistidos')) || [];

async function carregarFilmes() {
  try {
    const resposta = await fetch('filmes.json');
    filmes = await resposta.json();

    criarBotoesGeneros();
  } catch (erro) {
    alert("erro ao carregar lista de filmes.");
    console.error(erro);
  }
}

function criarBotoesGeneros() {
  const container = document.getElementById('botoes-generos');

  const generosUnicos = [...new Set(filmes.map(f => f.genero))];

  generosUnicos.forEach(genero => {
    const btn = document.createElement('button');
    btn.textContent = genero;
    btn.classList.add('button-1');
    btn.addEventListener('click', () => sortearFilme(genero));
    container.appendChild(btn);
  });
}

function sortearFilme(genero) {
  const filmesDisponiveis = filmes.filter(filme =>
    filme.genero.toLowerCase() === genero.toLowerCase() && !assistidos.includes(filme.id)
  );

  if (filmesDisponiveis.length === 0) {
    alert("não há filmes disponíveis nesse gênero ou já assistimos todos.");
    return;
  }

  const filmeSorteado = filmesDisponiveis[Math.floor(Math.random() * filmesDisponiveis.length)];
  mostrarFilme(filmeSorteado);
}

function mostrarFilme(filme) {
  const container = document.getElementById('resultadoSorteio');
  container.innerHTML = `
    <h3>${filme.nome} (${filme.ano})</h3>
    <button class="button-1" onclick="marcarComoAssistido(${filme.id})">marcar como assistido</button>
  `;
}

function marcarComoAssistido(id) {
  if (!assistidos.includes(id)) {
    assistidos.push(id);
    localStorage.setItem('assistidos', JSON.stringify(assistidos));
    alert("filme marcado como assistido!");
    document.getElementById('resultadoSorteio').innerHTML = "";
  }
}

document.getElementById('btnSortear')?.addEventListener('click', () => {
  alert('use os botões para sortear filmes por gênero.');
});

carregarFilmes();

let dadosGym = JSON.parse(localStorage.getItem("gymrats")) || [];

function registrar(pessoa) {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const registro = { pessoa, data: hoje };

  dadosGym.push(registro);
  localStorage.setItem("gymrats", JSON.stringify(dadosGym));

  atualizarTelaGym();
}

function atualizarTelaGym() {
  const historico = document.getElementById("historico");
  const titulo = document.getElementById("titulo-historico");

  historico.innerHTML = "";

  if (dadosGym.length === 0) {
    titulo.style.display = "none"; 
  } else {
    titulo.style.display = "block"; 

    const ordenados = [...dadosGym].sort((a, b) => {
      const [diaA, mesA] = a.data.split("/");
      const [diaB, mesB] = b.data.split("/");
      const dataA = new Date(`${mesA}/${diaA}`);
      const dataB = new Date(`${mesB}/${diaB}`);
      return dataB - dataA;
    });

    ordenados.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.data} - ${r.pessoa}`;
      historico.prepend(li);
    });
  }

  const totalBeatriz = dadosGym.filter(r => r.pessoa === "beatriz").length;
  const totalCarla = dadosGym.filter(r => r.pessoa === "carla").length;

  document.getElementById("totais").textContent =
    `beatriz: ${totalBeatriz} | carla: ${totalCarla}`;
}

function apagarUltimo() {
  if(dadosGym.length === 0) return;
  dadosGym.pop();
  localStorage.setItem("gymrats", JSON.stringify(dadosGym));
  atualizarTelaGym();
}

atualizarTelaGym();