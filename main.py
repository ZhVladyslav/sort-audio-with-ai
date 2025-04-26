from flask import Flask, request, jsonify
import whisper
import os

app = Flask(__name__)
model = whisper.load_model("base")
audio_dir = "audio"
output = []

@app.route('/transcribe', methods=['POST'])
def transcribe():
    req_data = request.get_json()
    filename = req_data.get('filename')

    if not filename:
        return jsonify({"error": "File not found"}), 400
    
    filepath = os.path.join(audio_dir, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 400

    result = model.transcribe(filepath)

    return jsonify({
        "file": filename,
        "text": result["text"]
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)