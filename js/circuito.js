class Circuito {
  constructor() {
    this.firtstXML = true;
    this.firtstKML = true;
    this.firtstSVG = true;
  }

  leerXML(files) {
    if (!this.firtstXML) {
      alert("Ya se ha cargado un archivo .xml");
      return;
    }

    const archivo = files[0]; // Primer archivo seleccionado

    if (!archivo) return; // Si no hay archivo salir

    const lector = new FileReader();

    lector.onload = function (evento) {
      const contenidoXML = evento.target.result; // Contenido del archivo
      const parser = new DOMParser();
      const datos = parser.parseFromString(contenidoXML, "application/xml");

      // Extraer datos generales
      const nombre = $(datos).find('name').text();
      const longitud = $(datos).find('long').text();
      const longitudMedida = $(datos).find('long').attr('measurement');
      const ancho = $(datos).find('width').text();
      const anchoMedida = $(datos).find('width').attr('measurement');
      const fecha = $(datos).find('date').text();
      const hora = $(datos).find('hour').text();
      const vueltas = $(datos).find('laps').text();
      const localidad = $(datos).find('locality').text();
      const pais = $(datos).find('country').text();

      // Extraer las referencias
      const referencias = [];
      $(datos).find('references reference').each(function() {
        referencias.push($(this).text());
      });

      // Extraer fotos
      const fotos = [];
      $(datos).find('photos photo').each(function() {
        fotos.push($(this).text());
      });

      // Extraer videos
      const videos = [];
      $(datos).find('videos video').each(function() {
        videos.push($(this).text());
      });

      // Obtener las coordenadas de la meta
      const coordenadas = {
        longitud: $(datos).find('gcoordinates longitude').text(),
        latitud: $(datos).find('gcoordinates latitude').text(),
        altitud: $(datos).find('gcoordinates altitude').text()
      };

      // Extraer segmentos
      const segmentos = [];
      $(datos).find('segments segment').each(function() {
        segmentos.push({
          distancia: $(this).find('distance').text(),
          medidaDistancia: $(this).find('distance').attr('measurement'),
          sector: $(this).find('sector').text(),
          coordenadas: {
            longitud: $(this).find('coordinates longitude').text(),
            latitud: $(this).find('coordinates latitude').text(),
            altitud: $(this).find('coordinates altitude').text()
          }
        });
      });

      let stringDatos = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Longitud:</strong> ${longitud} ${longitudMedida}</p>
        <p><strong>Ancho:</strong> ${ancho} ${anchoMedida}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Vueltas:</strong> ${vueltas}</p>
        <p><strong>Localidad:</strong> ${localidad}</p>
        <p><strong>País:</strong> ${pais}</p>
      `;

      // Referencias
      stringDatos += "<p><strong>Referencias:</strong></p><ul>";
      referencias.forEach(ref => {
        stringDatos += `<li><a href="${ref}">${ref}</a></li>`;
      });
      stringDatos += "</ul>";

      // Fotos
      stringDatos += "<p><strong>Fotos:</strong></p><ul>";
      fotos.forEach(foto => {
        stringDatos += `<li><img src="multimedia/imagenes/${foto}" alt="Foto: ${foto}"></li>`;
      });
      stringDatos += "</ul>";

      // Videos
      stringDatos += "<p><strong>Videos:</strong></p><ul>";
      videos.forEach(video => {
        stringDatos += `
          <li>
            <video width="320" height="240" controls>
              <source src="multimedia/videos/${video}" type="video/mp4">
              Tu navegador no soporta este formato de video.
            </video>
          </li>
        `;
      });
      stringDatos += "</ul>";

      // Coordenadas globales
      stringDatos += `
        <p><strong>Coordenadas de la meta:</strong></p>
        <ul>
          <li><strong>Longitud:</strong> ${coordenadas.longitud}</li>
          <li><strong>Latitud:</strong> ${coordenadas.latitud}</li>
          <li><strong>Altitud:</strong> ${coordenadas.altitud} m</li>
        </ul>
      `;

      // Cada uno de los segmentos
      stringDatos += "<p><strong>Segmentos:</strong></p><ul>";
      let count = 1;
      segmentos.forEach(segmento => {
        stringDatos += `
          <li>
            <p><strong>Segmento número:</strong> ${count}</p>
            <p><strong>Distancia:</strong> ${segmento.distancia} ${segmento.medidaDistancia}</p>
            <p><strong>Sector:</strong> ${segmento.sector}</p>
            <p><strong>Coordenadas:</strong></p>
            <ul>
              <li><strong>Longitud:</strong> ${segmento.coordenadas.longitud}</li>
              <li><strong>Latitud:</strong> ${segmento.coordenadas.latitud}</li>
              <li><strong>Altitud:</strong> ${segmento.coordenadas.altitud} m</li>
            </ul>
          </li>
        `;
        count += 1;
      });
      stringDatos += "</ul>";

      // Insertar el contenido en el HTML
      const container = $('body');
      const xmlData = $('<section></section>');
      const header = $('<h3></h3>').text("Datos del XML:");
      xmlData.append(header);
      xmlData.html(xmlData.html() + stringDatos);
      container.append(xmlData);
    };

    this.firtstXML = false;
    lector.readAsText(archivo);
  }

  leerKML(files) {
    if (!this.firtstKML) {
      alert("Ya se ha cargado un archivo .kml");
      return;
    }

    if (files && files[0]) {
      const file = files[0];

      // Verificar si el archivo es un KML válido
      if (file.type === "application/vnd.google-earth.kml+xml" || file.name.endsWith(".kml")) {
        const reader = new FileReader();

        reader.onload = function (e) {
          // Obtener el contenido del archivo KML
          const kmlContent = e.target.result;

          // Crear el contenedor para el mapa
          const mapa = $('<div></div>');
          const container = $('body'); // Obtener el contenedor donde insertar el mapa
          const kmlData = $('<section></section>');
          const header = $('<h3></h3>').text("Mapa del KML:"); // Agregar encabezado
          kmlData.append(header);
          kmlData.append(mapa); // Añadir el contenedor de datos al body
          container.append(kmlData); // Añadir el contenedor del mapa al body

          // Inicializar el mapa
          const map = new google.maps.Map(mapa[0], {
            zoom: 15,
          });

          // Función para extraer coordenadas del KML
          const obtenerCoordenadasKML = function (kmlContent) {
            const coordenadas = [];
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(kmlContent, "application/xml");

            // Buscar todas las etiquetas <coordinates> dentro del archivo KML
            const coordinatesTags = xmlDoc.querySelectorAll("coordinates");

            coordinatesTags.forEach(tag => {
              const coordsText = tag.textContent.trim();

              // Separar múltiples coordenadas en un bloque
              const coordsArray = coordsText.split(/\s+/);

              coordsArray.forEach(coord => {
                const [lng, lat] = coord.split(",").map(Number);
                coordenadas.push({ lat, lng });
              });
            });

            return coordenadas;
          };

          // Obtener las coordenadas del archivo KML
          const coordenadas = obtenerCoordenadasKML(kmlContent);

          // Añadir los puntos al mapa
          coordenadas.forEach(coord => {
            new google.maps.Marker({
              position: coord,
              map: map,
              title: `Lat: ${coord.lat}, Lng: ${coord.lng}`
            });
          });

          // Dibujar líneas entre los puntos
          if (coordenadas.length > 1) {
            const flightPath = new google.maps.Polyline({
              path: coordenadas, // Coordenadas de los puntos
              geodesic: true,
              strokeColor: "#FF0000", // Color de la línea
              strokeOpacity: 1.0,
              strokeWeight: 2 // Grosor de la línea
            });

            // Añadir la línea al mapa
            flightPath.setMap(map);
          }

          // Centrar el mapa y ajustar el zoom 
          if (coordenadas.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            coordenadas.forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds); // Ajusta el mapa a los límites de los puntos
          } else {
            alert("No se encontraron coordenadas en el archivo KML.");
          }
        };

        this.firtstKML = false;
        // Leer el archivo KML como texto
        reader.readAsText(file);
      } else {
        alert("Por favor, selecciona un archivo KML válido.");
      }
    }
  }

  leerSVG(files) {
    if (!this.firtstSVG) {
      alert("Ya se ha cargado un archivo .svg");
      return;
    }

    // Verificar si hay un archivo y si es un archivo SVG
    if (files && files[0] && files[0].type === 'image/svg+xml') {
      var file = files[0];
      var reader = new FileReader();

      reader.onload = function (event) {
        var svgContent = event.target.result;
        const container = $('body'); // Obtener el contenedor donde insertar el mapa
        const svgData = $('<section></section>');
        const header = $('<h3></h3>').text("Mapa del Contenido del SVG:"); // Agregar encabezado
        svgData.append(header);
        svgData.html(svgData.html() + svgContent); // Añadir el contenedor de datos al body
        container.append(svgData); // Añadir el contenedor del mapa al body
      };

      // Leer el archivo como texto
      reader.readAsText(file);
      this.firtstSVG = false;
    } else {
      alert('Por favor, selecciona un archivo SVG.');
    }
  }
}

const circuit = new Circuito();
