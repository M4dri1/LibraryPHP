const tableBody = document.querySelector("#authors tbody");
const form = document.querySelector("#author-form");
const paginationDiv = document.getElementById("pagination");

// Adicione um console.log para depurar se tableBody ainda for null
if (!tableBody) {
    console.error("Erro: Elemento #authors tbody não encontrado. Verifique o HTML e o cache do navegador.");
}

let currentPage = 0;
const limit = 5;

async function fetchAuthors(page = 0) {
    const offset = page * limit;

    try {
        const res = await fetch(`../../API/authors/read.php?limit=${limit}&offset=${offset}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        let authors = await res.json(); // Pega a resposta JSON

        // SE o PHP estiver retornando um OBJETO com chaves numéricas ({"0": {...}, "1": {...}}),
        // converta para um ARRAY de objetos.
        if (typeof authors === 'object' && authors !== null && !Array.isArray(authors)) {
            authors = Object.values(authors); // Converte o objeto em um array de seus valores
        }

        const totalRes = await fetch(`../../API/authors/count.php`);
        if (!totalRes.ok) throw new Error(`HTTP error ${totalRes.status}`);
        const { total } = await totalRes.json();

        // Verifique se tableBody não é null antes de tentar usar innerHTML
        if (tableBody) {
            tableBody.innerHTML = authors.map(author => `
                <tr data-author-id="${author.author_id}">
                    <td>${author.author_id}</td>
                    <td class="name">${author.name}</td>
                    <td>
                        <button onclick="startEdit(${author.author_id})">Edit</button>
                        <button onclick="deleteAuthor(${author.author_id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            console.error("Não foi possível atualizar a tabela: tableBody é null.");
            // Você pode adicionar uma mensagem de erro na UI aqui se quiser
        }


        currentPage = page;
        renderPagination(Math.ceil(total / limit));
    } catch (error) {
        console.error("Erro ao carregar autores:", error);
        // Verifique se tableBody não é null antes de tentar usar innerHTML
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="3">Failed to load authors.</td></tr>`;
        } else {
            console.error("Não foi possível exibir mensagem de erro na tabela: tableBody é null.");
        }
    }
}

// ... (o restante do seu código JavaScript permanece o mesmo) ...

function renderPagination(totalPages) {
    // Verifique se paginationDiv não é null antes de tentar usar innerHTML
    if (paginationDiv) {
        paginationDiv.innerHTML = '';

        for (let i = 0; i < totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i + 1;
            btn.className = i === currentPage ? 'active' : '';
            btn.onclick = () => fetchAuthors(i);
            paginationDiv.appendChild(btn);
        }
    } else {
        console.error("Não foi possível renderizar a paginação: paginationDiv é null.");
    }
}

function startEdit(author_id) {
    const row = document.querySelector(`tr[data-author-id="${author_id}"]`);
    if (!row) return;

    const nameCell = row.querySelector('.name');
    const actionsCell = row.querySelector('td:last-child');

    const currentName = nameCell.textContent;

    nameCell.innerHTML = `<input type="text" value="${currentName}" />`;

    actionsCell.innerHTML = `
        <button onclick="saveEdit(${author_id})">Save</button>
        <button onclick="cancelEdit(${author_id}, '${currentName.replace(/'/g, "\\'")}')">Cancel</button>
    `;
}

async function saveEdit(author_id) {
    const row = document.querySelector(`tr[data-author-id="${author_id}"]`);
    if (!row) return;

    const nameInput = row.querySelector('.name input');
    const updatedName = nameInput.value.trim();

    if (!updatedName) {
        alert('Name cannot be empty');
        return;
    }

    try {
        const res = await fetch('../../API/authors/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_id, name: updatedName }),
        });
        if (!res.ok) throw new Error('Failed to update author');
        fetchAuthors(currentPage);
    } catch (err) {
        alert(err.message);
    }
}

function cancelEdit(author_id, oldName) {
    const row = document.querySelector(`tr[data-author-id="${author_id}"]`);
    if (!row) return;

    row.querySelector('.name').textContent = oldName;
    row.querySelector('td:last-child').innerHTML = `
        <button onclick="startEdit(${author_id})">Edit</button>
        <button onclick="deleteAuthor(${author_id})">Delete</button>
    `;
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || data.name.trim() === '') {
        alert('Name cannot be empty');
        return;
    }

    try {
        const res = await fetch('../../API/authors/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create author');
        form.reset();
        fetchAuthors(currentPage);
    } catch (err) {
        alert(err.message);
    }
};

async function deleteAuthor(author_id) {
    if (!confirm('Are you sure you want to delete?')) return;

    try {
        const res = await fetch('../../API/authors/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_id }),
        });
        if (!res.ok) throw new Error('Failed to delete author');
        fetchAuthors(currentPage);
    } catch (err) {
        alert(err.message);
    }
}

fetchAuthors();