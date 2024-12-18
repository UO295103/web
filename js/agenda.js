class Agenda {
    constructor() {
        this.url = "https://ergast.com/api/f1/current/races.json?language=es";
        this.first = true;
    }

    obtenerCarreras() {
        $.getJSON(this.url, (data) => {
            this.races = data.MRData.RaceTable.Races;
            this.mostrarCarreras();
        })
        .fail(function() {
            console.log("Error al obtener los datos de las carreras.");
        });
    }

    mostrarCarreras() {
        // Creamos el contenedor de las carreras
        const racesSection = $('<section></section>');
        
        // Añadimos el título
        const title = $('<h2></h2>').text('Carreras de la temporada actual:');
        racesSection.append(title);

        // Iteramos sobre las carreras
        this.races.forEach(race => {
            const nombreCarrera = race.raceName; // Nombre de la carrera
            const circuito = race.Circuit.circuitName; // Nombre del circuito
            const coordenadas = `${race.Circuit.Location.lat}, ${race.Circuit.Location.long}`; // Coordenadas
            const pais = race.Circuit.Location.country; // País

            // Obtenemos la fecha y la hora
            const fecha = new Date(`${race.date}T${race.time}`);
            const dia = fecha.getDate();
            const mes = fecha.getMonth() + 1;
            const año = fecha.getFullYear();
            const horas = fecha.getHours();
            const minutos = fecha.getMinutes();

            // Formateamos la fecha y hora
            const fechaFormateada = `${dia} / ${mes} / ${año}`;
            const horaFormateada = `${horas}:${minutos < 10 ? '0' + minutos : minutos}`;

            // Creamos el HTML para cada carrera
            const carreraHTML = $(`
                <article>
                    <h4>${nombreCarrera}</h4>
                    <p><strong>País:</strong> ${pais}</p>
                    <p><strong>Circuito:</strong> ${circuito}</p>
                    <p><strong>Coordenadas:</strong> ${coordenadas}</p>
                    <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                    <p><strong>Hora:</strong> ${horaFormateada}</p>
                </article>
            `);

            // Añadimos cada carrera al contenedor
            racesSection.append(carreraHTML);
        });

        // Añadimos el contenedor de carreras al body
        $("body").append(racesSection);
    }

    imprimirCarreras() {    
        if (agenda.first) {
            agenda.obtenerCarreras();
            agenda.first = false;
        }
    }
}

var agenda = new Agenda();

