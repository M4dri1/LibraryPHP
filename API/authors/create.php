<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || trim($data['name']) === '') {
    http_response_code(400);
    exit;
}
$name = ucwords(strtolower(trim($data['name'])));


try {
    $pdo = connect();
    $stmt = $pdo->prepare("INSERT INTO authors (name_author) VALUES (:name)");
    $success = $stmt->execute([':name' => $name]);

    if (!$success) {
        http_response_code(500);
        exit;
    }
} catch (Exception) {
    http_response_code(500);
}
