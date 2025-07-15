<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['book_id'], $data['author_id'], $data['title'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetros insuficientes']);
    exit;
}

$book_id = (int) $data['book_id'];
$author_id = (int) $data['author_id'];
$title = trim($data['title']);

if ($book_id <= 0 || $author_id <= 0 || empty($title)) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetros inválidos']);
    exit;
}

try {
    $pdo = connect();
    $stmt = $pdo->prepare("UPDATE books SET author_id = :author_id, title = :title WHERE book_id = :book_id");
    $success = $stmt->execute([
        ':author_id' => $author_id,
        ':title' => $title,
        ':book_id' => $book_id
    ]);
    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao atualizar o livro']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor: ' . $e->getMessage()]);
}
