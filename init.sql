-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: library1
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table authors
--

DROP TABLE IF EXISTS authors;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE authors (
  author_id int NOT NULL AUTO_INCREMENT,
  name_author varchar(100) NOT NULL,
  biography text,
  PRIMARY KEY (author_id)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table authors
--

LOCK TABLES authors WRITE;
/*!40000 ALTER TABLE authors DISABLE KEYS */;
INSERT INTO authors VALUES (1,'Guilherme Biondo','Guilherme Biondo is a writer who started writing at a young age, driven by curiosity and a passion for storytelling. His books talk about people, feelings, and everything that is part of everyday life, but with a unique and sincere perspective.'),(2,'Manoel Leite','Manoel Leite is an author and keen observer of daily life. His stories arise from simple experiences, but full of meaning. With a direct and human writing style, Manoel aims to touch the reader with themes about memory, affection, and identity.');
/*!40000 ALTER TABLE authors ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table book_categories
--

DROP TABLE IF EXISTS book_categories;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE book_categories (
  book_id int NOT NULL,
  category_id int NOT NULL,
  PRIMARY KEY (book_id,category_id),
  KEY category_id (category_id),
  CONSTRAINT book_categories_ibfk_1 FOREIGN KEY (book_id) REFERENCES books (book_id),
  CONSTRAINT book_categories_ibfk_2 FOREIGN KEY (category_id) REFERENCES categories (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table book_categories
--

LOCK TABLES book_categories WRITE;
/*!40000 ALTER TABLE book_categories DISABLE KEYS */;
INSERT INTO book_categories VALUES (1,1),(5,1),(9,1),(13,1),(16,1),(17,1),(20,1),(2,2),(3,2),(7,2),(8,2),(11,2),(12,2),(15,2),(18,2),(20,2),(4,3),(6,3),(10,3),(14,3),(19,3),(1,4),(3,4),(4,4),(5,4),(7,4),(10,4),(13,4),(17,4);
/*!40000 ALTER TABLE book_categories ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table book_publishers
--

DROP TABLE IF EXISTS book_publishers;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE book_publishers (
  book_id int NOT NULL,
  publish_id int NOT NULL,
  PRIMARY KEY (book_id,publish_id),
  KEY publish_id (publish_id),
  CONSTRAINT book_publishers_ibfk_1 FOREIGN KEY (book_id) REFERENCES books (book_id),
  CONSTRAINT book_publishers_ibfk_2 FOREIGN KEY (publish_id) REFERENCES publishers (publish_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table book_publishers
--

LOCK TABLES book_publishers WRITE;
/*!40000 ALTER TABLE book_publishers DISABLE KEYS */;
INSERT INTO book_publishers VALUES (1,1),(4,1),(5,1),(8,1),(10,1),(13,1),(16,1),(18,1),(2,2),(6,2),(9,2),(12,2),(15,2),(19,2),(3,3),(7,3),(11,3),(14,3),(17,3),(20,3);
/*!40000 ALTER TABLE book_publishers ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table books
--

DROP TABLE IF EXISTS books;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE books (
  book_id int NOT NULL AUTO_INCREMENT,
  author_id int DEFAULT NULL,
  title varchar(100) NOT NULL,
  PRIMARY KEY (book_id),
  KEY author_id (author_id),
  CONSTRAINT books_ibfk_1 FOREIGN KEY (author_id) REFERENCES authors (author_id)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table books
--

LOCK TABLES books WRITE;
/*!40000 ALTER TABLE books DISABLE KEYS */;
INSERT INTO books VALUES (1,1,'Life in Silence'),(2,1,'Fragments of Everyday Life'),(3,2,'Stories of the Wind'),(4,2,'Between Noise and Calm'),(5,1,'The Horizon and the Sea'),(6,1,'Winds of Change'),(7,2,'Paths of the Soul'),(8,2,'Under the Grey Sky'),(9,1,'Notes of a Silence'),(10,2,'The Last Letter'),(11,1,'Between Words'),(12,2,'Colors of the City'),(13,1,'The Weight of the Rain'),(14,2,'Blue Night'),(15,1,'Faces of Memory'),(16,2,'Origin Tales'),(17,1,'Fragments of Hope'),(18,2,'Trails and Scars'),(19,1,'From the Other Side of the Street'),(20,2,'Interrupted Seasons');
/*!40000 ALTER TABLE books ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table categories
--

DROP TABLE IF EXISTS categories;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE categories (
  category_id int NOT NULL AUTO_INCREMENT,
  name_category varchar(100) NOT NULL,
  PRIMARY KEY (category_id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table categories
--

LOCK TABLES categories WRITE;
/*!40000 ALTER TABLE categories DISABLE KEYS */;
INSERT INTO categories VALUES (1,'Romance'),(2,'Chronicle'),(3,'Fiction'),(4,'Drama');
/*!40000 ALTER TABLE categories ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table loans
--

DROP TABLE IF EXISTS loans;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE loans (
  loans_id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  book_id int DEFAULT NULL,
  loan_date datetime NOT NULL,
  PRIMARY KEY (loans_id),
  KEY user_id (user_id),
  KEY book_id (book_id),
  CONSTRAINT loans_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT loans_ibfk_2 FOREIGN KEY (book_id) REFERENCES books (book_id)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table loans
--

LOCK TABLES loans WRITE;
/*!40000 ALTER TABLE loans DISABLE KEYS */;
INSERT INTO loans VALUES (1,1,1,'2025-06-10 14:30:00'),(2,2,3,'2025-06-12 10:00:00'),(3,3,4,'2025-06-13 16:45:00'),(4,1,5,'2025-06-14 09:15:00'),(5,2,6,'2025-06-15 11:20:00'),(6,3,7,'2025-06-15 15:45:00'),(7,1,8,'2025-06-16 08:00:00');
/*!40000 ALTER TABLE loans ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table publishers
--

DROP TABLE IF EXISTS publishers;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE publishers (
  publish_id int NOT NULL AUTO_INCREMENT,
  publish_name varchar(100) NOT NULL,
  PRIMARY KEY (publish_id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table publishers
--

LOCK TABLES publishers WRITE;
/*!40000 ALTER TABLE publishers DISABLE KEYS */;
INSERT INTO publishers VALUES (1,'Aurora Publishing'),(2,'Books of Time'),(3,'House of Letters');
/*!40000 ALTER TABLE publishers ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table users
--

DROP TABLE IF EXISTS users;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE users (
  user_id int NOT NULL AUTO_INCREMENT,
  full_name varchar(100) NOT NULL,
  birth_date date NOT NULL,
  address varchar(200) NOT NULL,
  email varchar(100) DEFAULT NULL,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table users
--

LOCK TABLES users WRITE;
/*!40000 ALTER TABLE users DISABLE KEYS */;
INSERT INTO users VALUES (1,'Kayky Brabo','2005-01-30','Rua Helena Carvalho, 470 - Marília/SP','kayky.brabo@pedbot.com.br'),(2,'Marcelo Silva','2005-12-17','Rua 25 de Março, 22 - Oriente/SP',NULL),(3,'Lucas Ferreira','1997-03-31','Rua Jose Carlos, 135 - Marília/SP','lucasfer2@gmail.com');
/*!40000 ALTER TABLE users ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-27 10:20:22
