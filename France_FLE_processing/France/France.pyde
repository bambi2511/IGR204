places = []
# minX, maxX = 0, 0
# minY, maxY = 0, 0
view_width = 800
view_height = 800
x_ref, y_ref = 0, 0


def setup():
    global view_width, view_height 
    size(view_width, view_height)
    # noLoop()
    readData()
    labelFont = loadFont("data/Serif.plain-48.vlw")
    textFont(labelFont, 32)
    frameRate = 20

        
def draw():
    global x_ref, y_ref
    background(255)
    # println("x_ref : {}, y_ref: {}".format(x_ref, y_ref))
    translate(x_ref, y_ref)
    # black = color(0)
    cblue = color(66, 134, 244)
    for place in places:
        place.draw(cblue)
    
    
def mousePressed():
    global x_ref, y_ref
    println("mousePressed : X = {}, Y = {}, xref {}, yref {}".format(mouseX, mouseY, x_ref, y_ref))
    
    city, min_distance = None, float("inf")
    for place in places:
        # print place.x, place.y
        tmp_distance = (place.x - (mouseX - x_ref))**2 + (place.y - (mouseY - y_ref))**2
        if (tmp_distance < min_distance):
            city, min_distance = place, tmp_distance
            println("place {}, distance {}".format(place.postalCode, tmp_distance))
    
    textSize(32)
    fill(50)
    noStroke()    
    ellipse(mouseX - x_ref, mouseY - y_ref, 10, 10)
    text("Hello {}\n Pop: {}".format(city.name, city.population), 50 - x_ref, 50 - y_ref)

        
def mouseDragged():
    global x_ref, y_ref
    println("mouseDragged : X = {}, Y = {}".format(mouseX - pmouseX, mouseY - pmouseY))
    x_ref = x_ref + mouseX - pmouseX
    y_ref = y_ref + mouseY - pmouseY
    redraw()


def readData():
    global minX, maxX, minY, maxY, places
    lines = loadStrings("http://www.infres.enst.fr/~eagan/class/igr204/data/population.tsv")
    print "Loaded", len(lines), "lines" # for debugging
    # First line contains metadata
    # Second line contains column labels
    # Third line and onward contains data cases
    for line in lines[2:]:
        columns = line.split("\t")
        
        place = Place()
        place.postalCode = int(columns[0])
        place.longitude = float(columns[1])
        place.latitude = float(columns[2])
        place.name = columns[4]
        place.population = int(columns[5])
        place.density = float(columns[6])
        places.append(place)
        
    Place.minX = min(places, key=lambda place: place.longitude).longitude
    Place.maxX = max(places, key=lambda place: place.longitude).longitude
    Place.minY = min(places, key=lambda place: place.latitude).latitude
    Place.maxY = max(places, key=lambda place: place.latitude).latitude
    
    Place.minPop = min(places, key=lambda place: place.population).population
    Place.maxPop = max(places, key=lambda place: place.population).population
    Place.minDens = min(places, key=lambda place: place.density).density
    Place.maxDens = max(places, key=lambda place: place.density).density


class Place(object):
    minX, maxX = (0, 0)
    minY, maxY = (0, 0)
    minPop, maxPop = (0, 0)
    minDens, maxDens = (0, 0)
    
    longitude = 0
    latitude = 0
    name = ""
    postalCode = 0
    population = -1
    density = -1
    
    @property
    def x(self):
        return map(self.longitude, self.minX, self.maxX, 0, width)
    
    @property
    def y(self):
        return map(self.latitude, self.minY, self.maxY, height, 0)
    
    @property
    def radius(self):
        return map(self.population, self.minPop, self.maxPop, 1, 100)
    
    @property
    def opacity(self):
        return map(self.density, self.minDens, self.maxDens, 100, 200)
    
    def draw(self, col):
        try:
            fill(col, self.opacity)
            noStroke()
            ellipse(self.x, self.y, self.radius, self.radius)
            
        except Exception, e:
            print "Error drawing place at ({}, {}): {}".format(self.x, self.y, e)

        
