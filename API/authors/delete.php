<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['author_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Author ID is required']);
    exit;
}

$author_id = (int) $data['author_id'];

try {
    $pdo = connect();
    $stmt = $pdo->prepare("DELETE FROM authors WHERE author_id = :author_id");
    $stmt->execute([':author_id' => $author_id]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete author']);
}
