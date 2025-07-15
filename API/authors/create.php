<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || trim($data['name']) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Name is required']);
    exit;
}

$name = trim($data['name']);

try {
    $pdo = connect();
    $stmt = $pdo->prepare("INSERT INTO authors (name_author) VALUES (:name)");
    $stmt->execute([':name' => $name]);

    echo json_encode(['success' => true, 'author_id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create author']);
}
