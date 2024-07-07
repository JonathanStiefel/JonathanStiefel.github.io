import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load your trained model
model = load_model('doodle.py')  # Update with your model path
class_names = ['airplane', 'apple']  # Update with your class names

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Process incoming data (assuming it's a 28x28 grayscale image)
    image = np.array(data['image']).reshape((1, 28, 28, 1))
    # Make prediction
    prediction = model.predict(image)
    predicted_class = class_names[np.argmax(prediction)]
    return jsonify({'prediction': predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
