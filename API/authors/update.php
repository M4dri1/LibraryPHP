<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['author_id'], $data['name']) || trim($data['name']) === '') {
    http_response_code(400);
    exit;
}

$name = ucwords(strtolower(trim($data['name'])));
$author_id = (int) $data['author_id'];

try {
    $pdo = connect();
    $stmt = $pdo->prepare("UPDATE authors SET name_author = :name WHERE author_id = :author_id");
    $success = $stmt->execute([':name' => $name, ':author_id' => $author_id]);

    if (!$success) {
        http_response_code(500);
    }
} catch (Exception) {
    http_response_code(500);
}
