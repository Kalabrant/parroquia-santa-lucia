import json

filepath = r"c:\Users\luxmu\OneDrive\Escritorio\Páginas Web\Web Parroquia\mapa-zonas-pastorales\src\data\zonas.json"

with open(filepath, 'r', encoding='utf-8') as f:
    zonas = json.load(f)

extensions = {
    1: " Su devoción nos invita a mantener la luz de la fe encendida en medio de las oscuridades del mundo moderno, siendo faros de esperanza.",
    2: " Este acontecimiento marca el preludio del plan divino, trayendo consigo la pureza y la anticipación de la encarnación del Salvador.",
    3: " Su ícono oriental nos enseña a acudir a ella con confianza filial en los momentos de angustia, sabiendo que sus brazos siempre están abiertos para consolarnos.",
    4: " Su vida es un extraordinario testimonio de paciencia, perdón y sufrimiento entregado por amor, demostrando que mediante la gracia, todo obstáculo puede superarse.",
    5: " Su aparición a Santa Bernadette subraya el amor preferencial de Dios por los humildes y los enfermos, invitándonos a la conversión y la oración reparadora.",
    6: " Modelo por excelencia del silencio activo y del trabajo digno, su obediencia y entrega total lo convierten en el protector silencioso de todas las familias cristianas.",
    7: " Su brillante intelecto logró armonizar la fe y la razón, dejándonos una vasta obra teológica que sigue siendo la brújula y pilar angular de la doctrina católica universal.",
    8: " Su devoción criolla, sumamente popular en nuestra región, nos refleja la alegría festiva, enseñando el valor del servicio franciscano a los más desposeídos.",
    9: " Su figura silente nos reconforta en nuestros propios duelos, enseñándonos íntimamente que incluso en la más profunda oscuridad del Sábado Santo, la esperanza nunca muere."
}

for z in zonas:
    # Extender hagiografia si no lo hemos hecho (chequeando clave)
    ext = extensions.get(z["id"], "")
    current = z["patrono"]["hagiografia"]
    if ext not in current:
        z["patrono"]["hagiografia"] = current + ext
        
    # Eliminar lugares
    if "lugares" in z:
        del z["lugares"]

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(zonas, f, indent=2, ensure_ascii=False)
