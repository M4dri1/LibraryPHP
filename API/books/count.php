<?php
require_once(__DIR__ . '/../DB/connection.php');

header('Content-Type: application/json');

try {
    $pdo = connect();
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM books");
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    echo json_encode(['total' => (int) $total]);
} catch (Exception) {
    http_response_code(500);
}
