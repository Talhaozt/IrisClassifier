# Iris Classifier

PyTorch ile eğitilmiş basit bir sinir ağı. Iris veri setindeki çiçek ölçülerinden tür tahmini yapar.

## Kurulum

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Model dosyası yoksa önce eğit:

```bash
python train.py
```

Bu komut `models/iris_model.pth` dosyasını oluşturur. Kendi eğittiğin `.pth` dosyan varsa aynı klasöre koyabilirsin.

## Çalıştırma

```bash
uvicorn app:app --reload
```

Tarayıcıda `http://127.0.0.1:8001` adresine git.

## Proje yapısı

```
├── app.py              # FastAPI uygulaması
├── model.py            # Model tanımı ve tahmin fonksiyonu
├── train.py            # Eğitim scripti
├── models/
│   └── iris_model.pth  # Eğitilmiş ağırlıklar
├── static/             # CSS ve JS
└── templates/          # HTML
```

## API

`POST /predict`

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

Yanıt:

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
