import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder
import xgboost as xgb
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('dataset_merged.csv', index_col=0)

# Convert date to datetime format
df['date'] = pd.to_datetime(df['date'], format="%Y-%m-%d")

print("Dataset:\n")
print(df.head())

# Select features and target
features = ['installed_power', 'rain', 'temperature', 'humidity', 'wind_speed', 'solar_power', 'wind_direction']
target = 'power_production'

X = df[features]
y = df[target]

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.7, 0.8, 0.9],
    'colsample_bytree': [0.7, 0.8, 0.9]
}

xgb_model = xgb.XGBRegressor(random_state=42)

grid_search = GridSearchCV(estimator=xgb_model, param_grid=param_grid, cv=3, scoring='neg_mean_absolute_error', n_jobs=-1)
grid_search.fit(X_train, y_train)

# Best parameters
best_params = grid_search.best_params_
print(f"Best parameters: {best_params}")

# Train the model with the best parameters
best_model = xgb.XGBRegressor(**best_params, random_state=42)
best_model.fit(X_train, y_train)

# Make predictions
y_pred = best_model.predict(X_test)

print(y_pred.tolist()[0])
print(y_test.tolist()[0])
# Evaluate the model

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Absolute Error: {mae}")
print(f"R-squared: {r2}")

plt.figure(figsize=(12, 6))
plt.plot(y_test.index, y_test, label='Actual Power Production', color='blue')
plt.plot(y_test.index, y_pred, label='Predicted Power Production', color='red')
plt.title('Actual vs Predicted Power Production')
plt.xlabel('Date')
plt.ylabel('Power Production')
plt.legend()
plt.show()

# Save the model for future use
import joblib
joblib.dump(best_model, 'pv_power_prediction_model.pkl')
