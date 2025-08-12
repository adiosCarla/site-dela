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
    alert("não há filmes disponíveis nesse gênero ou você já assistiu todos.");
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

// document.getElementById('btnLimparAssistidos').addEventListener('click', () => {
//   localStorage.removeItem('assistidos');
//   alert('lista de filmes assistidos foi limpa!');
//   const resultado = document.getElementById('resultadoSorteio');
//   if (resultado) resultado.innerHTML = "";
// });
