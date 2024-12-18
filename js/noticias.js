class Noticias {
    constructor() {
        // Verificamos si el navegador soporta la API File
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("Este navegador soporta la API File");
        } else {
            alert("¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!");
        }
    }

    readInputFile(inputFile) {

        //Seleccionamos el primer archivo
        var file = inputFile[0];

        const tipoTexto = /text.*/;
        if (!file.type.match(tipoTexto)) {
            alert("Error: El archivo seleccionado no es un archivo de texto.");
            return;
        }

        // Iniciamos la lectura del archivo con FileReader
        const reader = new FileReader();

        reader.onload = (event) => {

            const fileContent = event.target.result;

            // Dividimos el archivo en líneas
            const lineas = fileContent.split(/\r?\n/); // Separa en noticias

            // Tratamos cada noticia
            lineas.forEach((linea) => {
                const [titulo, noticia, autor] = linea.split("_"); // Dividimos por "_"
                if (titulo && noticia && autor) {
                    this.crearYAñadirNoticia(titulo, noticia, autor);
                }
            });
        };

        reader.readAsText(file);
    }

    crearYAñadirNoticia(titulo, descripcion, autor) {

        var contenedorNoticias = $("body section:last-of-type");
        const noticia = $("<article></article>");
        const tituloElemento = $("<h3></h3>").text(titulo);
        noticia.append(tituloElemento);
        const descripcionElemento = $("<p></p>").text(descripcion);
        noticia.append(descripcionElemento);
        const autorElemento = $("<p></p>").text(`Autor: ${autor}`);
        noticia.append(autorElemento);
        contenedorNoticias.append(noticia);
    }

    crearNoticia() {

        const inputs = document.querySelectorAll("section input[type='text']");
        const textarea = document.querySelector("section textarea");
    
        const titulo = inputs[0].value; 
        const autor = inputs[1].value; 
        const descripcion = textarea.value; 
    
    
        // Si alguno esta vacio mostamos una aletra
        if (titulo == "" || descripcion == "" || autor == "") {
            alert("Uno de los campos esta vacio.");
        } else {
            noticias.crearYAñadirNoticia( titulo, descripcion, autor);
            inputs[0].value = ""; 
            inputs[1].value = ""; 
            textarea.value = "";
        }
    }
}

const noticias = new Noticias();

