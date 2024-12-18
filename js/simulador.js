class Simulador {
    constructor() {
        this.carreraIniciada = false;
        this.pilotos = ["Lewis Hamilton", "Max Verstappen", "Charles Leclerc", "Sebastian Vettel", "Fernando Alonso", "Carlos Sainz"];
        this.pilotoSeleccionado = "";
        this.resultadoCarrera = "";
        this.ganador = "";
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext("2d");  
        this.svg = document.querySelector('svg');
        this.grafico = null;
    }

    simular() {
        // Limpiar el gráfico anterior si existe
        if (this.grafico) {
            this.grafico.destroy();
        }

        var pilotoModel = document.querySelector('select');
        this.pilotoSeleccionado = pilotoModel.value;

        if (this.carreraIniciada) {
            this.carreraIniciada = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.carreraIniciada = true;
        this.resultadoCarrera = this.simularCarrera();
        this.mostrarResultado();
        this.dibujarCarrera(this.resultadoCarrera);
    }

    simularCarrera() {
        const tiemposPilotos = this.pilotos.map(piloto => {
            return {
                piloto: piloto,
                tiempo: Math.random() * 10 + 10
            };
        });

        tiemposPilotos.sort((a, b) => a.tiempo - b.tiempo);
        this.ganador = tiemposPilotos[0].piloto;
        return tiemposPilotos;
    }

    mostrarResultado() {
        const MensajeGanador = document.querySelector("section + section p:first-of-type");
        const MensajeResultado = document.querySelector("section + section p:last-of-type");

        MensajeGanador.textContent = `El ganador de la carrera es: ${this.ganador}`;
        if (this.pilotoSeleccionado === this.ganador) {
            MensajeResultado.textContent = "¡Felicidades! Has ganado.";
        } else {
            MensajeResultado.textContent = `Lo siento, has perdido.`;
        }

        const resultadosPrevios = JSON.parse(localStorage.getItem('resultados')) || [];
        resultadosPrevios.push(this.ganador);
        localStorage.setItem('resultados', JSON.stringify(resultadosPrevios));
    }

    desordenarArray(arr) {
        for (let i = 2; i > 0; i--) {
            // Generar un índice aleatorio
            const j = Math.floor(Math.random() * (i + 1));
    
            // Intercambiar los elementos arr[i] y arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        }
        return arr;
    }

dibujarCarrera(resultado) {
    const altura = this.canvas.height;
    const ancho = this.canvas.width;
    const distanciaMeta = ancho - 100; // Posición de la meta
    const anchoVehiculo = 40; // Ancho de los vehículos
    const alturaVehiculo = 20; // Altura de los vehículos
    const espacioEntreCarriles = 50; // Espacio entre carriles
    const cuadrosTamano = 10; // Tamaño de cada cuadro en la meta
    const metaAncho = cuadrosTamano * 5; // Ancho reducido de la meta
    resultado = this.desordenarArray(resultado);

    // Limpiar el canvas
    this.ctx.clearRect(0, 0, ancho, altura);

    // Dibujar la pista
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, 0, ancho, altura);

    // Dibujar los carriles
    for (let i = 1; i < resultado.length; i++) {
        const lineaY = i * espacioEntreCarriles + alturaVehiculo / 2;
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.moveTo(0, lineaY);
        this.ctx.lineTo(ancho, lineaY);
        this.ctx.stroke();
    }

    // Dibujar la meta como cuadros 
    for (let y = 0; y < altura; y += cuadrosTamano) {
        for (let x = distanciaMeta; x < distanciaMeta + metaAncho; x += cuadrosTamano) {
            const color = ((x + y) / cuadrosTamano) % 2 === 0 ? "white" : "black";
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, cuadrosTamano, cuadrosTamano);
        }
    }

    // Dibujar los coches en posiciones horizontales diferentes
    resultado.forEach((piloto, index) => {
        const yPos = index * espacioEntreCarriles + 10; // Posición vertical por carril
        let xPos = distanciaMeta - anchoVehiculo - Math.random() * 200 -8; // Posición aleatoria antes de la meta

        // Si el piloto es el ganador, lo posicionamos justo tocando la meta
        if (piloto.piloto === this.ganador) {
            xPos = distanciaMeta - anchoVehiculo - 1 ; 
        }

        // Dibujar el coche
        this.ctx.fillStyle = piloto.piloto === this.ganador ? "green" : "blue";
        this.ctx.fillRect(xPos, yPos, anchoVehiculo, alturaVehiculo);

        // Dibujar el nombre del piloto
        if (piloto.piloto === this.ganador) {
            // Nombre del ganador a la izquierda para que se vea mejor
            this.ctx.fillStyle = "darkgreen";
            this.ctx.textAlign = "right";
            this.ctx.fillText(piloto.piloto, xPos - 5, yPos + alturaVehiculo / 2 + 5);
        } else {
            // Nombre de los perdedores debajo del coche
            this.ctx.fillStyle = "darkred";
            this.ctx.textAlign = "center";
            this.ctx.fillText(piloto.piloto, xPos + anchoVehiculo / 2, yPos + alturaVehiculo + 15);
        }
    });
}

mostrarGrafico() {
    const resultadosPrevios = JSON.parse(localStorage.getItem('resultados')) || [];

    if (resultadosPrevios.length === 0) {
        alert("No hay datos disponibles para mostrar en el gráfico.");
        return;
    }

    const victorias = {};
    resultadosPrevios.forEach(nombreGanador => {
        victorias[nombreGanador] = (victorias[nombreGanador] || 0) + 1;
    });

    const pilotos = Object.keys(victorias);
    const numeroDeVictorias = Object.values(victorias);
    const maxVictorias = Math.max(...numeroDeVictorias);

    this.svg.innerHTML = '';
    const svgWidth = 600;
    const svgHeight = 400;
    const barWidth = 40;
    const padding = 60;
    const marginLeft = 50; 
    const labelColor = '#000';
    const colors = ['#ff5733', '#33ff57', '#3357ff', '#f4c542', '#f542c2', '#42f5a7', '#8e44ad', '#e74c3c'];

    this.svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    this.svg.setAttribute("width", svgWidth);
    this.svg.setAttribute("height", svgHeight);

    pilotos.forEach((piloto, index) => {
        const barHeight = (numeroDeVictorias[index] / maxVictorias) * (svgHeight - 50);
        const x = marginLeft + index * (barWidth + padding);
        const y = svgHeight - barHeight - 20;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", colors[index % colors.length]);
        this.svg.appendChild(rect);

        const segundoNombre = piloto.split(" ")[1];

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + barWidth / 2);
        text.setAttribute("y", svgHeight - 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", labelColor);
        text.textContent = segundoNombre;
        this.svg.appendChild(text);

        const valueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        valueText.setAttribute("x", x + barWidth / 2);
        valueText.setAttribute("y", y - 5);
        valueText.setAttribute("text-anchor", "middle");
        valueText.setAttribute("fill", labelColor);
        valueText.textContent = numeroDeVictorias[index];
        this.svg.appendChild(valueText);
    });
}


    limpiarDatosAlmacenados() {
        localStorage.removeItem('resultados');
        console.log("Datos almacenados eliminados correctamente.");
    }
}

// Instancia de la clase Simulador
const simulador = new Simulador();
simulador.limpiarDatosAlmacenados(); //Se puede eliminar para conservar los datos al cambiar de html