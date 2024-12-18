import xml.etree.ElementTree as ET
import simplekml
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Function to convert XML to KML
def xml_to_kml(xml_file, kml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    kml = simplekml.Kml()

    # Get circuit information
    name = root.find('{http://www.uniovi.es}name').text

    # Add a KML document
    document = kml.newdocument(name=name)

    # Initialize an empty list for coordinates
    coords = []
    segments = root.findall('{http://www.uniovi.es}segments/{http://www.uniovi.es}segment')
    
    for segment in segments:
        latitude = segment.find('{http://www.uniovi.es}coordinates/{http://www.uniovi.es}latitude').text
        longitude = segment.find('{http://www.uniovi.es}coordinates/{http://www.uniovi.es}longitude').text
        altitude = segment.find('{http://www.uniovi.es}coordinates/{http://www.uniovi.es}altitude').text
        distance = segment.find('{http://www.uniovi.es}distance').text

        # Create a point in the KML
        point = document.newpoint(name=f'Segment: {distance} m', coords=[(float(longitude), float(latitude), float(altitude))])

        # Append coordinates to the list
        coords.append((float(longitude), float(latitude), float(altitude)))

    # Close the circuit by adding the first coordinate again
    if coords:  # Check if there are any coordinates
        coords.append(coords[0])  # Add the first point to the end of the list

    # Create a line for the circuit with red color
    line = document.newlinestring(name="Circuito", coords=coords)

    # Set the style for the line to red
    line.style.linestyle.color = simplekml.Color.red  # Color red in KML
    line.style.linestyle.width = 4  # Optional: Set line width

    kml.save(kml_file)
    print(f"Archivo KML '{kml_file}' generado exitosamente.")

# Function to create a PDF of the planimetry
def create_pdf(kml_file, pdf_file):
    c = canvas.Canvas(pdf_file, pagesize=letter)
    width, height = letter

    # Title
    c.drawString(100, height - 50, "Planimetría del Circuito")
    
    # KML details
    c.drawString(100, height - 100, f"Archivo KML: {kml_file}")
    
    # You can include more details here as needed

    # Finalize the PDF
    c.save()
    print(f"Archivo PDF '{pdf_file}' generado exitosamente.")

# File paths
xml_file = 'circuitoEsquema.xml'
kml_file = 'circuito.kml'
pdf_file = 'planimetria.pdf'
# Generate KML and PDF
xml_to_kml(xml_file, kml_file)
create_pdf(kml_file, pdf_file)
