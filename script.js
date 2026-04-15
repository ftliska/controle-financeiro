let chart;

// ===== STORAGE =====
function getLancamentos() {
  return JSON.parse(localStorage.getItem('lancamentos')) || [];
}

function salvarLancamentos(lista) {
  localStorage.setItem('lancamentos', JSON.stringify(lista));
}

// ===== ADICIONAR =====
function adicionarLancamento() {
  const tipo = document.getElementById('tipo').value;
  const descricao = document.getElementById('descricao').value.trim();

  const valor = parseFloat(
    document.getElementById('valor').value.replace(/\D/g, '')
  ) / 100;

  const data = document.getElementById('data').value;

  if (!descricao || valor <= 0 || !data) {
    alert('Preencha todos os campos corretamente');
    return;
  }

  const novo = {
    id: Date.now(),
    tipo,
    descricao,
    valor,
    data
  };

  const lista = getLancamentos();
  lista.push(novo);

  salvarLancamentos(lista);
  atualizarTela();

  limparFormulario();
}

// ===== LIMPAR FORM =====
function limparFormulario() {
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('data').value = '';
}

// ===== ATUALIZAR TELA =====
function atualizarTela() {
  const lista = getLancamentos();

  let entradas = 0;
  let saidas = 0;

  const container = document.getElementById('lista');
  container.innerHTML = '';

  lista.forEach(l => {
    if (l.tipo === 'receita') entradas += l.valor;
    else saidas += l.valor;

    const item = document.createElement('div');
    item.className = 'item-lancamento';

    const texto = document.createElement('span');
    texto.textContent = `${l.descricao} - ${l.valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}`;

    // cor por tipo
    texto.style.color = l.tipo === 'receita' ? '#34d399' : '#f87171';

    // botão excluir
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.className = 'btn-delete';
    btn.onclick = () => removerLancamento(l.id);

    item.appendChild(texto);
    item.appendChild(btn);

    container.appendChild(item);
  });

  atualizarResumo(entradas, saidas);
  atualizarGrafico(entradas, saidas);
}

// ===== REMOVER =====
function removerLancamento(id) {
  let lista = getLancamentos();
  lista = lista.filter(l => l.id !== id);

  salvarLancamentos(lista);
  atualizarTela();
}

// ===== RESUMO =====
function atualizarResumo(entradas, saidas) {
  document.getElementById('entradas').textContent =
    entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  document.getElementById('saidas').textContent =
    saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  document.getElementById('saldo').textContent =
    (entradas - saidas).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
}

// ===== GRÁFICO =====
function atualizarGrafico(entradas, saidas) {
  if (chart) chart.destroy();

  chart = new Chart(document.getElementById('grafico'), {
    type: 'doughnut',
    data: {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
        data: [entradas, saidas],
        backgroundColor: ['#34d399', '#f87171'],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#e5e7eb'
          }
        }
      },
      cutout: '70%'
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  atualizarTela();
});
