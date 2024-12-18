<?php
class Carrusel {
    private $capital;
    private $pais;

    public function __construct($capital, $pais) {
        $this->capital = $capital;
        $this->pais = $pais;
    }

    public function obtenerImagenes(): string {
        $params = array(
            'method'     => 'flickr.photos.search',
            'api_key'    => '814fc4a294890f684042044489d935fa', 
            'tags'       => $this->capital.",".$this->pais,
            'per_page'   => 10,
            'format'     => 'json',
            'nojsoncallback' => 1
        );

        $encoded_params = http_build_query($params);
        $url = "https://api.flickr.com/services/rest/?" . $encoded_params;

        $rsp = file_get_contents($url);
        if ($rsp === false) {
            return '<p>Error al obtener las imágenes desde la API.</p>';
        }

        $rsp_obj = json_decode($rsp, true);
        if ($rsp_obj['stat'] !== 'ok') {
            return '<p>Error en la respuesta de la API: ' . htmlspecialchars($rsp_obj['message']) . '</p>';
        }

        $html = '';
        $num = 1;
        foreach ($rsp_obj['photos']['photo'] as $photo) {
            $photo_url = sprintf(
                'https://farm%s.staticflickr.com/%s/%s_%s_m.jpg',
                $photo['farm'], $photo['server'], $photo['id'], $photo['secret']
            );

            $html .= '<img src="' . htmlspecialchars($photo_url) . '" alt="Imagen ' . $num . ' del carrusel" '.'loading="lazy"/>';
            $num++;
        }
        return $html;
    }
}

class Moneda {
    private $monedaLocal; 
    private $monedaReferencia;

    public function __construct($monedaLocal, $monedaCambio) {
        $this->monedaLocal = $monedaLocal;
        $this->monedaReferencia = $monedaCambio;
    }

    public function cambioMoneda() {
        $api_key = 'de51f2cbb1c51d4c66ab17caab92a962';
        $url = 'https://apilayer.net/api/live?access_key=' . $api_key . '&currencies=' . $this->monedaReferencia . '&source=' . $this->monedaLocal . '&format=1';

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); 

        $respuesta = curl_exec($curl);

        if (curl_errno($curl)) {
            curl_close($curl);
            return '<h3>Error al conectar con el servicio de cambio de moneda.</h3>';
        }

        curl_close($curl);
        $json = json_decode($respuesta);

        if ($json === null || !isset($json->quotes->{$this->monedaLocal . $this->monedaReferencia})) {
            return '<h3>Error al procesar los datos del tipo de cambio.</h3>';
        }

        $tipoDeCambio = $json->quotes->{$this->monedaLocal . $this->monedaReferencia};
        return "<p>1 {$this->monedaLocal} equivale a {$tipoDeCambio} {$this->monedaReferencia}</p>";
    }
}

$carrusel = new Carrusel('Abu Dabi', 'Emiratos Árabes Unidos');
$imagenes = $carrusel->obtenerImagenes(); 
$moneda = new Moneda('EUR', 'AED');
$cambio = '<p>LLamada al método comentada para no consumir usos de la API.</p>';
// $cambio = $moneda->cambioMoneda();
?>


<!DOCTYPE HTML> 
<html lang="es"> 
<head> 
	<meta charset="UTF-8"/> 
	<meta name ="author" content ="Iyán Solís Rodríguez" />
	<meta name ="description" content ="Vaiajes de la f1" /> 
	<meta name ="keywords" content ="F1, viajes, mapa, imagenes, referencia, moneda, pais, navegacion" /> 
	<meta name ="viewport" content ="width=device-width, initial-scale=1.0" /> 
	<title>F1 Desktop-Viajes</title>  
	<link rel="icon" href="multimedia/imagenes/icono.ico">
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" /> 
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
	<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCGqr2g-EfG44yE4RlqzXoyGDzIG3T4ySk"></script>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> 
    <script src="js/viajes.js"></script>
</head> 

<body> 
<header>
	<h1><a href="index.html" title ="inicio"> F1 Desktop</a> </h1> 
		<nav> 
		<a href="index.html" title ="inicio">Inicio</a>
		<a href="piloto.html" title ="piloto">Piloto</a>
		<a href="noticias.html" title ="noticias">Noticias</a>
		<a href="calendario.html" title ="calendario">Calendario</a>
		<a href="metereologia.html" title ="metereologia">Metereologia</a>
		<a href="circuito.html" title ="circuito">Circuito</a>
		<a href="viajes.php" title ="viajes" class="active">Viajes</a>
		<a href="juegos.html" title ="juegos">Juegos</a>
	</nav>
</header>

	<p ID="migas"><a href="../index.html" title ="inicio" >Inicio</a> >> Viajes</p>	

	<main>

    <article>
        <h2>Información de cambio de moneda:</h2>
        <?php echo $cambio ?>
    </article>
    
    <section>
        <h2>Mapa estático</h2>
        <button onclick="v.mostrarMapaEstatico()">Mostrar mapa estático</button>
    </section>

    <section>
        <h2>Mapa dinámico:</h2>   
        <button  onclick="v.mostrarMapaDinamico()">Mostrar mapa estático</button>
    </section>

    <article>
   		<h2>Imágenes de referencia:</h2>
        <?php echo $imagenes ?>
        <button> &gt; </button>
        <button> &lt; </button>
    </article>

	</main>
</body> 
</html>	