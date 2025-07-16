const tableBody = document.querySelector("#authors tbody");
const form = document.querySelector("#author-form");
const paginationDiv = document.getElementById("pagination");

let currentPage = 0;
const limit = 5;

async function fetchAuthors(page = 0) {
    const offset = page * limit;

    try {
        const res = await fetch(`../../API/authors/read.php?limit=${limit}&offset=${offset}`);
        const totalRes = await fetch(`../../API/authors/count.php`);
        if (!res.ok || !totalRes.ok) return;

        let authors = await res.json();
        const { total } = await totalRes.json();

        if (typeof authors === 'object' && authors !== null && !Array.isArray(authors)) {
            authors = Object.values(authors);
        }

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
        }

        currentPage = page;
        renderPagination(Math.ceil(total / limit));
    } catch (_) {
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="3">Failed to load authors.</td></tr>`;
        }
    }
}

function renderPagination(totalPages) {
    if (!paginationDiv) return;

    paginationDiv.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => fetchAuthors(i);
        paginationDiv.appendChild(btn);
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
    if (!updatedName) return;

    try {
        const res = await fetch('../../API/authors/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_id, name: updatedName }),
        });
        if (res.ok) fetchAuthors(currentPage);
    } catch (_) { }
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
    if (!data.name || data.name.trim() === '') return;

    try {
        const res = await fetch('../../API/authors/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            form.reset();
            fetchAuthors(currentPage);
        }
    } catch (_) { }
};

async function deleteAuthor(author_id) {
    if (!confirm('Are you sure you want to delete?')) return;

    try {
        const res = await fetch('../../API/authors/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_id }),
        });
        if (res.ok) fetchAuthors(currentPage);
    } catch (_) { }
}

fetchAuthors();
