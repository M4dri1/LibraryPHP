<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

function getAuthors($limit = 5, $offset = 0, $search = '')
{
    $pdo = connect();

    $limit = (int) $limit;
    $offset = (int) $offset;

    if ($search) {
        $stmt = $pdo->prepare("SELECT author_id, name_author AS name FROM authors WHERE name_author LIKE :search LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':search', '%' . $search . '%', PDO::PARAM_STR);
    } else {
        $stmt = $pdo->prepare("SELECT author_id, name_author AS name FROM authors LIMIT :limit OFFSET :offset");
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

    $authors = getAuthors($limit, $offset, $search);
    echo json_encode($authors);
} catch (Exception) {
    http_response_code(500);
}
