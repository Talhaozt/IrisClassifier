"""Train the iris model and save weights to models/iris_model.pth"""

from pathlib import Path

import torch
import torch.nn as nn
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from torchmetrics.classification import MulticlassAccuracy

from model import IrisClassifier

MODEL_PATH = Path(__file__).parent / "models" / "iris_model.pth"


def main():
    iris = load_iris()
    X = torch.tensor(iris.data, dtype=torch.float32)
    y = torch.tensor(iris.target, dtype=torch.long)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = IrisClassifier()
    loss_fn = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    accuracy = MulticlassAccuracy(num_classes=3)

    for epoch in range(200):
        model.train()
        logits = model(X_train)
        loss = loss_fn(logits, y_train)
        pred = torch.softmax(logits, dim=1).argmax(dim=1)
        acc = accuracy(pred, y_train).item() * 100

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        model.eval()
        with torch.inference_mode():
            test_logits = model(X_test)
            test_loss = loss_fn(test_logits, y_test)
            test_pred = torch.softmax(test_logits, dim=1).argmax(dim=1)
            test_acc = accuracy(test_pred, y_test).item() * 100

        if epoch % 20 == 0:
            print(
                f"Epoch: {epoch} | Loss: {loss:.5f} | Acc: {acc:.2f}% | "
                f"Test Loss: {test_loss:.5f} | Test Acc: {test_acc:.2f}%"
            )

    MODEL_PATH.parent.mkdir(exist_ok=True)
    torch.save(model.state_dict(), MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
