import torch
import torch.nn as nn

CLASS_NAMES = ["setosa", "versicolor", "virginica"]


class IrisClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear_layer_stack = nn.Sequential(
            nn.Linear(4, 10),
            nn.ReLU(),
            nn.Linear(10, 10),
            nn.ReLU(),
            nn.Linear(10, 3),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.linear_layer_stack(x)


def load_model(weights_path: str) -> IrisClassifier:
    model = IrisClassifier()
    state = torch.load(weights_path, map_location="cpu", weights_only=True)
    model.load_state_dict(state)
    model.eval()
    return model


def predict(model: IrisClassifier, features: list[float]) -> dict:
    x = torch.tensor([features], dtype=torch.float32)
    with torch.inference_mode():
        logits = model(x)
        probs = torch.softmax(logits, dim=1)[0]
        idx = probs.argmax().item()

    return {
        "species": CLASS_NAMES[idx],
        "confidence": round(probs[idx].item() * 100, 1),
        "probabilities": {
            name: round(prob.item() * 100, 1)
            for name, prob in zip(CLASS_NAMES, probs)
        },
    }
