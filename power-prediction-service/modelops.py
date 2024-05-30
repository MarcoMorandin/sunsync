from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load('pv_power_prediction_model.pkl')


@app.route('/')
def index():
    return "Pv power production service"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        df = pd.json_normalize(data)
        predictions = model.predict(df)
        res = {
            'predictions': predictions.tolist()
        }
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8001)
