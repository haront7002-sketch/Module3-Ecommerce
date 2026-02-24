-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: s_o_s
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Social Vibes'),(2,'Intellectual & Skills'),(3,'Arts & Culture'),(4,'Wellness & Body'),(5,'Creative, Making'),(6,'Community & Cause'),(7,'Professional Networking'),(8,'Life Stages & Niches'),(9,'Seasonal, Annual'),(10,'Weird & Hyperlocal'),(11,'Food & Drink'),(12,'Music & Nightlife'),(13,'Sports & Adventure'),(14,'Family & Kids'),(15,'Spirituality & Mindfulness');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Silo District Sunset Social','A casual evening of music, street food, and networking with young professionals.','2026-03-15','17:00:00','Silo District, V&A Waterfront, Cape Town',150.00,NULL,1,'2026-02-24 09:12:43'),(2,'AI & Future Tech Workshop','Hands-on workshop exploring AI tools for business and creativity.','2026-03-22','10:00:00','Workshop17, Kloof Street, Cape Town',350.00,NULL,2,'2026-02-24 09:12:43'),(3,'First Thursdays – City Walk','Monthly art walk with galleries open late, live music, and street performances.','2026-03-05','17:00:00','Bree Street / Church Street, Cape Town',0.00,NULL,3,'2026-02-24 09:12:43'),(4,'Sunrise Yoga at Clifton','Start your day with beachfront yoga, followed by healthy smoothies.','2026-03-08','06:30:00','Clifton 4th Beach, Cape Town',120.00,NULL,4,'2026-02-24 09:12:43'),(5,'Pottery & Pizza Night','Paint your own ceramics while enjoying wood-fired pizza and wine.','2026-03-12','18:00:00','Clay Cafe, Hout Bay',280.00,NULL,5,'2026-02-24 09:12:43'),(6,'Beach Clean-Up & Braai','Help clean the beach, then join a community braai afterwards.','2026-03-21','09:00:00','Muizenberg Beach',0.00,NULL,6,'2026-02-24 09:12:43'),(7,'Creative Mornings Cape Town','Monthly breakfast lecture for creatives — topic: \"Fearless.\"','2026-03-27','08:30:00','The Galileo, V&A Waterfront',0.00,NULL,7,'2026-02-24 09:12:43'),(8,'New Parents Meet-Up','A safe space for new parents to connect, share, and relax with their babies.','2026-03-10','10:00:00','The Little Sunshine Centre, Observatory',0.00,NULL,8,'2026-02-24 09:12:43'),(9,'Kirstenbosch Summer Sunset Concert','Outdoor concert featuring top local artists — bring a picnic and blanket.','2026-03-14','17:30:00','Kirstenbosch Botanical Gardens',220.00,NULL,9,'2026-02-24 09:12:43'),(10,'The Great SA Arm Wrestling Championship','Exactly what it sounds like. Arm wrestling. Local legends. Weird prizes.','2026-03-20','19:00:00','Armchair Theatre, Obs',80.00,NULL,10,'2026-02-24 09:12:43'),(11,'Cape Town Comedy Night','Line-up of SA\'s funniest comedians — 18+ show.','2026-03-19','20:00:00','Cape Town Comedy Club, V&A Waterfront',150.00,NULL,3,'2026-02-24 09:12:43'),(12,'Forest Bathing & Mindfulness Walk','Guided slow walk through the forest to reduce stress and reconnect with nature.','2026-03-13','09:00:00','Newlands Forest',180.00,NULL,4,'2026-02-24 09:12:43'),(13,'First Rays – Silent Disco at Sunrise','Watch the sunrise over Cape Town while dancing to your own silent disco channel.','2026-03-28','06:00:00','Signal Hill, Cape Town',200.00,NULL,1,'2026-02-24 09:12:43'),(14,'Macramé Plant Hanger Workshop','Learn to make your own macramé plant hanger — all materials included, drinks for sale.','2026-03-18','18:30:00','The Woodstock Foundry',320.00,NULL,5,'2026-02-24 09:12:43'),(15,'Tech Winter Social','Informal networking for tech folks — first drink included.','2026-03-26','18:00:00','Grub & Vine, Bree Street',100.00,NULL,7,'2026-02-24 09:12:43');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_categories`
--

LOCK TABLES `user_categories` WRITE;
/*!40000 ALTER TABLE `user_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_categories` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2026-02-24 11:22:32
