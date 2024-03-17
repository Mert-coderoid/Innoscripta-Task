from flask import Flask, request, jsonify
import spacy
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

app = Flask(__name__)

nlp = spacy.load("en_core_web_sm")

geolocator = Nominatim(user_agent="Gazenews")

def geocode_location(location):
    try:
        return geolocator.geocode(location, timeout=10)
    except GeocoderTimedOut:
        return geocode_location(location)

@app.route('/extract-locations-batch', methods=['POST'])
def extract_locations_batch():
    try:
        data = request.json
        articles = data['articles']
        results = []

        for article in articles:
            doc = nlp(article['text'])
            article_locations = []

            for ent in doc.ents:
                if ent.label_ == "GPE":
                    location = geocode_location(ent.text)
                    if location:
                        article_locations.append({
                            "place": ent.text,
                            "coordinates": {"latitude": location.latitude, "longitude": location.longitude}
                        })

            results.append({"article": article, "locations": article_locations})

        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
