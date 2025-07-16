<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$author_id = $data['author_id'] ?? null;

if (!$author_id) {
    http_response_code(400);
    exit;
}

try {
    $pdo = connect();
    $stmt = $pdo->prepare("DELETE FROM authors WHERE author_id = :author_id");
    $success = $stmt->execute([':author_id' => $author_id]);

    if (!$success) {
        http_response_code(500);
    }
} catch (Exception) {
    http_response_code(500);
}
