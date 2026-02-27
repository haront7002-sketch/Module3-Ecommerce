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
  PRIMARY KEY (`cart_id`),
  KEY `fk_cart_user` (`user_id`),
  KEY `fk_cart_event` (`event_id`),
  CONSTRAINT `fk_cart_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`event_id`),
  KEY `fk_events_category` (`category_id`),
  CONSTRAINT `fk_events_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'AI & Future Tech Workshop','Hands-on workshop exploring AI tools for business and creativity.','2026-03-22','10:00:00','Workshop17, Kloof Street, Cape Town',350.00,'https://i.postimg.cc/MpNY8y7N/tech-workshop.jpg',2,'2026-02-24 09:12:43'),(3,'First Thursdays – City Walk','Monthly art walk with galleries open late, live music, and street performances.','2026-03-05','17:00:00','Bree Street / Church Street, Cape Town',0.00,'https://i.postimg.cc/xT7mk9Xv/First-Thursday.jpg',3,'2026-02-24 09:12:43'),(4,'Sunrise Yoga at Clifton','Start your day with beachfront yoga, followed by healthy smoothies.','2026-03-08','06:30:00','Clifton 4th Beach, Cape Town',120.00,'https://i.postimg.cc/VN4LCFKh/clifton-yoga.webp',4,'2026-02-24 09:12:43'),(5,'Pottery & Pizza Night','Paint your own ceramics while enjoying wood-fired pizza and wine.','2026-03-12','18:00:00','Clay Cafe, Hout Bay',280.00,'https://i.postimg.cc/bwyvNMT9/poetry-night.jpg',5,'2026-02-24 09:12:43'),(6,'Beach Clean-Up & Braai','Help clean the beach, then join a community braai afterwards.','2026-03-21','09:00:00','Muizenberg Beach',0.00,'https://i.postimg.cc/YSFTc2WP/beach-clean-up.jpg',6,'2026-02-24 09:12:43'),(7,'Creative Mornings Cape Town','Monthly breakfast lecture for creatives — topic: \"Fearless.\"','2026-03-27','08:30:00','The Galileo, V&A Waterfront',0.00,'https://i.postimg.cc/wM1hPMtT/creative-mornings.webp',7,'2026-02-24 09:12:43'),(8,'New Parents Meet-Up','A safe space for new parents to connect, share, and relax with their babies.','2026-03-10','10:00:00','The Little Sunshine Centre, Observatory',0.00,'https://i.postimg.cc/mrZVjbSg/new-parents-meet-up.webp',8,'2026-02-24 09:12:43'),(9,'Kirstenbosch Summer Sunset Concert','Outdoor concert featuring top local artists — bring a picnic and blanket.','2026-03-14','17:30:00','Kirstenbosch Botanical Gardens',220.00,'https://i.postimg.cc/133NY4LV/Kirstenbosch-Summer-Sunset-Concert-Series-3-scaled.jpg',9,'2026-02-24 09:12:43'),(10,'The Great SA Arm Wrestling Championship','Exactly what it sounds like. Arm wrestling. Local legends. Weird prizes.','2026-03-20','19:00:00','Armchair Theatre, Obs',80.00,'https://i.postimg.cc/L4V5K2kk/arm-wrestling.webp',10,'2026-02-24 09:12:43'),(11,'Cape Town Comedy Night','Line-up of SA\'s funniest comedians — 18+ show.','2026-03-19','20:00:00','Cape Town Comedy Club, V&A Waterfront',150.00,'https://i.postimg.cc/c4bs0HvW/comedy-night.webp',3,'2026-02-24 09:12:43'),(12,'Forest Bathing & Mindfulness Walk','Guided slow walk through the forest to reduce stress and reconnect with nature.','2026-03-13','09:00:00','Newlands Forest',180.00,'https://i.postimg.cc/bwk4WNkq/forest-bathing.jpg',4,'2026-02-24 09:12:43'),(13,'First Rays – Silent Disco at Sunrise','Watch the sunrise over Cape Town while dancing to your own silent disco channel.','2026-03-28','06:00:00','Signal Hill, Cape Town',200.00,'https://i.postimg.cc/nrm6xHgZ/silent-disco.jpg',1,'2026-02-24 09:12:43'),(14,'Macramé Plant Hanger Workshop','Learn to make your own macramé plant hanger — all materials included, drinks for sale.','2026-03-18','18:30:00','The Woodstock Foundry',320.00,'https://i.postimg.cc/cCWcK06v/macrame-Plant-Hanger-Workshop.jpg',5,'2026-02-24 09:12:43'),(15,'Tech Winter Social','Informal networking for tech folks — first drink included.','2026-03-26','18:00:00','Grub & Vine, Bree Street',100.00,'https://i.postimg.cc/9MY7nTFq/tech-winter-social.jpg',7,'2026-02-24 09:12:43'),(16,'Silo District Sunset Social','A casual evening of music, street food, and networking with young professionals.','2026-03-15','17:00:00','Silo District, \nV&A Waterfront, Cape Town',150.00,'https://i.postimg.cc/fRDNf9SS/silo-disco.jpg',1,'2026-02-25 07:43:52'),(17,'Rooftop Sundowner at The Bank','Premium cocktail tasting with live DJ and 360° city views.','2026-02-27','17:00:00','The Bank Rooftop, Bree Street, Cape Town',180.00,'https://i.postimg.cc/HLQV3QXJ/Rooftop-Sundowner.jpg',1,'2026-02-26 11:18:03'),(18,'Financial Freedom Masterclass','Full-day workshop on investing, budgeting, and wealth creation.','2026-02-28','09:00:00','UCT Graduate School of Business, V&A Waterfront',650.00,'https://i.postimg.cc/pdx2W35r/Financial-Freedom-Masterclass.jpg',2,'2026-02-26 11:18:03'),(19,'Cape Town Fringe Festival – Opening Night','Multi-disciplinary performances celebrating local talent.','2026-02-27','19:00:00','The Artscape Theatre, Cape Town',250.00,'https://i.postimg.cc/0Ncq8jqf/Cape-Town-Fringe-Festival-Opening-Night.jpg',3,'2026-02-26 11:18:03'),(20,'CBD Rooftop Pilates','Sunrise mat Pilates overlooking Table Mountain.','2026-02-28','07:00:00','The Palace, Adderley Street',140.00,'https://i.postimg.cc/WzrNbV8Z/CBD-Rooftop-Pilates.jpg',4,'2026-02-26 11:18:03'),(21,'Watercolour & Wine Evening','Guided watercolour painting with a glass of wine included.','2026-04-02','18:30:00','The Drawing Room, Loop Street',380.00,'https://i.postimg.cc/HLfFWyh2/Watercolour-Wine-Evening.jpg',5,'2026-02-26 11:18:03'),(22,'Street Shelter Winter Drive','Collecting blankets and warm clothing for homeless shelters.','2026-04-05','10:00:00','St George\'s Cathedral, CBD',0.00,'https://i.postimg.cc/4dQwCHkf/Street-Shelter-Winter-Drive.jpg',6,'2026-02-26 11:18:03'),(23,'Women in Tech Breakfast','Panel discussion with female leaders in SA tech.','2026-04-05','08:00:00','Workshop17, Waterfront',220.00,'https://i.postimg.cc/FR6zHDQT/Women-in-Tech-Breakfast.jpg',7,'2026-02-26 11:18:03'),(24,'Underground Poetry Slam','Raw, uncensored spoken word in a speakeasy setting.','2026-04-09','20:00:00','The Dark Room, Long Street',80.00,'https://i.postimg.cc/1XPmtTjp/Underground-Poetry-Slam.jpg',10,'2026-02-26 11:18:03'),(25,'Camps Bay Beach Bonfire','Community bonfire with acoustic guitar and stargazing.','2026-04-12','18:00:00','Camps Bay Beach (north end)',100.00,'https://i.postimg.cc/KjZbFT1r/Camps-Bay-Beach-Bonfire.jpg',1,'2026-02-26 11:18:03'),(26,'Sea Point Promenade Parkrun Social','Casual 5km run/walk followed by coffee at Mojo Market.','2026-04-12','08:00:00','Sea Point Promenade (start at Pavilion)',0.00,'https://i.postimg.cc/1zQ9RXYS/seapoint-promenade.jpg',4,'2026-02-26 11:18:03'),(27,'Open Air Cinema: The Lion King','Outdoor movie screening with blankets and food trucks.','2026-04-15','19:00:00','The Galileo, The Glen Country Club, Clifton',140.00,'https://i.postimg.cc/x8jwBS79/Open-Air-Cinema-The-Lion-King.jpg',3,'2026-02-26 11:18:03'),(28,'Empty Nesters Wine Evening','Social mixer for parents adjusting to life after kids leave home.','2026-04-18','18:00:00','The Bantry Bay Lounge',250.00,'https://i.postimg.cc/wMbGPRL3/Empty-Nesters-Wine-Evening.jpg',8,'2026-02-26 11:18:03'),(29,'Gardening Masterclass: Fynbos Edition','Learn to grow and maintain indigenous fynbos in your garden.','2026-04-18','10:00:00','Kirstenbosch Botanical Society Hall',280.00,'https://i.postimg.cc/4N9PZ0Tr/Gardening-Masterclass-Fynbos-Edition.jpg',2,'2026-02-26 11:18:03'),(30,'Constantia Fresh Wine Route Festival','Wine tasting from 8 Constantia estates with live jazz.','2026-04-22','11:00:00','Groot Constantia Estate',350.00,'https://i.postimg.cc/jjg3CJ3c/Constantia-Fresh-Wine-Route-Festival.jpg',9,'2026-02-26 11:18:03'),(31,'Floral Arrangement Workshop','Create your own seasonal arrangement with local flowers.','2026-04-22','14:00:00','The Venue, Newlands Village',420.00,'https://i.postimg.cc/gjvKyw49/Floral-Arrangement-Workshop.jpg',5,'2026-02-26 11:18:03'),(32,'Wynberg Community Market','Local crafts, fresh produce, and food stalls.','2026-04-24','09:00:00','Wynberg Park',0.00,'https://i.postimg.cc/PfmbRwbg/ynberg-Community-Market.jpg',6,'2026-02-26 11:18:03'),(33,'Creative Industries Mixer','Informal networking for designers, writers, and artists.','2026-04-26','17:30:00','Truth Coffee, Buitenkant Street',120.00,'https://i.postimg.cc/ZKwdGFWQ/Creative-Industries-Mixer.jpg',7,'2026-02-26 11:18:03'),(34,'Mushroom Foraging Walk','Learn to identify wild mushrooms (identification only, not for eating).','2026-04-26','08:00:00','Tokai Forest (meet at main gate)',200.00,'https://i.postimg.cc/0NDrypNq/Mushroom-Foraging-Walk.jpg',10,'2026-02-26 11:18:03'),(35,'Lantern Festival at Spier','Release floating lanterns onto the dam with live music and food trucks.','2026-04-28','17:30:00','Spier Wine Farm, Stellenbosch',220.00,'https://i.postimg.cc/9M1mD151/Lantern-Festival-at-Spier.jpg',1,'2026-02-26 11:18:03'),(36,'Stellenbosch Street Soiree','Monthly street party with local bands, art stalls, and wine bars.','2026-04-29','18:00:00','Church Street, Stellenbosch',0.00,'https://i.postimg.cc/x1r2TBNm/Stellenbosch-Street-Soiree.jpg',3,'2026-02-26 11:18:03'),(37,'Wine Tasting 101: Masterclass','Learn proper tasting techniques from a certified sommelier.','2026-04-30','11:00:00','Delaire Graff Estate, Stellenbosch',550.00,'https://i.postimg.cc/s2wqSLx6/Wine-Tasting-101-Masterclass.jpg',2,'2026-02-26 11:18:03'),(38,'Jonkershoek Trail Run','Guided 8km trail run through fynbos and forest.','2026-04-30','07:30:00','Jonkershoek Nature Reserve',150.00,'https://i.postimg.cc/BnqGKHNq/Jonkershoek-Trail-Run.jpg',4,'2026-02-26 11:18:03'),(39,'Pottery on the Farm','Hand-building pottery workshop with farm-style lunch included.','2026-05-02','10:00:00','Rust en Vrede Gallery, Stellenbosch',390.00,'https://i.postimg.cc/B62hpwQx/Pottery-on-the-Farm.jpg',5,'2026-02-26 11:18:03'),(40,'Young Farmers Networking Braai','Networking event for young professionals in agriculture.','2026-05-02','12:00:00','Blaauwklippen Family Market',180.00,'https://i.postimg.cc/wvFN9hWp/Young-Farmers-Networking-Braai.jpg',8,'2026-02-26 11:18:03'),(41,'Helderberg Flower Show','Celebration of spring wildflowers with guided walks and stalls.','2026-05-05','09:00:00','Helderberg Nature Reserve, Somerset West',120.00,'https://i.postimg.cc/NGzybGZY/Helderberg-Flower-Show.jpg',9,'2026-02-26 11:18:03'),(42,'Strand Beach Clean-Up & Picnic','Clean the beach, then enjoy a community picnic.','2026-05-07','09:30:00','Strand Beach (Main Beach Pavilion)',0.00,'https://i.postimg.cc/MT4W0HHN/Strand-Beach-Clean-Up-Picnic.jpg',6,'2026-02-26 11:18:03'),(43,'Helderberg Business Breakfast','Monthly business networking with guest speaker.','2026-05-09','07:30:00','Erinvale Estate, Somerset West',280.00,'https://i.postimg.cc/zvCGJ5Dn/Helderberg-Business-Breakfast.jpg',7,'2026-02-26 11:18:03'),(44,'Sunrise SUP & Coffee','Stand-up paddleboarding lesson followed by coffee.','2026-05-09','06:30:00','Surfers Corner, Strand',320.00,'https://i.postimg.cc/tRNbCBtz/Sunrise-SUP-Coffee.jpg',4,'2026-02-26 11:18:03'),(45,'Harbour Sunset Cruise','Catamaran cruise with bubbly and snacks along the coastline.','2026-05-12','17:00:00','Gordon\'s Bay Harbour',380.00,'https://i.postimg.cc/KjZdMyrp/Harbour-Sunset-Cruise.jpg',1,'2026-02-26 11:18:03'),(46,'Bikini Beach Art Fair','Local artists display and sell work along the beachfront.','2026-05-14','10:00:00','Bikini Beach Pavilion, Gordon\'s Bay',0.00,'https://i.postimg.cc/cHdDDBKp/Bikini-Beach-Art-Fair.jpg',3,'2026-02-26 11:18:03'),(47,'Gordon\'s Bay Ghost Walk','Guided walking tour of haunted spots in old Gordon\'s Bay.','2026-05-14','20:00:00','Meet at The Tavern, Beach Road',150.00,'https://i.postimg.cc/tgBPj3vb/Gordon-s-Bay-Ghost-Walk.jpg',10,'2026-02-26 11:18:03'),(48,'Cape Point Lighthouse Tour & Breakfast','Early access to climb the lighthouse with breakfast afterwards.','2026-05-17','08:00:00','Cape Point Nature Reserve',450.00,'https://i.postimg.cc/Fs0P0KHk/Cape-Point-Lighthouse-Tour-Breakfast.jpg',9,'2026-02-26 11:18:03'),(49,'Cape of Good Hope Trail Challenge','12km guided trail run to Cape Point and back.','2026-05-18','07:00:00','Cape Point (start at Buffalo\'s Bay)',220.00,'https://i.postimg.cc/qqs86zxg/Cape-of-Good-Hope-Trail-Challenge.jpg',4,'2026-02-26 11:18:03'),(50,'Biodiversity Walk: Fynbos Discovery','Guided walk explaining unique fynbos ecology.','2026-05-20','10:00:00','Cape of Good Hope, Plateau Road Trail',180.00,'https://i.postimg.cc/CxQf1Gps/Biodiversity-Walk-Fynbos-Discovery.jpg',2,'2026-02-26 11:18:03'),(51,'Durbanville Hills Sundowner','Wine tasting platters with live piano at golden hour.','2026-05-20','17:00:00','Durbanville Hills Wine Estate',200.00,'https://i.postimg.cc/1tctp6b3/Durbanville-Hills-Sundowner.jpg',1,'2026-02-26 11:18:03'),(52,'Durbanville Farmers Market','Artisanal foods, crafts, and kids\' activities.','2026-05-23','08:00:00','Durbanville Racecourse',0.00,'https://i.postimg.cc/mgv2J8G5/Durbanville-Farmers-Market.jpg',6,'2026-02-26 11:18:03'),(53,'Cheese Making Workshop','Learn to make mozzarella, ricotta, and halloumi.','2026-05-23','10:00:00','The Farm Village, Durbanville',580.00,'https://i.postimg.cc/G2qRLjZJ/Cheese-Making-Workshop.jpg',5,'2026-02-26 11:18:03'),(54,'Tygerberg Business After Hours','Informal networking for Northern Suburbs professionals.','2026-05-25','17:30:00','Hillcrest Estate, Durbanville',150.00,'https://i.postimg.cc/CM2ycd0r/Tygerberg-Business-After-Hours.jpg',7,'2026-02-26 11:18:03'),(55,'Kloof Street House Live Jazz Night','Soulful jazz and cocktails in Cape Town\'s most stylish garden setting.','2026-05-26','19:30:00','Kloof Street House, Gardens',150.00,'https://i.postimg.cc/4NG0LcM2/Kloof-Street-House-Live-Jazz-Night.jpg',12,'2026-02-26 11:18:03'),(56,'DJ Spinna at The Grand','Hip-hop and rare groove with a legendary New York DJ.','2026-05-27','21:00:00','The Grand Africa, Beach Road, Granger Bay',250.00,'https://i.postimg.cc/gkGMqWLW/DJ-Spinna-at-The-Grand.jpg',12,'2026-02-26 11:18:03'),(57,'Rocking the Daisies Pre-Party','Warm-up for the big festival with local indie bands.','2026-05-28','20:00:00','The Armchair Theatre, Woodstock',180.00,'https://i.postimg.cc/hPC0L7qf/8b870006ae70b663732849bc48b77df0.jpg',12,'2026-02-26 11:18:03'),(58,'Silent Disco at The V&A Waterfront','Dance to your own choice of music with wireless headphones.','2026-05-28','18:00:00','V&A Amphitheatre, Waterfront',120.00,'https://i.postimg.cc/WbfMFLMM/Silent-Disco-at-The-V-A-Waterfront.jpg',12,'2026-02-26 11:18:03'),(59,'Afro House Sunset Session','Deep house and amapiano with ocean views.','2026-05-29','16:00:00','The Lookout Deck, Hout Bay',200.00,'https://i.postimg.cc/KjpgMBg1/Afro-House-Sunset-Session.jpg',12,'2026-02-26 11:18:03'),(60,'Two Oceans Aquarium Sleepover','Kids spend the night sleeping next to the shark tank.','2026-05-29','18:00:00','Two Oceans Aquarium, V&A Waterfront',450.00,'https://i.postimg.cc/FRsRV1vr/Two-Oceans-Aquarium-Sleepover.jpg',14,'2026-02-26 11:18:03'),(61,'Iziko Museum – Dino Discovery Day','Interactive fossil hunt and dinosaur workshops.','2026-05-30','10:00:00','Iziko South African Museum, Gardens',80.00,'https://i.postimg.cc/C1QFCNJv/Iziko-Museum-Dino-Discovery-Day.jpg',14,'2026-02-26 11:18:03'),(62,'Ratanga Junction Revival: Kids Carnival','Bouncy castles, face painting, and mini rides.','2026-05-30','09:00:00','Ratanga Junction (The Lot), Century City',120.00,'https://i.postimg.cc/DZX2gGDG/Ratanga-Junction-Reviva-Kids-Carnival.jpg',14,'2026-02-26 11:18:03'),(63,'Kirstenbosch Family Picnic & Puppet Show','Outdoor puppet theatre and picnic on the lawns.','2026-05-31','11:00:00','Kirstenbosch Gardens, Newlands',90.00,'https://i.postimg.cc/g2tmb4bm/Kirstenbosch-Family-Picnic-Puppet-Show.jpg',14,'2026-02-26 11:18:03'),(64,'Science Fun at The Scratch Patch','Mini experiments and gemstone hunting.','2026-05-31','10:00:00','The Scratch Patch, Simon\'s Town',110.00,'https://i.postimg.cc/y6TqznF8/Science-Fun-at-The-Scratch-Patch.jpg',14,'2026-02-26 11:18:03');
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
  PRIMARY KEY (`favourites_id`),
  KEY `fk_favourites_user` (`user_id`),
  KEY `fk_favourites_event` (`event_id`),
  CONSTRAINT `fk_favourites_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favourites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
INSERT INTO `favourites` VALUES (1,1,3,'2026-02-26 06:41:13'),(2,2,3,'2026-02-26 09:47:01'),(3,2,4,'2026-02-26 09:47:02'),(4,2,8,'2026-02-26 09:47:03'),(5,2,5,'2026-02-26 09:47:04'),(7,2,19,'2026-02-26 11:54:26'),(8,2,20,'2026-02-26 11:54:28'),(9,2,12,'2026-02-26 11:54:40'),(10,2,15,'2026-02-26 11:54:59'),(11,2,7,'2026-02-26 11:55:01'),(12,2,22,'2026-02-26 11:55:07'),(15,2,18,'2026-02-27 07:17:57');
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
  PRIMARY KEY (`items_id`),
  KEY `fk_order_items_order` (`order_id`),
  KEY `fk_order_items_event` (`event_id`),
  CONSTRAINT `fk_order_items_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`user_category_id`),
  KEY `fk_user_categories_user` (`user_id`),
  KEY `fk_user_categories_category` (`category_id`),
  CONSTRAINT `fk_user_categories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_categories_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ni','le','nile@example.com','$2a$10$PW23rCml7j25iZPjulm3X.7w0BF4HR8POHnBGrBSDe2KZTr42c6gy','Constantia (7800)'),(2,'Nina','Lewis','ninalewis@example.com','$2a$10$GeEAeyOl/h733j3heLd8qeMmgF..STRPijAvgmj9FBbqDetD8Slem','Strand (7140)');
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

-- Dump completed on 2026-02-27 10:06:39
