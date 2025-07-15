<?php
$env = parse_ini_file(__DIR__ . '/../../.env');
if (!$env) {
    die("Error loading .env file");
}

function connect()
{
    global $env;
    $dsn = "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']}";
    $pdo = new PDO($dsn, $env['DB_USER'], $env['DB_PASS']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}
