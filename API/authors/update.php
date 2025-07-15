<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['author_id']) || !isset($data['name']) || trim($data['name']) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Author ID and Name are required']);
    exit;
}

$author_id = (int) $data['author_id'];
$name = trim($data['name']);

try {
    $pdo = connect();
    $stmt = $pdo->prepare("UPDATE authors SET name_author = :name WHERE author_id = :author_id");
    $stmt->execute([':name' => $name, ':author_id' => $author_id]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update author']);
}
