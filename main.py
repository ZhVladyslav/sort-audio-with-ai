from flask import Flask, request, jsonify
import whisper
import os
from configs import Config

app = Flask(__name__)
config = Config()
model = whisper.load_model("base")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    req_data = request.get_json()
    filename = req_data.get('filename')

    if not filename:
        return jsonify({"error": "File not found"}), 400
    
    filepath = os.path.join(config.audio_dir, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 400

    result = model.transcribe(filepath)

    return jsonify({
        "file": filename,
        "text": result["text"]
        })

if __name__ == '__main__':
    app.run(host=config.host, port=config.port)