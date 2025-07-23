const booksTableBody = document.querySelector("#books-table tbody");
const bookForm = document.querySelector("#book-form");
const paginationDiv = document.getElementById("pagination");
const authorSelect = document.querySelector("#author-select");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const noResultsMessage = document.getElementById("no-results-message");

let currentPage = 0;
const limit = 5;
let currentSearchQuery = '';
let authorOptions = [];

async function fetchBooks(page = 0, searchQuery = '') {
    const offset = page * limit;
    const url = `/API/books/read.php?limit=${limit}&offset=${offset}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;
    const totalUrl = `/API/books/count.php${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`;

    try {
        const [res, totalRes] = await Promise.all([fetch(url), fetch(totalUrl)]);
        if (!res.ok || !totalRes.ok) return;

        const books = await res.json();
        const { total } = await totalRes.json();

        renderBooks(books);
        renderPagination(Math.ceil(total / limit));
        currentPage = page;
    } catch (_) {
        if (booksTableBody) {
            booksTableBody.innerHTML = `<tr><td colspan="5"></td></tr>`;
        }
        if (noResultsMessage) noResultsMessage.style.display = 'none';
    }
}

function renderBooks(books) {
    if (!booksTableBody) return;

    if (books.length === 0 && currentSearchQuery) {
        booksTableBody.innerHTML = '';
        if (noResultsMessage) noResultsMessage.style.display = 'block';
        return;
    }

    booksTableBody.innerHTML = books.map(book => `
        <tr data-book-id="${book.book_id}">
            <td>${book.book_id}</td>
            <td class="author_id">${book.author_id}</td>
            <td class="name">${book.author_name}</td>
            <td class="title">${book.title}</td>
            <td>
                <button onclick="startEditBook(${book.book_id})">Edit</button>
                <button onclick="deleteBook(${book.book_id})">Delete</button>
            </td>
        </tr>
    `).join('');

    if (noResultsMessage) noResultsMessage.style.display = 'none';
}

function renderPagination(totalPages) {
    if (!paginationDiv) return;

    paginationDiv.style.display = totalPages > 1 ? 'block' : 'none';
    paginationDiv.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => fetchBooks(i, currentSearchQuery);
        paginationDiv.appendChild(btn);
    }
}

function startEditBook(book_id) {
    const row = document.querySelector(`tr[data-book-id="${book_id}"]`);
    if (!row) return;

    const authorId = row.querySelector('.author_id').textContent.trim();
    const title = row.querySelector('.title').textContent.trim();
    const nameCell = row.querySelector('.name');

    const select = document.createElement('select');
    authorOptions.forEach(author => {
        const option = document.createElement('option');
        option.value = author.author_id;
        option.textContent = author.name;
        if (author.author_id == authorId) option.selected = true;
        select.appendChild(option);
    });

    nameCell.innerHTML = '';
    nameCell.appendChild(select);
    row.querySelector('.title').innerHTML = `<input type="text" value="${title}" />`;

    row.querySelector('td:last-child').innerHTML = `
        <button onclick="saveEditBook(${book_id})">Save</button>
        <button onclick="cancelEditBook(${book_id}, '${authorId}', '${title.replace(/'/g, "\\'")}')">Cancel</button>
    `;
}

async function saveEditBook(book_id) {
    const row = document.querySelector(`tr[data-book-id="${book_id}"]`);
    if (!row) return;

    const authorId = row.querySelector('.name select').value.trim();
    const title = row.querySelector('.title input').value.trim();

    if (!authorId || !title) return;

    if (isNaN(authorId) || Number(authorId) <= 0) {
        return;
    }

    try {
        const res = await fetch('/API/books/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id, author_id: authorId, title })
        });

        if (!res.ok) {
            return;
        }

        fetchBooks(currentPage, currentSearchQuery);
    } catch (_) {
    }
}

function cancelEditBook(book_id, oldAuthorId, oldTitle) {
    const row = document.querySelector(`tr[data-book-id="${book_id}"]`);
    if (!row) return;

    row.querySelector('.author_id').textContent = oldAuthorId;
    const author = authorOptions.find(a => a.author_id == oldAuthorId);
    row.querySelector('.name').textContent = author ? author.name : '';
    row.querySelector('.title').textContent = oldTitle;

    row.querySelector('td:last-child').innerHTML = `
        <button onclick="startEditBook(${book_id})">Edit</button>
        <button onclick="deleteBook(${book_id})">Delete</button>
    `;
}

bookForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(bookForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.author_id || !data.title.trim()) return;

    if (isNaN(data.author_id) || Number(data.author_id) <= 0) {
        return;
    }

    try {
        const res = await fetch('/API/books/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            bookForm.reset();
            fetchBooks(currentPage, currentSearchQuery);
        }
    } catch (_) { }
};

async function deleteBook(book_id) {
    if (!confirm('Are you sure you want to delete?')) return;

    try {
        const res = await fetch('/API/books/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id })
        });

        if (res.ok) fetchBooks(currentPage, currentSearchQuery);
    } catch (_) { }
}

async function populateAuthorSelect() {
    if (!authorSelect) return;

    try {
        const res = await fetch('/API/authors/read.php?limit=9999&offset=0');
        if (!res.ok) return;

        let authors = await res.json();
        if (typeof authors === 'object' && authors !== null && !Array.isArray(authors)) {
            authors = Object.values(authors);
        }

        authorOptions = authors;

        authorSelect.innerHTML = '<option value="">Select an Author</option>';
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.author_id;
            option.textContent = author.name;
            authorSelect.appendChild(option);
        });
    } catch (_) {
        authorSelect.innerHTML = '<option value="">Error loading authors</option>';
        authorSelect.disabled = true;
    }
}

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentSearchQuery = searchInput.value.trim();
        fetchBooks(0, currentSearchQuery);
    });
}

fetchBooks();
populateAuthorSelect();
