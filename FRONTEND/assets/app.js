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

async function fetchBooks(page = 0, searchQuery = '') {
    const offset = page * limit;

    try {
        let url = `/API/books/read.php?limit=${limit}&offset=${offset}`;
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const books = await res.json();

        let totalUrl = `/API/books/count.php`;
        if (searchQuery) {
            totalUrl += `?search=${encodeURIComponent(searchQuery)}`;
        }
        const totalRes = await fetch(totalUrl);
        if (!totalRes.ok) throw new Error(`HTTP error! status: ${totalRes.status}`);
        const { total } = await totalRes.json();

        if (booksTableBody) {
            if (books.length === 0 && searchQuery) {
                booksTableBody.innerHTML = '';
                if (noResultsMessage) {
                    noResultsMessage.style.display = 'block';
                }
            } else {
                booksTableBody.innerHTML = books.map(book => `
                    <tr data-book-id="${book.book_id}">
                        <td>${book.book_id}</td>
                        <td class="author_id">${book.author_id}</td>
                        <td>${book.author_name}</td>
                        <td class="title">${book.title}</td>
                        <td>
                            <button onclick="startEditBook(${book.book_id})">Edit</button>
                            <button onclick="deleteBook(${book.book_id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
                if (noResultsMessage) {
                    noResultsMessage.style.display = 'none';
                }
            }
        } else {
            console.error("Element #books-table tbody not found. Cannot update table.");
        }

        currentPage = page;
        renderPagination(Math.ceil(total / limit));
    } catch (error) {
        console.error("Error loading books:", error);
        if (booksTableBody) {
            booksTableBody.innerHTML = `<tr><td colspan="5">Failed to load books.</td></tr>`;
        } else {
            console.error("Could not display error message in table: #books-table tbody is null.");
        }
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }
}

function renderPagination(totalPages) {
    if (paginationDiv) {
        if (totalPages > 1) {
            paginationDiv.style.display = 'block';
        } else {
            paginationDiv.style.display = 'none';
        }

        paginationDiv.innerHTML = '';

        for (let i = 0; i < totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i + 1;
            btn.className = i === currentPage ? 'active' : '';
            btn.onclick = () => fetchBooks(i, currentSearchQuery);
            paginationDiv.appendChild(btn);
        }
    } else {
        console.error("Element #pagination not found. Cannot render pagination.");
    }
}

function startEditBook(book_id) {
    const row = document.querySelector(`tr[data-book-id="${book_id}"]`);
    if (!row) return;

    const authorIdCell = row.querySelector('.author_id');
    const titleCell = row.querySelector('.title');
    const actionsCell = row.querySelector('td:last-child');

    const currentAuthorId = authorIdCell.textContent;
    const currentTitle = titleCell.textContent;

    authorIdCell.innerHTML = `<input type="number" value="${currentAuthorId}" />`;
    titleCell.innerHTML = `<input type="text" value="${currentTitle}" />`;

    actionsCell.innerHTML = `
        <button onclick="saveEditBook(${book_id})">Save</button>
        <button onclick="cancelEditBook(${book_id}, '${currentAuthorId}', '${currentTitle.replace(/'/g, "\\'")}')">Cancel</button>
    `;
}

async function saveEditBook(book_id) {
    const row = document.querySelector(`tr[data-book-id="${book_id}"]`);
    if (!row) return;

    const authorIdInput = row.querySelector('.author_id input');
    const titleInput = row.querySelector('.title input');

    const updatedAuthorId = authorIdInput.value.trim();
    const updatedTitle = titleInput.value.trim();

    if (!updatedAuthorId || !updatedTitle) {
        console.warn('Author ID and Title cannot be empty');
        return;
    }

    const data = {
        book_id: book_id,
        author_id: updatedAuthorId,
        title: updatedTitle
    };

    try {
        const res = await fetch('/API/books/update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Failed to update book');

        fetchBooks(currentPage, currentSearchQuery);
    } catch (error) {
        console.error('Error updating book: ' + error.message);
    }
}

function cancelEditBook(book_id, oldAuthorId, oldTitle) {
    const row = document.querySelector(`tr[data-book-id="${book_id}"]`);
    if (!row) return;

    const authorIdCell = row.querySelector('.author_id');
    const titleCell = row.querySelector('.title');
    const actionsCell = row.querySelector('td:last-child');

    authorIdCell.textContent = oldAuthorId;
    titleCell.textContent = oldTitle;

    actionsCell.innerHTML = `
        <button onclick="startEditBook(${book_id})">Edit</button>
        <button onclick="deleteBook(${book_id})">Delete</button>
    `;
}

bookForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(bookForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.author_id) {
        console.warn('Please select an author.');
        return;
    }
    if (!data.title || data.title.trim() === '') {
        console.warn('Title cannot be empty.');
        return;
    }

    try {
        const res = await fetch('/API/books/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to add book');
        bookForm.reset();
        fetchBooks(currentPage, currentSearchQuery);
    } catch (error) {
        console.error('Error adding book: ' + error.message);
    }
};

async function deleteBook(book_id) {
    if (!window.confirm('Are you sure you want to delete?')) return;

    try {
        const res = await fetch('/API/books/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id })
        });
        if (!res.ok) throw new Error('Failed to delete book');
        fetchBooks(currentPage, currentSearchQuery);
    } catch (error) {
        console.error('Error deleting book: ' + error.message);
    }
}

async function populateAuthorSelect() {
    if (!authorSelect) {
        console.error("Element #author-select not found. Cannot populate authors dropdown.");
        return;
    }

    try {
        const res = await fetch('/API/authors/read.php?limit=9999&offset=0');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        let authors = await res.json();

        if (typeof authors === 'object' && authors !== null && !Array.isArray(authors)) {
            authors = Object.values(authors);
        }

        authorSelect.innerHTML = '<option value="">Select an Author</option>';

        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.author_id;
            option.textContent = author.name;
            authorSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading authors for select:", error);
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
} else {
    console.error("Element #search-form not found. Search functionality will not work.");
}

fetchBooks();
populateAuthorSelect();