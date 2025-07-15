<?php
require_once(__DIR__ . '/../DB/connection.php');

header('Content-Type: application/json');

$pdo = connect();
$stmt = $pdo->query("SELECT COUNT(*) as total FROM books");
$total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode(['total' => (int) $total]);
