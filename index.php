<?php
function connect()
{
    $server = "localhost";
    $user = "root";
    $password = "12345678";
    $dbname = "library1";

    try {
        $pdo = new PDO("mysql:host=$server;dbname=$dbname", $user, $password);
        $pdo->exec("SET CHARACTER SET utf8");
    } catch (\Throwable $th) {
        die("Connection error: " . $th->getMessage());
    }

    return $pdo;
}

function get($limit = 5, $offset = 0, $search = '')
{
    $pdo = connect();
    if ($search) {
        $stmt = $pdo->prepare("SELECT * FROM books WHERE title LIKE :search LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM books LIMIT :limit OFFSET :offset");
    }
    $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function count_books($search = '')
{
    $pdo = connect();
    if ($search) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM books WHERE title LIKE :search");
        $stmt->execute([':search' => '%' . $search . '%']);
    } else {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM books");
    }
    return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
}

function add($author_id, $title)
{
    $pdo = connect();
    $title = ucwords(strtolower($title));
    $title = trim($title);
    $sql = "INSERT INTO books (author_id, title) VALUES (:author_id, :title)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':author_id' => $author_id,
        ':title' => $title
    ]);
}

function delete($book_id)
{
    $pdo = connect();
    $sql = "DELETE FROM books WHERE book_id = :book_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':book_id' => $book_id]);
}

function update($book_id, $author_id, $title)
{
    $pdo = connect();
    $title = ucwords(strtolower($title));
    $title = trim($title);
    $sql = "UPDATE books SET author_id = :author_id, title = :title WHERE book_id = :book_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':book_id' => $book_id,
        ':author_id' => $author_id,
        ':title' => $title
    ]);
}

$search = $_GET['search'] ?? '';
$edit_mode = $_GET['edit'] ?? null;

$perPage = 5;
$totalBooks = count_books($search);
$totalPages = ceil($totalBooks / $perPage);
$currentPage = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$currentPage = max(1, min($totalPages, $currentPage));
$offset = ($currentPage - 1) * $perPage;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['add'])) {
        $author_id = $_POST['author_id'] ?? null;
        $title = $_POST['title'] ?? null;



        if ($author_id && $title) {
            add($author_id, $title);
        }
    }

    if (isset($_POST['delete'])) {
        $book_id = $_POST['book_id'] ?? null;
        if ($book_id) {
            delete($book_id);
        }
    }

    if (isset($_POST['edit'])) {
        $book_id = $_POST['book_id'];
        header("Location: ?search=" . urlencode($search) . "&page=" . $currentPage . "&edit=" . $book_id);
        exit;
    }

    if (isset($_POST['save'])) {
        $book_id = $_POST['book_id'];
        $author_id = $_POST['author_id'];
        $title = $_POST['title'];
        update($book_id, $author_id, $title);
    }

    header("Location: ?search=" . urlencode($search) . "&page=" . $currentPage);
    exit;
}

$books = get($perPage, $offset, $search);
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <title>Library</title>
    <link rel="stylesheet" href="app.css" />
</head>

<body>
    <header>
        <h1>Library</h1>
    </header>
    <main>
        <section class="form-section">
            <h2>Add Book</h2>
            <form method="post">
                <label>Author ID:</label><br />
                <input type="number" name="author_id" required /><br /><br />
                <label>Title:</label><br />
                <input type="text" name="title" required /><br /><br />
                <button type="submit" name="add">Add Book</button>
            </form>
        </section>
        <section class="search-section">
            <h2>Search Books</h2>
            <form method="get">
                <input type="text" name="search" placeholder="Search by title"
                    value="<?= htmlspecialchars($search) ?>" />
                <button type="submit">Search</button>
            </form>
        </section>
        <?php if (!empty($books)): ?>
            <section class="book-list">
                <h2>Books</h2>
                <table border="1">
                    <tr>
                        <th>ID</th>
                        <th>Author ID</th>
                        <th>Title</th>
                        <th>Actions</th>
                        <p>Total books found: <?= $totalBooks ?></p>
                    </tr>
                    <?php foreach ($books as $book): ?>
                        <tr>
                            <?php if ($edit_mode == $book['book_id']): ?>
                                <form method="post">
                                    <td>
                                        <?= $book['book_id'] ?>
                                        <input type="hidden" name="book_id" value="<?= $book['book_id'] ?>" />
                                    </td>
                                    <td>
                                        <input type="number" name="author_id" value="<?= $book['author_id'] ?>" required />
                                    </td>
                                    <td>
                                        <input type="text" name="title" value="<?= htmlspecialchars($book['title']) ?>" required />
                                    </td>
                                    <td>
                                        <button type="submit" name="save">Save</button>
                                    </td>
                                </form>
                            <?php else: ?>
                                <td><?= $book['book_id'] ?></td>
                                <td><?= $book['author_id'] ?></td>
                                <td><?= htmlspecialchars($book['title']) ?></td>
                                <td>
                                    <form method="post" style="display:inline;">
                                        <input type="hidden" name="book_id" value="<?= $book['book_id'] ?>" />
                                        <button type="submit" name="edit">Edit</button>
                                    </form>
                                    <form method="post" style="display:inline;">
                                        <input type="hidden" name="book_id" value="<?= $book['book_id'] ?>" />
                                        <button type="submit" name="delete"
                                            onclick="return confirm('Are you sure you want to delete this book?')">Delete</button>
                                    </form>
                                </td>
                            <?php endif; ?>
                        </tr>
                    <?php endforeach; ?>
                </table>

                <div class="pagination">
                    <p>Page <?= $currentPage ?> of <?= $totalPages ?></p>
                    <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                        <a href="?search=<?= urlencode($search) ?>&page=<?= $i ?>">
                            <?= $i ?>
                        </a>
                    <?php endfor; ?>
                </div>
            </section>
        <?php endif; ?>
    </main>

    <footer>
        <p>&copy; 2025 Library System</p>
    </footer>
</body>

</html>