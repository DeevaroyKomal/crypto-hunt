from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from predictor import (
    predict_bitcoin,
    predict_ethereum,
    predict_solana,
    predict_xrp,
    BTC_NAME,
    ETH_NAME,
    SOL_NAME,
    XRP_NAME
)

app = Flask(__name__)
CORS(app)

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('images', filename)

@app.route("/predictions")
def predictions():
    return jsonify([
        {"name": BTC_NAME, "result": predict_bitcoin(), "image": "http://xxxxxxxxx/images/bitcoin.png"},
        {"name": ETH_NAME, "result": predict_ethereum(), "image": "http://xxxxxxxxxxxx/images/ethereum.png"},
        {"name": SOL_NAME, "result": predict_solana(), "image": "http://xxxxxxxxxxxxx/images/solana.png"},
        {"name": XRP_NAME, "result": predict_xrp(), "image": "http://xxxxxxxxxxxxxxx/images/xrp.png"}
    ])

if __name__ == "__main__":
    app.run(debug=True)
