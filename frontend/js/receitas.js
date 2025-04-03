document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://receitas-chef-back-1.onrender.com/api/receitas';
    const receitaModal = document.getElementById('receitaModal');
    const receitaForm = document.getElementById('receitaForm');
    const addReceitaBtn = document.getElementById('addReceitaBtn');
    const modalTitleReceita = document.getElementById('modalTitleReceita');
    const chefSelect = document.getElementById('chef');
    let editReceitaId = null;

    // Função para carregar receitas na tabela
    async function loadReceitas() {
        try {
            const response = await fetch(apiUrl);
            const receitas = await response.json();

            if (!Array.isArray(receitas)) {
                throw new Error("Resposta inesperada da API: " + JSON.stringify(receitas));
            }

            const tabelaBody = document.querySelector("#ReceitasTable tbody");
            tabelaBody.innerHTML = "";

            receitas.forEach(receita => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${receita.titulo}</td>
                    <td>${receita.descricao}</td>
                    <td>${receita.chef ? receita.chef.nome : "Desconhecido"}</td>
                    <td>
                        <button onclick="editReceita('${receita._id}', '${receita.titulo}', '${receita.descricao}', '${receita.chef ? receita.chef._id : ''}')">Editar</button>
                        <button onclick="deleteReceita('${receita._id}')">Excluir</button>
                    </td>
                `;

                tabelaBody.appendChild(row);
            });
        } catch (error) {
            console.error("Erro ao carregar receitas:", error);
        }
    }

    // Função para adicionar receita
    const addReceita = async (receita) => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(receita)
            });

            if (!response.ok) throw new Error("Erro ao adicionar receita");
            loadReceitas();
        } catch (error) {
            console.error("Erro ao adicionar receita:", error);
        }
    };

    // Função para atualizar receita
    const updateReceita = async (id, receita) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(receita)
            });

            if (!response.ok) throw new Error("Erro ao atualizar receita");
            loadReceitas();
        } catch (error) {
            console.error("Erro ao atualizar receita:", error);
        }
    };

    // Função para deletar receita
    window.deleteReceita = async (id) => {
        if (!confirm("Tem certeza que deseja excluir esta receita?")) return;
        
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

            if (!response.ok) throw new Error("Erro ao deletar receita");
            loadReceitas();
        } catch (error) {
            console.error("Erro ao deletar receita:", error);
        }
    };

    // Função para editar receita
    window.editReceita = (id, titulo, descricao, chefId) => {
        editReceitaId = id;
        modalTitleReceita.innerText = 'Editar Receita';
        document.getElementById('TitleReceita').value = titulo;
        document.getElementById('description').value = descricao;

        loadChefs().then(() => {
            chefSelect.value = chefId || "";
        });

        receitaModal.style.display = 'block';
    };

    // Abrir modal para adicionar nova receita
    const openAddReceitaModal = async () => {
        editReceitaId = null;
        modalTitleReceita.innerText = 'Adicionar Receita';
        receitaForm.reset();
        await loadChefs();
        receitaModal.style.display = 'block';
    };

    // Função para carregar chefs no select
    async function loadChefs() {
        try {
            const response = await fetch('http://localhost:4000/api/chef');
            const chefs = await response.json();

            if (!Array.isArray(chefs)) {
                throw new Error("Resposta inesperada da API: " + JSON.stringify(chefs));
            }

            chefSelect.innerHTML = "";

            chefs.forEach(chef => {
                const option = document.createElement("option");
                option.value = chef._id;
                option.textContent = chef.nome;
                chefSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar chefs:", error);
        }
    }

    // Fechar modal ao clicar no "x"
    document.querySelector('.close').addEventListener('click', () => {
        receitaModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === receitaModal) {
            receitaModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    receitaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const receitaData = {
            titulo: document.getElementById('TitleReceita').value,
            descricao: document.getElementById('description').value,
            chef: chefSelect.value
        };

        if (editReceitaId) {
            await updateReceita(editReceitaId, receitaData);
        } else {
            await addReceita(receitaData);
        }

        receitaModal.style.display = 'none';
        loadReceitas();
    });

    // Inicializando o carregamento de receitas e eventos
    addReceitaBtn.addEventListener('click', openAddReceitaModal);
    loadReceitas();
});



