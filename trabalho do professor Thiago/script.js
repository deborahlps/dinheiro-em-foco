
const ctx = document.getElementById('saldoChart').getContext('2d');
let saldoChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Transações',
        data: Array(12).fill(0),   // Começa zerado
        backgroundColor: '#22c55e'
      },
      {
        label: 'Despesas',
        data: Array(12).fill(0),   // Começa zerado
        backgroundColor: '#ef4444'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#334155' },
        ticks: { color: '#fff' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#fff' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    }
  }
});

function atualizarGraficoSaldoChart() {
  const receitas = JSON.parse(localStorage.getItem("receitas")) || [];
  const despesas = JSON.parse(localStorage.getItem("despesas")) || [];

  const saldoMensal = Array(12).fill(0);   // Aqui vai ser só receitas
  const gastosMensais = Array(12).fill(0); // Aqui só despesas

  receitas.forEach(r => {
    const mes = new Date(r.data).getMonth();
    const valor = parseFloat(r.valor);
    if (!isNaN(mes) && !isNaN(valor)) {
      saldoMensal[mes] += valor;  // só soma receita
    }
  });

  despesas.forEach(d => {
    const mes = new Date(d.data).getMonth();
    const valor = parseFloat(d.valor);
    if (!isNaN(mes) && !isNaN(valor)) {
      gastosMensais[mes] += valor; // só soma despesa
    }
  });

  console.log('Receitas mensais:', saldoMensal);
  console.log('Despesas mensais:', gastosMensais);

  saldoChart.data.datasets[0].data = saldoMensal;    // receitas
  saldoChart.data.datasets[1].data = gastosMensais;  // despesas
  saldoChart.update();
}


// Atualiza últimas transações (receitas)
function atualizarUltimasTransacoes() {
  const receitas = JSON.parse(localStorage.getItem('receitas')) || [];
  const lista = document.getElementById('lista-transacoes');

  const ultimas = receitas.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
  lista.innerHTML = '';

  if (ultimas.length === 0) {
    lista.innerHTML = '<li><span>Sem transações ainda</span></li>';
    return;
  }

  ultimas.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.descricao}</span>
      <span>R$ ${Number(item.valor).toFixed(2)}</span>
    `;
    lista.appendChild(li);
  });
}

// Atualiza últimas despesas
function atualizarUltimasDespesas() {
  const despesas = JSON.parse(localStorage.getItem('despesas')) || [];
  const lista = document.getElementById('lista-despesas');

  const ultimas = despesas.sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
  lista.innerHTML = '';

  if (ultimas.length === 0) {
    lista.innerHTML = '<li><span>Sem despesas ainda</span></li>';
    return;
  }

  ultimas.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.descricao}</span>
      <span>R$ ${Number(item.valor).toFixed(2)}</span>
    `;
    lista.appendChild(li);
  });
}

// Atualiza listas ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  atualizarUltimasTransacoes();
  atualizarUltimasDespesas();
  atualizarGraficoSaldoChart()
});

// Menu de navegação
// Seleciona input da busca
const inputBusca = document.querySelector('.search');

// Seleciona as cards que vamos filtrar
const cards = document.querySelectorAll('main .card');

inputBusca.addEventListener('input', () => {
  const termo = inputBusca.value.toLowerCase();

  cards.forEach(card => {
    // Pega texto da card e também das listas internas, se tiver
    const textoCard = card.textContent.toLowerCase();

    // Mostra card se encontrar termo, esconde se não
    if (textoCard.includes(termo)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});


// Modal logout
function abrirModalLogout() {
  document.getElementById("logout-modal").classList.add("show");
}
function fecharModalLogout() {
  document.getElementById("logout-modal").classList.remove("show");
}
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  location.reload();
}

// Carregar dados do usuário
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
if (usuarioLogado) {
  const nome = usuarioLogado.nome || 'Usuário';
  document.getElementById('nomeUsuario').textContent = nome;

  if (usuarioLogado.foto) {
    const img = document.getElementById('fotoUsuario');
    if (img) {
      img.src = usuarioLogado.foto;
      img.style.display = 'block';
      const icone = document.getElementById('user-icon');
      if (icone) icone.style.display = 'none';
    }
  }
}
function atualizarResumo() {
  const receitas = JSON.parse(localStorage.getItem('receitas')) || [];
  const despesas = JSON.parse(localStorage.getItem('despesas')) || [];

  const totalReceitas = receitas.reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0);

  document.getElementById('totalReceitas').textContent = `R$ ${totalReceitas.toFixed(2).replace('.', ',')}`;
  document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2).replace('.', ',')}`;
}
window.addEventListener('load', () => {
  atualizarResumo();
  atualizarBarraDeMeta(); // Se quiser também atualizar a barra de metas aqui
});
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popupCriadores");
  const btnFechar = document.getElementById("btnFecharPopup");

  const popupExibido = localStorage.getItem("popupCriadoresExibido");

  if (!popupExibido) {
    popup.classList.add("ativo");
  }

  btnFechar.addEventListener("click", () => {
    popup.classList.remove("ativo");
    // Espera a transição sumir antes de esconder
    setTimeout(() => {
      popup.style.display = "none";
    }, 400);
    localStorage.setItem("popupCriadoresExibido", "true");
  });
});

  const traducoes = {
    pt: {
      saldo: "Saldo Atual",
      receitas: "Receitas",
      despesas: "Despesas",
      relatorios: "Relatórios",
      configuracoes: "Configurações",
      sair: "Sair",
      bemvindo: "Bem-vindo(a)",
    },
    en: {
      saldo: "Current Balance",
      receitas: "Income",
      despesas: "Expenses",
      relatorios: "Reports",
      configuracoes: "Settings",
      sair: "Logout",
      bemvindo: "Welcome",
    },
    es: {
      saldo: "Saldo Actual",
      receitas: "Ingresos",
      despesas: "Gastos",
      relatorios: "Informes",
      configuracoes: "Configuración",
      sair: "Salir",
      bemvindo: "Bienvenido(a)",
    }
  };

  function aplicarIdioma(idioma) {
    const textos = traducoes[idioma] || traducoes['pt'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const chave = el.getAttribute('data-i18n');
      if (textos[chave]) {
        el.textContent = textos[chave];
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const idioma = localStorage.getItem('idiomaSelecionado') || 'pt';
    aplicarIdioma(idioma);
  });


