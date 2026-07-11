from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from model import load_model, predict

BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "models" / "iris_model.pth"

app = FastAPI(title="Iris Classifier")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

model = None


class IrisInput(BaseModel):
    sepal_length: float = Field(..., ge=0, le=10, description="cm")
    sepal_width: float = Field(..., ge=0, le=10, description="cm")
    petal_length: float = Field(..., ge=0, le=10, description="cm")
    petal_width: float = Field(..., ge=0, le=10, description="cm")


@app.on_event("startup")
def startup():
    global model
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Run train.py first."
        )
    model = load_model(str(MODEL_PATH))


@app.get("/", response_class=HTMLResponse)
def home():
    html_path = BASE_DIR / "templates" / "index.html"
    return html_path.read_text(encoding="utf-8")


@app.post("/predict")
def make_prediction(data: IrisInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = [
        data.sepal_length,
        data.sepal_width,
        data.petal_length,
        data.petal_width,
    ]
    return predict(model, features)
