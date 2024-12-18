class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
    }

    rellenarDatos(circuito, gobierno, latitudMeta, longitudMeta, altitudMeta, religion) {
        this.circuito = circuito;
        this.longitudMeta = longitudMeta;
        this.latitudMeta = latitudMeta;
        this.altitudMeta = altitudMeta;
        this.religion = religion;
        this.gobierno = gobierno;
    }

    writeCoords() {
        // Usamos JavaScript puro para agregar los datos
        const body = document.querySelector('body');
        const latPara = document.createElement('p');
        latPara.textContent = `Latitud: ${this.latitudMeta}`;
        body.appendChild(latPara);

        const lonPara = document.createElement('p');
        lonPara.textContent = `Longitud: ${this.longitudMeta}`;
        body.appendChild(lonPara);

        const altPara = document.createElement('p');
        altPara.textContent = `Altitud: ${this.altitudMeta}`;
        body.appendChild(altPara);
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getInformacionSecundaria() {
        return `
        <ul>
            <li><strong>Circuito:</strong> ${this.circuito}.</li>
            <li><strong>Población:</strong> ${this.poblacion} habitantes.</li>
            <li><strong>Gobierno:</strong> ${this.gobierno}.</li>
            <li><strong>Religión mayoritaria:</strong> ${this.religion}.</li>
        </ul>`;
    }

    showTitle() {
        // Usamos JavaScript para crear y agregar el título
        const title = document.createElement('h2');
        title.textContent = `Información acerca de ${this.getNombre()}`;
        document.querySelector("section:nth-of-type(1)").appendChild(title);
    }

    showIntroduccion() {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = `${this.getNombre()} es el país en el que se encuentra el circuito principal de esta página web. Este país tiene por capital ${this.getCapital()}.`;
        document.querySelector("section:nth-of-type(1)").appendChild(paragraph);
    }

    showExtraData() {
        // Usamos JavaScript para agregar los datos extra
        const title = document.createElement('h2');
        title.textContent = "Datos extra del país";
        document.querySelector("section:nth-of-type(3)").appendChild(title);
        document.querySelector("section:nth-of-type(3)").innerHTML += this.getInformacionSecundaria();
    }

    consultarMeteorologia() {
        const apiKey = '7495239d816ae3c751357e8488dd990c';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitudMeta}&lon=${this.longitudMeta}&appid=${apiKey}&units=metric&lang=es&mode=xml`;

        // Usamos jQuery para la petición AJAX
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function (data) {
                const weatherSection = $("<section></section>");
                const title = $("<h2></h2>").text("Previsión meteorológica:");
                weatherSection.append(title);

                let processedDates = [];

                $(data).find("time").each(function (index) {
                    const dateStr = $(this).attr("from");
                    const tempMax = $(this).find("temperature").attr("max");
                    const tempMin = $(this).find("temperature").attr("min");
                    const humidity = $(this).find("humidity").attr("value");
                    const rain = $(this).find("precipitation").attr("value");
                    const icon = $(this).find("symbol").attr("var");
                    const description = $(this).find("symbol").attr("name");

                    const date = new Date(dateStr);
                    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

                    // Filtrar solo las previsiones de las 3 de la tarde (15:00)
                    if (date.getHours() == 15 && !processedDates.includes(formattedDate)) {
                        processedDates.push(formattedDate);

                        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

                        const weatherInfo = $(` 
                            <article>
                                <h3>${formattedDate}</h3>
                                <p><strong>Máxima:</strong> ${tempMax}°C</p>
                                <p><strong>Mínima:</strong> ${tempMin}°C</p>
                                <p><strong>Humedad:</strong> ${humidity}%</p>
                                <p><strong>Lluvia:</strong> ${rain ? rain + ' mm' : 'Sin lluvias'}</p>
                                <img src="${iconUrl}" alt="${description}">
                            </article>
                        `);

                        weatherSection.append(weatherInfo);
                    }

                    if (processedDates.length >= 5) {
                        return false;
                    }
                });

                $("body").append(weatherSection);
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener los datos del tiempo:", status, error);
                $("body").append("<p>Error al obtener los datos del tiempo.</p>");
            },
        });
    }
}

const pais = new Pais("Emiratos Árabes Unidos", "Abu Dabi", 3789860);
pais.rellenarDatos("Yas Marina", "Monarquía Absoluta", 24.4698875, 54.6052031, 4, "Islam");
