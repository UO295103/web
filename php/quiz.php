<?php
session_start();

class TriviaF1 {
    //Conexion
    private $conn;
    public $state; 
    private $server;
    private $user;
    private $pass;
    private $dbname;
    //Formulario 
    public $form;
    //Temas disponibles en la BD
    private $themes = []; 
    //Temas en el juego actual
    private $currentThemes = []; 
    //usuario de la partida actual
    private $username = null;
    //Preguntas de la partida actual
    private $currentQuestions = [];
    //respuestas de la partida actual
    private $currentAnswers = [];
    //Variables aux del estado actual
    public $current_question = 0; 
    private $current_theme = 0;    
    //Puntuacion de la partida
    private $score = 0; 

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "quiz";

        $this->checkBD();
        
        //Cargamos los temas de la bd
        $this->loadThemes();
        //Iniciamos el juego
        $this->initQuiz();
    }

    private function checkBD() {

        try {
            $conn = @ new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        }catch(Exception $e) {
             // Si  la base de datos no existe
             $this->createDB();
             $this->crearTablas();
             //Cargamos los temas de la bd
             $this->loadThemes();
             //Iniciamos el juego
             $this->initQuiz();
             return true;
        }

        if ($conn->connect_error) {
            // Si  la base de datos no existe
            $this->createDB();
            $this->crearTablas();
            //Cargamos los temas de la bd
            $this->loadThemes();
            //Iniciamos el juego
            $this->initQuiz();
            return true;
        }
        return false;
    }


    private function createDB(){

        // Crear la conexión al servidor MySQL
        $conn = new mysqli($this->server, $this->user, $this->pass);

        if ($conn->connect_error) {
            die("Error en la conexión: " . $conn->connect_error);
        }

        $sql = "CREATE DATABASE $this->dbname DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci";
        $conn->query($sql);
        $conn->close();
    }


    // Cogemos las temáticas disponibles de la base de datos
    private function loadThemes() {

        $this->createConexion();
        $stmt = $this->conn->prepare('SELECT DISTINCT id FROM tematica');
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $K=0;
            while ($row = $result->fetch_assoc()) {
                $this->themes[$K] = $row['id']; 
                $K +=1;
            }
        }
        $this->conn->close();   
    }

    private function createConexion(){
        $this->checkBD();
        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
    }

    //Inicializa la partica cogiendo los tres temas,
    //las tres preguntas y sus respuestas.
    private function initQuiz(){ 
        $this->initializeGame(); 
        $this->selectRandomThemes();      
        $this->getQuestions();
        $this->getAnswers();
        $this->mostrarInicio();
    }

    // Inicializa el estado del juego
    private function initializeGame() {
        $this->state = 'inicio';
        $this->current_question = 0;
        $this->current_theme = 0;
        $this->score = 0;
        $this->username = null;
    }

    private function getAnswers() {
        $this->createConexion();
        for ($i = 0; $i < 3; $i++) {
              
            // Seleccionamos el tema 
            $pregunta = $this->currentQuestions[$i];
            // Obtener todas las respuestas de la pregunta actual
            $query = $this->conn->prepare("SELECT * 
                                           FROM respuesta  
                                           WHERE idPregunta = ?");
    
            $query->bind_param('i', $pregunta['idPregunta']);
            $query->execute();
            $result = $query->get_result();
            
            // Si no hay respuestas disponibles
            if ($result->num_rows === 0) {
                echo "No hay respuestas para la pregunta ".$pregunta['texto'] ;
            }

            //No hay 4 respuestas como deberia
            if ($result->num_rows != 4) {
                echo "El número de respuestas para la pregunta ".$pregunta['texto']. " no es 4, es ".$result->num_rows ;
            }
    
            // Convertir las filas en un array
            $respuestas = [];
            while ($row = $result->fetch_assoc()) {
                $respuestas[] = $row;
            }
            
            //Guardar las respuestas, Cada pregunta tiene 4 
            for ($j = 0; $j < 4; $j++) {
                $this->currentAnswers[(4*$i) + $j] = $respuestas[$j];
            }
        }
        $this->conn->close();
    }


    // Inicializa el estado del juego
    private function getQuestions() {

        $this->createConexion();
        for ($i = 0; $i < 3; $i++) {
              
        // Seleccionamos el tema 
        $theme = $this->currentThemes[$i];
        // Obtener todas las preguntas del tema actual
        $query = $this->conn->prepare("SELECT p.* 
                                       FROM pregunta p 
                                       JOIN pregunta_tematica pt ON p.idPregunta = pt.pregunta
                                       WHERE pt.tematica = ?");

        $query->bind_param('i', $theme);
        $query->execute();
        $result = $query->get_result();
        
        // Si no hay preguntas disponibles
        if ($result->num_rows === 0) {
            echo "No hay preguntas para el tema ".$theme;
        }

        // Convertir las filas en un array
        $questions = [];
        while ($row = $result->fetch_assoc()) {
            $questions[] = $row;
        }

        // Seleccionar una pregunta aleatoria
        $randomIndex = array_rand($questions);
        $this->currentQuestions[$i] = $questions[$randomIndex];
        }

        $this->conn->close();
    }

    // Seleccionamos los temas aleatorios para las preguntas y sin repetirse
    private function selectRandomThemes() {
        if (count($this->themes) >= 3) {
            $this->currentThemes = array_rand(array_flip($this->themes), 3);
            shuffle($this->currentThemes); 
        }  else{
            echo 'No hay suficientes temáticas';
        }
    }

    // Maneja el formulario según el estado de juego
    public function handleRequest() {
        switch ($this->state) {
            case 'inicio':
                $this->handleStart();
                break;
            case 'pregunta':
                $this->handleQuestion();
                break;
            case 'resultado':
                $this->handleResult();
                break;
        }
    }

    //Guarda el nombre de usuario y muetra la primera pregunta
    private function handleStart() {
        $this->state = 'pregunta'; 
        $this->username = $_POST['username'];
        $this->handleQuestion();
    }

        //Guarda el nombre de usuario y muetra la primera pregunta
    private function handleQuestion() {
        if($this->current_question==0){
            $this->mostrarPregunta();
            $this->current_question+=1;
        }elseif($this->current_question<3){
            $this->comprobarRespuesta();
            $this->mostrarPregunta();
            $this->current_question+=1;
        }else{
            $this->comprobarRespuesta();
            $this->state = 'resultado';
            $this->guardarResultados();
            $this->mostrarResultados();
        }
    }

    private function guardarResultados() {

        $this->createConexion();
        $stmt = $this->conn->prepare("INSERT INTO `partida` (`nombre`, `puntuacion`, `fecha`) VALUES (?, ?, ?)");
        
        if (!$stmt) {
            echo "Error al preparar la consulta: " . $this->conn->error;
        }
    
        $fecha_actual = date('Y-m-d H:i:s');
        $stmt->bind_param("sis", $this->username, $this->score, $fecha_actual);
    
        $stmt->execute();
        $this->conn->close();
    }
    

    private function comprobarRespuesta() {
        //Ontener la respuesta correcta
        for ($i = 0; $i < 4; $i++) {
            $correcta = $this->currentAnswers[(4*($this->current_question-1))+ $i ]['correcta'];
            if($correcta==1){
                $correcta=$i;
                break;
            }
        }

        //Comprobar si el usuario marco la respuesta correcta
        if((isset($_POST['0']) && $correcta==0) ||
            (isset($_POST['1']) && $correcta==1) ||
            (isset($_POST['2'])  && $correcta==2) ||
            (isset($_POST['3']) && $correcta==3)){
            $this->score+=150;
        }
    }

    private function handleResult() {
        $_SESSION['trivia'] = new TriviaF1(); 
    }

        //Muestra el formulario inicial
        private function mostrarInicio() {
            $this->form = ' <section>
            <h2>Bienvenido a la Trivia de F1</h2>        
            <p>Pon a prueba tus conocimientos de la F1 en este juego de preguntas variadas sobre diferentes temáticas.</p>
            <p>Cada pregunta acertada de concede 150 puntos, prueba que eres el que más sabe ¡Suerte!</p>
            <form method="POST">
                <label for="username">Nombre de Usuario:</label>
                <input type="text" name="username" id="username" required>
                <button type="submit">Comenzar</button>
            </form> </section>
            ';
        }
    
        //Muestra el formulario final con la puntuación del usuario
        private function mostrarResultados() {
            $this->form = '<section>
            <h2>¡Felicidades ' . $this->username . '!</h2>
            <p>Tu puntaje final es: ' . $this->score . '</p>
            <form method="POST">
                <button type="submit" name="Reiniciar">Jugar de Nuevo</button>
            </form> </section>
            ';
        }

    private function mostrarPregunta() {

        $pregunta = $this->currentQuestions[$this->current_question];
        // Generar formulario para la pregunta
        $this->form = '<section> <h2>Pregunta ' . ($this->current_question)+1 . '</h2>';
        $this->form .= '<p>' . htmlspecialchars($pregunta['texto']) . '</p>';
        $this->form .= '<form method="POST">';
        for ($i = 0; $i < 4; $i++) {
            $answer = htmlspecialchars($this->currentAnswers[(4*$this->current_question)+ $i]['texto']);
            $this->form .= "<button type=\"submit\" name=".$i." value=\"$answer\">$answer</button>";
        }
        $this->form .= '</form> </section>';
    }

    public function crearTablas() {

        $archivo_sql = "creacion.sql";

        $sql = file_get_contents($archivo_sql);
        if ($sql === false) {
             echo "No se pudo leer el archivo SQL.";
        }

        $consultas = explode(";", $sql);

        $this->createConexion();

        foreach ($consultas as $consulta) {
            $consulta = trim($consulta); // Quitar espacios y líneas vacías
            if (!empty($consulta)) {
                if ($this->conn->query($consulta) === false) {
                    echo "Error al ejecutar la consulta: " . $this->conn->error . "<br>";
                } 
            }
        }   
    }

    //RECOMENDABLE PROBAR LA CARGA DE DATOS CON LA TABLA PARTIDA QUE SE CREA EN UN ESTADO VACIO
    public function cargarDatos() {
        // Obtener el nombre de la tabla seleccionada
        $tabla = $_POST['tabla'];
    
        // Verificar si se ha subido un archivo CSV
        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] == UPLOAD_ERR_OK) {
            $archivo = $_FILES['archivo']['tmp_name'];
    
            // Abrir el archivo CSV
            if (($handle = fopen($archivo, 'r')) !== FALSE) {
                // Leer la primera línea del archivo para sacar las columnas de la tablas
                if(($linea = fgets($handle)) !== FALSE) {
                    // Eliminar el salto de línea final, si existe
                    $columnas = rtrim($linea, PHP_EOL);
                }

                $this->createConexion();
    
                // Eliminar los datos existentes en la tabla antes de insertar los nuevos
                $sqlDelete = "DELETE FROM $tabla";
                $this->conn->prepare($sqlDelete)->execute();

                $i=0;
    
                //leer linea a linea el csv insertando los datos
                while (($linea = fgets($handle)) !== FALSE) {
                    if($i!=0){     
                        $datos = rtrim($linea, PHP_EOL);
                        $sql = "INSERT INTO $tabla ($columnas) VALUES ($datos)";
                        $stmt = $this->conn->prepare($sql);
                        $stmt->execute();
                    }else{  

                        $i++;
                    }
                }

                $this->conn->close();

                echo "<script>console.log(Datos cargados exitosamente en la tabla".$tabla.");</script>";
            } else {
                echo "Error al abrir el archivo CSV.";
            }
        } else {
            echo "No se ha subido ningún archivo CSV o ha ocurrido un error en la carga.";
        }
    }

    public function exportarDatos() {

        $this->createConexion();
        // Obtener todas las tablas de la base de datos
        $result = $this->conn->query("SHOW TABLES");

        if ($result) {
            while ($row = $result->fetch_array()) {
                $table = $row[0]; // El nombre de la tabla está en el primer índice del resultado

                // Obtener los datos de la tabla
                $dataResult = $this->conn->query("SELECT * FROM `$table`");
        
                // Crear un archivo CSV para cada tabla
                $file = fopen($table."Export.csv", "w");

                if ($dataResult && $dataResult->num_rows > 0) {
                // Obtener encabezados y escribirlos al archivo
                    $headers = array_keys($dataResult->fetch_assoc());
                    fputcsv($file, $headers);

                    // Rewind the result pointer and escribir datos
                    $dataResult->data_seek(0);
                    while ($row = $dataResult->fetch_assoc()) {
                        fputcsv($file, $row);
                    }
                }

                fclose($file);
            }
            $this->conn->close();
        } else {
            $this->conn->close();
            echo "No se pudieron obtener las tablas: " . $this->conn->error;
        }
    }
    
}

