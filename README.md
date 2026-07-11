# Iris Flower Classifier

A full-stack machine learning web application that classifies Iris flowers into one of three species based on their sepal and petal measurements.

The classification model is implemented and trained using **PyTorch**. The trained model is served through a **FastAPI** backend, while the user interface is built with **HTML, CSS, and JavaScript**.

The application also includes a dynamic flower visualization that changes according to the measurements entered by the user.

## Overview

Users provide four numerical measurements:

- Sepal length
- Sepal width
- Petal length
- Petal width

The application sends these values to the FastAPI prediction endpoint.

The PyTorch model processes the input and returns:

- The predicted Iris species
- The model's confidence score
- The probability of each supported species

## Supported Species

The model classifies flowers into the following three Iris species:

- Iris Setosa
- Iris Versicolor
- Iris Virginica

## Features

- Neural network model developed and trained with PyTorch
- Model training using the Iris dataset
- FastAPI-based REST API
- Interactive web interface
- Frontend built with HTML, CSS, and JavaScript
- Dynamic flower visualization based on user input
- Prediction confidence score
- Probability distribution for all supported classes
- Support for saved PyTorch `.pth` model weights
- Separation of training, inference, backend, and frontend components

## Technology Stack

### Machine Learning

- Python
- PyTorch
- Scikit-learn
- NumPy

### Backend

- FastAPI
- Uvicorn

### Frontend

- HTML5
- CSS3
- JavaScript

## Project Structure

```text
IrisClassifier/
├── app.py                  # FastAPI application and API routes
├── model.py                # PyTorch model architecture and prediction logic
├── train.py                # Model training script
├── requirements.txt        # Project dependencies
├── README.md               # Project documentation
├── .gitignore              # Git ignore configuration
├── models/
│   └── iris_model.pth      # Trained PyTorch model weights
├── static/
│   ├── css/                # Stylesheets
│   └── js/                 # Frontend JavaScript files
└── templates/
    └── index.html           # Main web interface
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Talhaozt/IrisClassifier.git
cd IrisClassifier
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate the Virtual Environment

#### macOS / Linux

```bash
source .venv/bin/activate
```

#### Windows

```bash
.venv\Scripts\activate
```

### 4. Install the Dependencies

```bash
pip install -r requirements.txt
```

## Model Training

To train the PyTorch neural network, run:

```bash
python train.py
```

After training is completed, the trained model weights are saved to:

```text
models/iris_model.pth
```

The FastAPI application loads the trained model weights and uses them to perform inference.

## Running the Application

Start the FastAPI development server:

```bash
uvicorn app:app --reload --port 8001
```

Then open the application in your browser:

```text
http://127.0.0.1:8001
```

## How It Works

1. The user enters the flower's sepal and petal measurements.

2. JavaScript collects the input values from the web interface.

3. The frontend sends a `POST` request to the FastAPI `/predict` endpoint.

4. FastAPI validates and processes the input data.

5. The input values are converted into a tensor compatible with the PyTorch model.

6. The trained neural network performs inference.

7. The backend calculates the predicted species, confidence score, and class probabilities.

8. FastAPI returns the prediction result as JSON.

9. The frontend displays the prediction results to the user.

## API Reference

### Predict Iris Species

```http
POST /predict
```

### Request Body

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

### Example Response

```json
{
  "species": "setosa",
  "confidence": 98.5,
  "probabilities": {
    "setosa": 98.5,
    "versicolor": 1.2,
    "virginica": 0.3
  }
}
```

## Input Parameters

| Parameter | Description |
|---|---|
| `sepal_length` | Length of the flower's sepal |
| `sepal_width` | Width of the flower's sepal |
| `petal_length` | Length of the flower's petal |
| `petal_width` | Width of the flower's petal |

## User Interface

The web interface provides:

- Four numerical measurement inputs
- An interactive prediction button
- A dynamically generated flower illustration
- Reference illustrations for the three Iris species
- Prediction confidence and probability information

The flower diagram dynamically changes according to the entered petal and sepal measurements, providing a more interactive visualization of the input data.

## API Documentation

FastAPI automatically provides interactive API documentation.

After starting the application, the Swagger UI documentation is available at:

```text
http://127.0.0.1:8001/docs
```

The ReDoc documentation is available at:

```text
http://127.0.0.1:8001/redoc
```

## Application Workflow

```text
Iris Dataset
     │
     ▼
Data Preparation
     │
     ▼
PyTorch Neural Network Training
     │
     ▼
Trained Model Weights (.pth)
     │
     ▼
FastAPI Backend
     │
     ▼
Model Inference
     │
     ▼
JSON Prediction Response
     │
     ▼
HTML / CSS / JavaScript Interface
     │
     ▼
Prediction Result
```

## Future Improvements

- Add detailed model evaluation metrics
- Add training and validation loss visualizations
- Implement automated tests
- Containerize the application with Docker
- Deploy the application to a cloud platform
- Add client-side and server-side input validation
- Implement model versioning

## Disclaimer

This project was developed for educational and portfolio purposes to demonstrate the integration of a PyTorch machine learning model with a FastAPI backend and a custom web interface.
