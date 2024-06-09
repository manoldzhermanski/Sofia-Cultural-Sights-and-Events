import requests
from bs4 import BeautifulSoup

# List of URLs to scrape
urls = [
"https://sofia-art-galleries.com/item/hostgallery/",
"https://sofia-art-galleries.com/item/little-bird-place-galeriya-i-sabitiya/",
"https://sofia-art-galleries.com/item/atelie-plastelin/",
"https://sofia-art-galleries.com/item/galeriya-plus-359/",
"https://sofia-art-galleries.com/item/galeriya-antikvariat-velev/",
"https://sofia-art-galleries.com/item/galeriya-auktsionna-kashta-enakor/",
"https://sofia-art-galleries.com/item/galeriya-88-kamen-popov/",
"https://sofia-art-galleries.com/item/galeriya-artvibes/",
"https://sofia-art-galleries.com/item/galeriya-blenda/",
"https://sofia-art-galleries.com/item/galeriya-credo-bonum/",
"https://sofia-art-galleries.com/item/galeriya-depoo/",
"https://sofia-art-galleries.com/item/galeriya-integrated-artists/",
"https://sofia-art-galleries.com/item/galeriya-one/",
"https://sofia-art-galleries.com/item/galeriya-ramjuly/",
"https://sofia-art-galleries.com/item/galeriya-spazio/",
"https://sofia-art-galleries.com/item/a-cube-galeriya-za-savremenno-izkustvo/",
"https://sofia-art-galleries.com/item/galeriya-absent/",
"https://sofia-art-galleries.com/item/galeriya-akademiya/",
"https://sofia-art-galleries.com/item/galeriya-arosita/",
"https://sofia-art-galleries.com/item/galeriya-art-aleya/",
"https://sofia-art-galleries.com/item/galeriya-artcenter-12/",
"https://sofia-art-galleries.com/item/galeriya-arte/",
"https://sofia-art-galleries.com/item/galeriya-artur/",
"https://sofia-art-galleries.com/item/galeriya-astri/",
"https://sofia-art-galleries.com/item/galeriya-b61/",
"https://sofia-art-galleries.com/item/galeriya-balgari/",
"https://sofia-art-galleries.com/item/galeriya-valer/",
"https://sofia-art-galleries.com/item/galeriya-galeriya/",
"https://sofia-art-galleries.com/item/galeriya-etyud/",
"https://sofia-art-galleries.com/item/galeriya-ikar/",
"https://sofia-art-galleries.com/item/galeriya-intro/",
"https://sofia-art-galleries.com/item/galeriya-kontrast/",
"https://sofia-art-galleries.com/item/galeriya-kuklite/",
"https://sofia-art-galleries.com/item/galeriya-lik/",
"https://sofia-art-galleries.com/item/galeriya-loran/",
"https://sofia-art-galleries.com/item/galeriya-maestro/",
"https://sofia-art-galleries.com/item/galeriya-minerva/",
"https://sofia-art-galleries.com/item/galeriya-misiyata/",
"https://sofia-art-galleries.com/item/galeriya-nirvana/",
"https://sofia-art-galleries.com/item/galeriya-noy/",
"https://sofia-art-galleries.com/item/galeriya-nyuans/",
"https://sofia-art-galleries.com/item/galeriya-pagane/",
"https://sofia-art-galleries.com/item/galeriya-palitra/",
"https://sofia-art-galleries.com/item/galeriya-parizh/",
"https://sofia-art-galleries.com/item/galeriya-rakursi/",
"https://sofia-art-galleries.com/item/galeriya-rafaela/",
"https://sofia-art-galleries.com/item/galeriya-san-stefano/",
"https://sofia-art-galleries.com/item/galeriya-serdika/",
"https://sofia-art-galleries.com/item/galeriya-sintezis/",
"https://sofia-art-galleries.com/item/galeriya-slon/",
"https://sofia-art-galleries.com/item/galeriya-struktura/",
"https://sofia-art-galleries.com/item/galeriya-stubel/",
"https://sofia-art-galleries.com/item/galeriya-testa/",
"https://sofia-art-galleries.com/item/galeriya-uniart/",
"https://sofia-art-galleries.com/item/natsionalna-galeriya-kvadrat-500/",
"https://sofia-art-galleries.com/item/muzei-boris-hristov/",
"https://sofia-art-galleries.com/item/natsionalna-hudozhestvena-galeriya/",
"https://sofia-art-galleries.com/item/sghg-sofijska-gradska-hudozhestvena-galeriya/"
# Add more URLs as needed
]

# for i in range(2,9):
#     # URL of the site to scrape
#     url = f"https://sofia-art-galleries.com/cat/galerii-i-muzei-v-sofia/page/{i}/"

#     # Send a GET request to the site
#     response = requests.get(url)
#     response.raise_for_status()  # Check if the request was successful

#     # Parse the HTML content
#     soup = BeautifulSoup(response.text, 'html.parser')

#     # Find all a elements with href starting with 'https://sofia-art-galleries.com/item/'
#     item_links = soup.find_all('a', href=lambda href: href and href.startswith('https://sofia-art-galleries.com/item/'))

#     # Extract and print the href attribute of each <a> tag
#     for link in item_links:
#         print(link['href'])

# Function to scrape latitude and longitude from a single URL
def scrape_lat_long(url):
    # Send a GET request to the site
    response = requests.get(url)
    response.raise_for_status()  # Check if the request was successful

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the div with class 'cd-data' and itemtype 'http://schema.org/GeoCoordinates'
    geo_div = soup.find('div', class_='cd-data', itemtype='http://schema.org/GeoCoordinates')
    
    if geo_div:
        # Find the meta tags for latitude and longitude
        latitude_meta = geo_div.find('meta', itemprop='latitude')
        longitude_meta = geo_div.find('meta', itemprop='longitude')
        
        if latitude_meta and longitude_meta:
            latitude = latitude_meta['content']
            longitude = longitude_meta['content']
            return latitude, longitude
    
    return None, None

# Loop through the URLs and scrape the latitude and longitude
for url in urls:
    latitude, longitude = scrape_lat_long(url)
    if latitude and longitude:
        print(f"URL: {url}\nLatitude: {latitude}\nLongitude: {longitude}\n")
    else:
        print(f"URL: {url}\nLatitude and Longitude not found\n")