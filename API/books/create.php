<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$author_id = $data['author_id'] ?? null;
$title = $data['title'] ?? null;

if (!$author_id || !$title) {
    http_response_code(400);
    echo json_encode(['error' => 'author_id e title são obrigatórios']);
    exit;
}

try {
    $pdo = connect();
    $title = ucwords(strtolower(trim($title)));
    $stmt = $pdo->prepare("INSERT INTO books (author_id, title) VALUES (:author_id, :title)");
    $stmt->execute([':author_id' => $author_id, ':title' => $title]);
    echo json_encode(['success' => true, 'book_id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao criar livro: ' . $e->getMessage()]);
}
