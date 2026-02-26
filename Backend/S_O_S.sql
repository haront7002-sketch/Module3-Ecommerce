-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: s_o_s
-- ------------------------------------------------------
-- Server version	8.0.44

CREATE DATABASE IF NOT EXISTS `s_o_s`;
USE `s_o_s`;

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `quantity` int NOT NULL,
  `added_at` timestamp NOT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Social Vibes'),(2,'Intellectual & Skills'),(3,'Arts & Culture'),(4,'Wellness & Body'),(5,'Creative, Making'),(6,'Community & Cause'),(7,'Professional Networking'),(8,'Life Stages & Niches'),(9,'Seasonal, Annual'),(10,'Weird & Hyperlocal'),(11,'Food & Drink'),(12,'Music & Nightlife'),(13,'Sports & Adventure'),(14,'Family & Kids'),(15,'Spirituality & Mindfulness');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL,
  `event_title` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(100) DEFAULT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'AI & Future Tech Workshop','Hands-on workshop exploring AI tools for business and creativity.','2026-03-22','10:00:00','Workshop17, Kloof Street, Cape Town',350.00,'https://i.postimg.cc/MpNY8y7N/tech-workshop.jpg',2,'2026-02-24 09:12:43'),(3,'First Thursdays – City Walk','Monthly art walk with galleries open late, live music, and street performances.','2026-03-05','17:00:00','Bree Street / Church Street, Cape Town',0.00,'https://i.postimg.cc/xT7mk9Xv/First-Thursday.jpg',3,'2026-02-24 09:12:43'),(4,'Sunrise Yoga at Clifton','Start your day with beachfront yoga, followed by healthy smoothies.','2026-03-08','06:30:00','Clifton 4th Beach, Cape Town',120.00,'https://i.postimg.cc/VN4LCFKh/clifton-yoga.webp',4,'2026-02-24 09:12:43'),(5,'Pottery & Pizza Night','Paint your own ceramics while enjoying wood-fired pizza and wine.','2026-03-12','18:00:00','Clay Cafe, Hout Bay',280.00,'https://i.postimg.cc/bwyvNMT9/poetry-night.jpg',5,'2026-02-24 09:12:43'),(6,'Beach Clean-Up & Braai','Help clean the beach, then join a community braai afterwards.','2026-03-21','09:00:00','Muizenberg Beach',0.00,'https://i.postimg.cc/YSFTc2WP/beach-clean-up.jpg',6,'2026-02-24 09:12:43'),(7,'Creative Mornings Cape Town','Monthly breakfast lecture for creatives — topic: \"Fearless.\"','2026-03-27','08:30:00','The Galileo, V&A Waterfront',0.00,'https://i.postimg.cc/wM1hPMtT/creative-mornings.webp',7,'2026-02-24 09:12:43'),(8,'New Parents Meet-Up','A safe space for new parents to connect, share, and relax with their babies.','2026-03-10','10:00:00','The Little Sunshine Centre, Observatory',0.00,'https://i.postimg.cc/mrZVjbSg/new-parents-meet-up.webp',8,'2026-02-24 09:12:43'),(9,'Kirstenbosch Summer Sunset Concert','Outdoor concert featuring top local artists — bring a picnic and blanket.','2026-03-14','17:30:00','Kirstenbosch Botanical Gardens',220.00,'https://i.postimg.cc/133NY4LV/Kirstenbosch-Summer-Sunset-Concert-Series-3-scaled.jpg',9,'2026-02-24 09:12:43'),(10,'The Great SA Arm Wrestling Championship','Exactly what it sounds like. Arm wrestling. Local legends. Weird prizes.','2026-03-20','19:00:00','Armchair Theatre, Obs',80.00,'https://i.postimg.cc/L4V5K2kk/arm-wrestling.webp',10,'2026-02-24 09:12:43'),(11,'Cape Town Comedy Night','Line-up of SA\'s funniest comedians — 18+ show.','2026-03-19','20:00:00','Cape Town Comedy Club, V&A Waterfront',150.00,'https://i.postimg.cc/c4bs0HvW/comedy-night.webp',3,'2026-02-24 09:12:43'),(12,'Forest Bathing & Mindfulness Walk','Guided slow walk through the forest to reduce stress and reconnect with nature.','2026-03-13','09:00:00','Newlands Forest',180.00,'https://i.postimg.cc/bwk4WNkq/forest-bathing.jpg',4,'2026-02-24 09:12:43'),(13,'First Rays – Silent Disco at Sunrise','Watch the sunrise over Cape Town while dancing to your own silent disco channel.','2026-03-28','06:00:00','Signal Hill, Cape Town',200.00,'https://i.postimg.cc/nrm6xHgZ/silent-disco.jpg',1,'2026-02-24 09:12:43'),(14,'Macramé Plant Hanger Workshop','Learn to make your own macramé plant hanger — all materials included, drinks for sale.','2026-03-18','18:30:00','The Woodstock Foundry',320.00,'https://i.postimg.cc/cCWcK06v/macrame-Plant-Hanger-Workshop.jpg',5,'2026-02-24 09:12:43'),(15,'Tech Winter Social','Informal networking for tech folks — first drink included.','2026-03-26','18:00:00','Grub & Vine, Bree Street',100.00,'https://i.postimg.cc/9MY7nTFq/tech-winter-social.jpg',7,'2026-02-24 09:12:43'),(16,'Silo District Sunset Social','A casual evening of music, street food, and networking with young professionals.','2026-03-15','17:00:00','Silo District, \nV&A Waterfront, Cape Town',150.00,'https://i.postimg.cc/fRDNf9SS/silo-disco.jpg',1,'2026-02-25 07:43:52');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favourites` (
  `favourites_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`favourites_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `items_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `event_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`items_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_categories`
--

DROP TABLE IF EXISTS `user_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_categories` (
  `user_category_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`user_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_categories`
--

LOCK TABLES `user_categories` WRITE;
/*!40000 ALTER TABLE `user_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) NOT NULL,
  `user_surname` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `area` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25 13:11:26
