<?php
require_once(__DIR__ . '/../DB/connection.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['book_id'], $data['author_id'], $data['title'])) {
    http_response_code(400);
    exit;
}

$title = ucwords(strtolower(trim($data['title'])));
$book_id = (int) $data['book_id'];
$author_id = (int) $data['author_id'];

if ($book_id <= 0 || $author_id <= 0 || empty($title)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ID or empty title']);
    exit;
}

try {
    $pdo = connect();

    $check = $pdo->prepare("SELECT COUNT(*) FROM books WHERE book_id = ?");
    $check->execute([$book_id]);

    if ($check->fetchColumn() == 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Book ID does not exist.']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE books SET author_id = :author_id, title = :title WHERE book_id = :book_id");
    $stmt->execute([
        ':author_id' => $author_id,
        ':title' => $title,
        ':book_id' => $book_id
    ]);

    http_response_code(200);
} catch (PDOException $e) {
    if ($e->getCode() === '23000' && str_contains($e->getMessage(), 'foreign key')) {
        http_response_code(400);
        echo json_encode(['error' => 'Author ID does not exist.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
