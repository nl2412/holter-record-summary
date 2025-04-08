from flask import Flask, Blueprint
from flask_cors import CORS
from configuration import PORT, HOSTNAME, DEBUG
from api import api_v1

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_v1, url_prefix="/api/v1")

if __name__ == "__main__":
    app.run(host=HOSTNAME, port=PORT, debug=DEBUG)