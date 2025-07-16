<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

function get($limit = 5, $offset = 0, $search = '')
{
    $pdo = connect();

    $limit = (int) $limit;
    $offset = (int) $offset;

    if ($search) {
        $stmt = $pdo->prepare("SELECT b.book_id, b.author_id, a.name_author AS author_name, b.title 
                               FROM books b 
                               JOIN authors a ON b.author_id = a.author_id 
                               WHERE b.title LIKE :search 
                               ORDER BY b.book_id ASC 
                               LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
    } else {
        $stmt = $pdo->prepare("SELECT b.book_id, b.author_id, a.name_author AS author_name, b.title 
                               FROM books b 
                               JOIN authors a ON b.author_id = a.author_id 
                               ORDER BY b.book_id ASC 
                               LIMIT :limit OFFSET :offset");
    }

    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

try {
    $limit = $_GET['limit'] ?? 5;
    $offset = $_GET['offset'] ?? 0;
    $search = $_GET['search'] ?? '';

    $books = get($limit, $offset, $search);
    echo json_encode($books);
} catch (Exception) {
    http_response_code(500);
}
