CREATE DATABASE IF NOT EXISTS quiz DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
USE quiz;

DROP TABLE IF EXISTS partida;
DROP TABLE IF EXISTS pregunta;
DROP TABLE IF EXISTS pregunta_tematica;
DROP TABLE IF EXISTS tematica;
DROP TABLE IF EXISTS respuesta;

CREATE TABLE `partida` (
  `nombre` varchar(10) NOT NULL,
  `puntuacion` int(4) NOT NULL,
  `fecha` varchar(20) NOT NULL
);

CREATE TABLE `pregunta` (
  `idPregunta` int(2) NOT NULL,
  `texto` text NOT NULL
);

CREATE TABLE `pregunta_tematica` (
  `pregunta` int(2) NOT NULL,
  `tematica` int(2) NOT NULL
);

CREATE TABLE `tematica` (
  `id` int(2) NOT NULL,
  `nombre` varchar(10) NOT NULL
);

CREATE TABLE `respuesta` (
  `idPregunta` int(3) NOT NULL,
  `texto` text NOT NULL,
  `correcta` int(1) NOT NULL
) ;

INSERT INTO `pregunta` (`idPregunta`, `texto`) VALUES
(1, '¿Cuál de estos pilotos ha ganado más campeonatos mundiales de Fórmula 1 hasta el año 2024?'),
(2, '¿Qué piloto de F1 es conocido por su apodo "The Iceman"?'),
(3, '¿Qué piloto de F1 debutó en 2007 y ganó su primer campeonato mundial en 2008?'),

(4, '¿Cuál de estos circuitos es famoso por ser un circuito urbano que se corre en las calles de Mónaco?'),
(5, '¿Qué circuito de F1 se conoce por ser el más largo de la temporada?'),
(6, '¿En qué circuito se corre el Gran Premio de Japón?'),

(7, '¿Qué escudería tiene como pilotos a Charles Leclerc y Carlos Sainz en la temporada 2024?'),
(8, '¿Cuál de estas escuderías ha sido históricamente conocida como "la escudería de las bebidas energéticas"?'),
(9, '¿Qué escudería de F1 ha ganado más campeonatos de constructores hasta 2024?'),

(10, '¿En qué año se celebró el primer Campeonato Mundial de Fórmula 1?'),
(11, '¿Qué piloto fue el primero en ganar siete campeonatos mundiales de F1?'),
(12, '¿En qué Gran Premio se produjo el famoso accidente que casi le cuesta la vida a Ayrton Senna?'),

(13, '¿Qué componente en los coches de F1 se utiliza para mejorar la aerodinámica y generar más carga hacia el suelo?'),
(14, '¿Cuál es el nombre del sistema utilizado en los coches de F1 para recuperar energía durante las frenadas?'),
(15, '¿Cuál es el principal material utilizado en la fabricación de la carrocería de los coches de F1?');

INSERT INTO `respuesta` (`idPregunta`, `texto`, `correcta`) VALUES

(1, 'Juan Manuel Fangio', 1),
(1, 'Michael Schumacher', 0),
(1, 'Lewis Hamilton', 0),
(1, 'Sebastian Vettel', 0),

(2, 'Daniel Ricciardo', 0),
(2, 'Kimi Räikkönen', 1),
(2, 'Fernando Alonso', 0),
(2, 'Valtteri Bottas', 0),

(3, 'Lewis Hamilton', 1),
(3, 'Fernando Alonso', 0),
(3, 'Kimi Räikkönen', 0),
(3, 'Sebastian Vettel', 0),

(4, 'Circuito de Silverstone', 0),
(4, 'Circuito de Suzuka', 0),
(4, 'Circuito de Montecarlo', 1),
(4, 'Circuito de Interlagos', 0),

(5, 'Circuito de Spa-Francorchamps', 1),
(5, 'Circuito de Le Mans', 0),
(5, 'Circuito de Monza', 0),
(5, 'Circuito de Baku', 0),

(6, 'Circuito de Hockenheim', 0),
(6, 'Circuito de Suzuka', 1),
(6, 'Circuito de Circuit de Barcelona-Catalunya', 0),
(6, 'Circuito de Silverstone', 0),

(7, 'Mercedes', 0),
(7, 'Ferrari', 1),
(7, 'Red Bull Racing', 0),
(7, 'McLaren', 0),

(8, 'Williams', 0),
(8, 'Red Bull Racing', 1),
(8, 'Alfa Romeo Racing', 0),
(8, 'Aston Martin', 0),

(9, 'McLaren', 0),
(9, 'Ferrari', 1),
(9, 'Mercedes', 0),
(9, 'Williams', 0),

(10, '1950', 1),
(10, '1947', 0),
(10, '1965', 0),
(10, '1955', 0),

(11, 'Michael Schumacher', 1),
(11, 'Nikita Mazepin', 0),
(11, 'Juan Manuel Fangio', 0),
(11, 'Nelson Piquet', 0),

(12, 'Gran Premio de Italia, 1993', 0),
(12, 'Gran Premio de San Marino, 1994', 1),
(12, 'Gran Premio de Mónaco, 1992', 0),
(12, 'Gran Premio de Japón, 1991', 0),

(13, 'El motor', 0),
(13, 'El alerón', 1),
(13, 'El escape', 0),
(13, 'Las llantas', 0),

(14, 'ERS', 0),
(14, 'KERS', 1),
(14, 'MGU-K', 0),
(14, 'F1-Hybrid', 0),

(15, 'Acero inoxidable', 1),
(15, 'Aluminio', 0),
(15, 'Fibra de carbono', 1),
(15, 'Titanio', 0);

INSERT INTO `tematica` (`id`, `nombre`) VALUES
(1, 'Pilotos'),
(2, 'Circuitos'),
(3, 'Escuderias'),
(4, 'Historia'),
(5, 'Coches');

INSERT INTO `pregunta_tematica` (`pregunta`, `tematica`) VALUES

(1, 1),
(2, 1),
(3, 1),

(4, 2),
(5, 2),
(6, 2),

(7, 3),
(8, 3),
(9, 3),

(10, 4),
(11, 4),
(12, 4),

(13, 5),
(14, 5),
(15, 5);