<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$book_id = $data['book_id'] ?? null;

if (!$book_id) {
    http_response_code(400);
    exit;
}

try {
    $pdo = connect();
    $stmt = $pdo->prepare("DELETE FROM books WHERE book_id = :book_id");
    $success = $stmt->execute([':book_id' => $book_id]);

    if (!$success) {
        http_response_code(500);
    }
} catch (Exception) {
    http_response_code(500);
}