//Solo lo crea so no existe, para evitar que se cree cada vez que se refresca la página


if (!isset($_SESSION['trivia'])) {
    $_SESSION['trivia'] = new TriviaF1(); 
} else {
    $trivia = $_SESSION['trivia'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if(isset($_POST['crear'])){
        $trivia->crearTablas();
        //Crea uno nuevo para incorporar los datos
        $trivia = new TriviaF1();
    }else if(isset($_POST['importar'])){
        $trivia->cargarDatos();
        //Crea uno nuevo para incorporar los datos
        $trivia = new TriviaF1();
    }else if(isset($_POST['exportar'])){
        $trivia->exportarDatos();
    }else{
        $trivia->handleRequest();
    }
}

$trivia = $_SESSION['trivia'];

?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <meta name="author" content="Iyán Solís Rodríguez" />
    <meta name="description" content="juegos de f1" />
    <meta name="keywords" content="F1, quiz, pregunta, puntuacion, tabla, base de datos, juego" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>F1 Desktop-Juegos</title>
    <link rel="icon" href="../multimedia/imagenes/icono.ico">
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/quiz.css" />
</head>
<body>
<header>
    <h1><a href="../index.html" title="inicio">F1 Desktop</a></h1>
    <nav>
        <a href="../index.html" title="inicio">Inicio</a>
        <a href="../piloto.html" title="piloto">Piloto</a>
        <a href="../noticias.html" title="noticias">Noticias</a>
        <a href="../calendario.html" title="calendario">Calendario</a>
        <a href="../metereologia.html" title="metereologia">Metereología</a>
        <a href="../circuito.html" title="circuito">Circuito</a>
        <a href="../viajes.php" title="viajes">Viajes</a>
        <a href="../juegos.html" title="juegos" class="active">Juegos</a>
    </nav>
</header>

<p ID="migas"><a href="../index.html" title="inicio">Inicio</a> >> <a href="../juegos.html" title="juegos">Juegos</a> >> Reacción</p>

<section>
	<h2>Disfrute de más juegos:</h2>
	<ul>
		<li><a href="../memoria.html" title="JuegoReaccion">Juego de memoria</a></li>
		<li><a href="../simulador.html" title="juegoSimulador">Juego de simulación</a></li>
		<li><a href="../semaforo.php" title="semaforo">Juego de reacción</a></li>
	</ul>
</section>

<main>

    <?php echo $trivia->form; ?>
    

    <section>
        <h2>Operaciones con la base de datos</h2>
        <form method="POST">
            <p>Crea las tablas y carga los datos iniciales</p>
            <button type="submit" name="crear">Inicializar</button>
        </form> 
        <form method="POST" enctype="multipart/form-data">
            <p>Añadir datos desde un .csv</p>
            <label for="selectTabla">Selecciona tabla:</label>
            <select id="selectTabla" name="tabla">
                <option value="pregunta">pregunta</option>
                <option value="respuesta">respuesta</option>
                <option value="tematica">tematica</option>
                <option value="pregunta_tematica">pregunta_tematica</option>
                <option value="partida">partida</option>
            </select>
            <label for="archivo">Selecciona .csv:</label>
		    <input id="archivo" name="archivo"type="file" accept=".csv">
            <button type="submit" name="importar">Importar</button>
        </form> 
        <form method="POST" enctype="multipart/form-data">
            <p>Exportar datos a un .csv</p>
            <button type="submit" name="exportar">Exportar</button>
        </form>
    </section>
</main>
</body>
</html>