document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://receitas-chef-back-1.onrender.com/api/chef';
    const chefModal = document.getElementById('ChefModal');
    const chefForm = document.getElementById('ChefForm');
    const addChefBtn = document.getElementById('chefBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editChefId = null;

    const loadChefs = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Erro: ${response.status}`);

            const chefs = await response.json();
            if (!Array.isArray(chefs)) throw new Error("Resposta inválida da API");

            const tableBody = document.querySelector('#ChefsTable tbody');
            if (!tableBody) {
                console.error("Tabela de chefs não encontrada!");
                return;
            }
            tableBody.innerHTML = '';

            chefs.forEach(chef => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${chef.nome}</td>
                    <td>${chef.especialidade}</td>
                    <td>
                        <button class="editChefBtn" data-id="${chef._id}">Editar</button>
                        <button class="deleteChefBtn" data-id="${chef._id}">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.editChefBtn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    console.log("Tentando editar chef com ID:", id);
                    if (!id) {
                        console.error("ID do chef não encontrado para edição!");
                        return;
                    }
                    openEditChefModal(id);
                });
            });

            document.querySelectorAll('.deleteChefBtn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    console.log("Tentando deletar chef com ID:", id);
                    if (!id) {
                        console.error("ID do chef não encontrado para exclusão!");
                        return;
                    }
                    deleteChef(id);
                });
            });

        } catch (error) {
            console.error("Erro ao carregar chefs:", error);
        }
    };

    const addChef = async (chef) => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chef)
            });
            if (!response.ok) throw new Error("Erro ao adicionar chef");
            loadChefs();
        } catch (error) {
            console.error("Erro ao adicionar chef:", error);
        }
    };

    const updateChef = async (id, chef) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chef)
            });
            if (!response.ok) throw new Error("Erro ao atualizar chef");
            loadChefs();
        } catch (error) {
            console.error("Erro ao atualizar chef:", error);
        }
    };

    const deleteChef = async (id) => {
        try {
            console.log("Tentando deletar chef com ID:", id);
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao deletar chef. Status: ${response.status} - ${errorText}`);
            }
            console.log("Chef deletado com sucesso!");
            loadChefs();
        } catch (error) {
            console.error("Erro ao deletar chef:", error);
        }
    };

    const openEditChefModal = async (id) => {
        try {
            console.log("Buscando chef para edição, ID:", id);
            editChefId = id;
            modalTitle.innerText = 'Editar Chef';

            const response = await fetch(`${apiUrl}/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao buscar chef. Status: ${response.status} - ${errorText}`);
            }

            const chef = await response.json();
            console.log("Dados do chef recebidos:", chef);

            document.getElementById('name').value = chef.nome;
            document.getElementById('especialidade').value = chef.especialidade;
            document.getElementById('password').value = '';

            chefModal.style.display = 'block';
        } catch (error) {
            console.error("Erro ao carregar chef para edição:", error);
        }
    };

    const openAddChefModal = () => {
        editChefId = null;
        modalTitle.innerText = 'Adicionar Chef';
        chefForm.reset();
        chefModal.style.display = 'block';
    };

    if (chefModal) {
        const closeModalBtn = chefModal.querySelector('.close');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                chefModal.style.display = 'none';
            });
        }
    }

    window.addEventListener('click', (event) => {
        if (event.target === chefModal) {
            chefModal.style.display = 'none';
        }
    });

    chefForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const chefData = {
            nome: document.getElementById('name').value,
            especialidade: document.getElementById('especialidade').value,
            senha: document.getElementById('password').value
        };

        if (editChefId) {
            await updateChef(editChefId, chefData);
        } else {
            await addChef(chefData);
        }

        chefModal.style.display = 'none';
        loadChefs();
    });

    addChefBtn.addEventListener('click', openAddChefModal);
    loadChefs();
});

