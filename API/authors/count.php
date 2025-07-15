<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

function countAuthors()
{
    $pdo = connect();
    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM authors");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return (int) $row['total'];
}

echo json_encode(['total' => countAuthors()]);
