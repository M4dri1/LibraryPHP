<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$book_id = $data['book_id'] ?? null;

if (!$book_id) {
    http_response_code(400);
    echo json_encode(['error' => 'book_id é obrigatório']);
    exit;
}

try {
    $pdo = connect();
    $stmt = $pdo->prepare("DELETE FROM books WHERE book_id = :book_id");
    $stmt->execute([':book_id' => $book_id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao deletar livro: ' . $e->getMessage()]);
}
