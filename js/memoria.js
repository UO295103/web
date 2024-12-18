class Memoria {
    cards = {
        "RedBullA": {
            "element": "RedBull",
            "source": "multimedia/imagenes/Red_Bull_Racing_logo.svg"
        },
        "RedBullB": {
            "element": "RedBull",
            "source": "multimedia/imagenes/Red_Bull_Racing_logo.svg"
        },
        "AlpineA": {
            "element": "Alpine",
            "source": "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg"
        },
        "AlpineB": {
            "element": "Alpine",
            "source": "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg"
        },
        "McLarenA": {
            "element": "McLaren",
            "source": "multimedia/imagenes/McLaren_Racing_logo.svg"
        },
        "McLarenB": {
            "element": "McLaren",
            "source": "multimedia/imagenes/McLaren_Racing_logo.svg"
        },
        "FerrariA": {
            "element": "Ferrari",
            "source": "multimedia/imagenes/Scuderia_Ferrari_Logo.svg"
        },
        "FerrariB": {
            "element": "Ferrari",
            "source": "multimedia/imagenes/Scuderia_Ferrari_Logo.svg"
        },
        "AstonMartinA": {
            "element": "AstonMartin",
            "source": "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        "AstonMartinB": {
            "element": "AstonMartin",
            "source": "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        "MercedesA": {
            "element": "Mercedes",
            "source": "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg"
        },
        "MercedesB": {
            "element": "Mercedes",
            "source": "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg"
        }
    };

    constructor() {
        this.resetBoard();
        this.shuffleElements();
        this.createElements();
        this.addEventListener();
        this.flipSound = document.querySelector('audio');
    }

    shuffleElements() {
        const orderCards = Object.entries(this.cards);
        for (let i = orderCards.length - 1; i > 0; i--) {
            const pos = Math.floor(Math.random() * (i + 1));
            [orderCards[i], orderCards[pos]] = [orderCards[pos], orderCards[i]]; 
        }
        this.cards = Object.fromEntries(orderCards); 
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        if (this.firstCard.dataset.element === this.secondCard.dataset.element) {
            this.disableCards();
        } else {
            this.unflipCards();
        }
    }

    disableCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.setAttribute('data-state', 'revealed'); // Cambiar el estado a 'revealed'
            this.secondCard.setAttribute('data-state', 'revealed'); 
            this.checkFinish();
            this.resetBoard();
        }, 100);
    }

    checkFinish() {
        const articles = document.querySelectorAll('article'); // Selecciona todos los artículos
    
        const allRevealed = Array.from(articles).every(article => {
            return article.getAttribute('data-state') === 'revealed';
        });
    
        if (allRevealed) {
            alert('Enhorabuena, ¡Has terminado el juego!');
        }
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.removeAttribute('data-state'); // Volver al estado original
            this.secondCard.removeAttribute('data-state'); 
            this.resetBoard();
        }, 700);
    }

    createElements() {
        const orderCards = Object.entries(this.cards);
        const container = document.querySelector('section + section'); 
        var title = document.createElement('h2');
        title.textContent = 'Comienza a jugar';
        container.appendChild(title);

        orderCards.forEach(([key, value]) => {
            const newArticle = document.createElement('article');
            newArticle.setAttribute('data-element', value.element);
            newArticle.setAttribute('data-state', "unflip");

            const heading = document.createElement('h3');
            const image = document.createElement('img');

            heading.textContent = "Tarjeta de memoria";
            image.src = value.source;
            image.alt = value.element;

            newArticle.appendChild(heading);
            newArticle.appendChild(image);

            container.appendChild(newArticle);
        });
    }

    addEventListener() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            article.addEventListener('click', (event) => {
                this.flipCard.bind(this, event.currentTarget)();
            });            
        });
    }

    addEventListener() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            article.addEventListener('click', this.flipCard.bind(article, this));
        });
    }
    
    flipCard(game) {
        const card = this; 
        
        if (card.dataset.state === 'revealed' || game.lockBoard || game.firstCard === card) {
            return; 
        }
    
        game.flipSound.play();
    
        card.setAttribute('data-state', 'flip');
    
        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = card;
        } else {
            game.secondCard = card; 
            game.checkForMatch();
        }
    }
    
}

document.addEventListener('DOMContentLoaded', function() {
    const mem = new Memoria();
});

