class Semaforo {
    levels = [0.2, 0.5, 0.8];

    constructor() {
        const pos = Math.floor(Math.random() * 3);  
        this.difficulty = this.levels[pos];
        this.lights = 4;
        this.number=1;
        this.tiempoN = 1;
        this.unload_moments = null;
        this.clic_moment = null;
        this.createStructure(); 
    }

    createStructure() {
        var main = document.querySelector('main');
        var title = document.createElement('h2');
        title.textContent = "Juego de Reacción";
        main.appendChild(title);

        for (let i = 0; i < this.lights; i++) {
            var light = document.createElement('div');
            main.appendChild(light);
        }

        var initButton = document.createElement('button');
        var stopButton = document.createElement('button');

        initButton.textContent = "Arranque";
        stopButton.textContent = "Reacción";

        initButton.onclick = () => this.initSequence();
        stopButton.onclick = () => this.stopReaction();
        stopButton.disabled = true;

        main.appendChild(initButton);
        main.appendChild(stopButton);
    }

    initSequence() {
        var container = document.querySelector('main');
        container.classList.add('load');
        document.querySelector('button:first-of-type').disabled = true;

        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, 2000 + this.difficulty *1000);
    }

    endSequence() {
        var container = document.querySelector('main');
        container.classList.add('unload');
        document.querySelector('button:last-of-type').disabled = false;
    }

    stopReaction() {
        var container = document.querySelector('main');
        this.clic_moment = new Date();
        var tiempo = this.clic_moment - this.unload_moment;

        container.classList.remove('load');
        container.classList.remove('unload');

        document.querySelector('button:last-of-type').disabled = true;
        document.querySelector('button:first-of-type').disabled = false;

        this.createRecordForm(tiempo);
    }

    createRecordForm(reactionTime) {
        var formHTML = `
    <h4>Guardar record</h4>
    <form method='POST'>
        <label for="name">Nombre del jugador:</label>
        <input type="text" id="name" name="name" required><br><br>
    
        <label for="surname">Apellidos:</label>
        <input type="text" id="surname" name="surname" required><br><br>
    
        <label for="difficulty">Nivel de dificultad:</label>
        <input type="text" id="difficulty" name="difficulty" value="${this.difficulty}" readonly><br><br>
    
        <label for="reactionTime">Tiempo obtenido (segundos):</label>
        <input type="text" id="reactionTime" name="reactionTime" value="${(reactionTime / 1000).toFixed(2)}" readonly><br><br>
    
        <button type="submit">Guardar Record</button>
    </form>
`;

        var article = document.querySelector('button + article');
        article.innerHTML = formHTML;
    } 
}


