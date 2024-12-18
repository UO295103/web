import xml.etree.ElementTree as ET

def generar_svg_altimetria(archivo_xml, archivo_svg):
    # Definir el tamaño del SVG
    ancho = 1000
    alto = 300
    margen = 50  # Margen para las etiquetas

    # Cargar y parsear el archivo XML
    arbol = ET.parse(archivo_xml)
    raiz = arbol.getroot()

    # Extraer las distancias y altitudes
    namespace = {"ns": "http://www.uniovi.es"}  # Define el espacio de nombres
    distancias = []
    altitudes = []
    
    for segmento in raiz.findall('.//ns:segment', namespaces=namespace):
        distancia = float(segmento.find('ns:distance', namespaces=namespace).text)
        altitud = float(segmento.find('ns:coordinates/ns:altitude', namespaces=namespace).text)
        distancias.append(distancia)
        altitudes.append(altitud)

    # Normalizar distancias y altitudes para ajustarse al SVG
    max_distancia = sum(distancias)
    max_altitud = max(altitudes)
    puntos_svg = [
        (
            (sum(distancias[:i+1]) / max_distancia) * (ancho - margen * 2) + margen,
            alto - ((altitud / max_altitud) * (alto - margen * 2)) - margen
        )
        for i, altitud in enumerate(altitudes)
    ]

    # Crear el archivo SVG
    with open(archivo_svg, 'w') as svg:
        svg.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        svg.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{ancho}" height="{alto}" version="1.1">\n')

        # Dibujar la rejilla de medida y etiquetas en el eje de distancia
        for i in range(0, int(max_distancia) + 1, 500):  # Intervalo cada 500 metros
            x = (i / max_distancia) * (ancho - margen * 2) + margen
            svg.write(f'<line x1="{x}" y1="{alto - margen}" x2="{x}" y2="{margen}" stroke="lightgrey" stroke-width="0.5"/>\n')
            svg.write(f'<text x="{x}" y="{alto - margen + 15}" font-size="10" text-anchor="middle">{i}m</text>\n')
        
        # Dibujar la rejilla de medida y etiquetas en el eje de altitud
        for i in range(0, int(max_altitud) + 1, 2):  # Intervalo cada 2 metros de altitud
            y = alto - ((i / max_altitud) * (alto - margen * 2)) - margen
            svg.write(f'<line x1="{margen}" y1="{y}" x2="{ancho - margen}" y2="{y}" stroke="lightgrey" stroke-width="0.5"/>\n')
            svg.write(f'<text x="{margen - 10}" y="{y + 4}" font-size="10" text-anchor="end">{i}m</text>\n')

        # Dibujar la línea de altimetría
        svg.write('<polyline points="')
        for x, y in puntos_svg:
            svg.write(f'{x},{y} ')
        svg.write('" fill="none" stroke="blue" stroke-width="2"/>\n')

        # Etiquetas de los ejes
        svg.write(f'<text x="{ancho / 2}" y="{alto - 5}" font-size="12" text-anchor="middle">Distancia (m)</text>\n')
        svg.write(f'<text x="15" y="{alto / 2}" font-size="12" text-anchor="middle" transform="rotate(-90 15,{alto / 2})">Altitud (m)</text>\n')

        svg.write('</svg>')
    
    print(f"SVG generado correctamente en {archivo_svg}")

# Ejecutar la función con el archivo XML y el archivo SVG de salida
generar_svg_altimetria('circuitoEsquema.xml', 'altimetria.svg')
