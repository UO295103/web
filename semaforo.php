<?php
session_start(); 

class Record {
    public $server;
    public $user;
    public $pass;
    public $dbname;
    public $conn;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }
    }

    public function insertRecord($name, $surname, $difficulty, $reactionTime) {
        $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $name, $surname, $difficulty, $reactionTime);

        if ($stmt->execute()) {
            return true; 
        } else {
            return false;  
        }
    }

    public function getTopRecords($difficulty) {
    
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
    
        $stmt->bind_param("d", $difficulty);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result && $result->num_rows > 0) {
            return $result->fetch_all(MYSQLI_ASSOC); 
        } else {
            error_log("No se encontraron registros para dificultad: " . $difficulty);
            return [];
        }
    }
}

$listHTML = "No se han cargado tiempos";
$record = new Record();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $difficulty = $_POST['difficulty'];
    $reactionTime = $_POST['reactionTime'];

    $difficulty = round( $difficulty , 1);

    // Insertar el nuevo récord
    $insertSuccess = $record->insertRecord($name, $surname, $difficulty, $reactionTime);

    // Obtener los 10 mejores resultados de la misma dificultad
    $topRecords = $record->getTopRecords($difficulty);

    $listHTML = '';

    if (count($topRecords) > 0) {
        $listHTML = "<ol>";
        foreach ($topRecords as $row) {
             $listHTML .= "<li>" . $row['nombre'] . " " . $row['apellidos'] . " - " . $row['tiempo'] . " segundos</li>";
        }
        $listHTML .= "</ol>";
    } else {
        $listHTML = "No se encontraron registros para dificultad: " . $difficulty;
    }
}

?>
<!DOCTYPE HTML> 
<html lang="es"> 
<head> 
    <meta charset="UTF-8"/> 
    <meta name="author" content="Iyán Solís Rodríguez" />
    <meta name="description" content="juegos de f1" /> 
    <meta name="keywords" content="F1, semaforo, reaccion, juego, record, tiempo, dificultad" /> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
    <title>F1 Desktop-Juegos</title>  
    <link rel="icon" href="multimedia/imagenes/icono.ico">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />  
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> 
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css" /> 
    <script src="js/semaforo.js"></script>
</head> 

<body>
<header>
    <h1><a href="index.html" title="inicio">F1 Desktop</a></h1> 
    <nav> 
        <a href="index.html" title="inicio">Inicio</a>
        <a href="piloto.html" title="piloto">Piloto</a>
        <a href="noticias.html" title="noticias">Noticias</a>
        <a href="calendario.html" title="calendario">Calendario</a>
        <a href="metereologia.html" title="metereologia">Metereologia</a>
        <a href="circuito.html" title="circuito">Circuito</a>
        <a href="viajes.php" title="viajes">Viajes</a>
        <a href="juegos.html" title="juegos" class="active">Juegos</a>
    </nav>
</header>

<p ID="migas"><a href="index.html" title="inicio">Inicio</a> >> <a href="juegos.html" title="juegos">Juegos</a> >> Reacción</p>

<section>
	<h2>Disfrute de más juegos:</h2>
	<ul>
		<li><a href="memoria.html" title ="JuegoReaccion">Juego de memoria</a></li>
		<li><a href="simulador.html" title ="juegoSimulador">Juego de simulación</a></li>
		<li><a href="php/quiz.php" title="quiz">Juego de quiz</a></li>
	</ul>
</section>

<main>
    <section>
        <h2>Cómo jugar:</h2>    
        <p>El juego consiste en un semáforo que mide tu tiempo de reacción, por lo que deberás ser rápido.</p>
        <ol>
            <li>Para comenzar a jugar, pulsa el botón "Arranque" y verás cómo las luces comienzan a encenderse.</li>
            <li>Cuando se hayan encendido todas, estas se apagarán de repente y deberás pulsar rápidamente el botón "Reacción".</li>
            <li>Tras esto, aparecerá un formulario con tu tiempo, que puedes rellenar para guardar tus resultados.</li>
            <li>Si has decidido guardar tus resultados, verás una lista con los 10 mejores récords para comprobar si estás entre los mejores.</li>
        </ol>
    </section>
    <script>s = new Semaforo();</script>
    <article>  
        <h2>Top 10 mejores tiempos</h2> 
        <?php 
             echo $listHTML; 
        ?>
    </article>
</main>

</body> 
</html>  
