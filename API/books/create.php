<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$author_id = $data['author_id'] ?? null;
$title = $data['title'] ?? null;

if (!$author_id || !$title) {
    http_response_code(400);
    exit;
}

try {
    $pdo = connect();
    $title = ucwords(string: strtolower(trim(string: $title)));
    $stmt = $pdo->prepare("INSERT INTO books (author_id, title) VALUES (:author_id, :title)");
    $success = $stmt->execute([':author_id' => $author_id, ':title' => $title]);

    if (!$success) {
        http_response_code(500);
        exit;
    }
} catch (Exception) {
    http_response_code(500);
}
