# backend/phishing/python/train_model.py

import pandas as pd
import numpy as np
import os
import pickle

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

from ml_utils import extract_features_from_url


def featurize_series(urls):
    """
    Convert list of URLs → feature DataFrame
    MUST match extract_features_from_url()
    """
    rows = []

    for u in urls:
        try:
            f = extract_features_from_url(u)

            rows.append([
                f['length'],
                f['count_dots'],
                f['count_hyphens'],
                f['count_at'],
                f['count_question'],
                f['has_https'],
                f['suspicious_token_count'],
                f['digit_ratio']
            ])

        except Exception as e:
            print(f"⚠️ Skipping bad URL: {u} | Error: {e}")

    cols = [
        'length',
        'count_dots',
        'count_hyphens',
        'count_at',
        'count_question',
        'has_https',
        'suspicious_token_count',
        'digit_ratio'
    ]

    return pd.DataFrame(rows, columns=cols)


def main():
    print("🚀 Starting model training...")

    # Path to dataset
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'train.csv')

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"❌ Training CSV not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # Clean data
    df = df.dropna(subset=['url', 'label'])

    urls = df['url'].astype(str)
    y = df['label'].astype(int)

    print(f"📊 Total samples: {len(df)}")

    # Extract features
    X = featurize_series(urls)

    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"🧠 Training on {len(X_train)} samples...")

    # Pipeline
    pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=1000))
    ])

    pipe.fit(X_train, y_train)

    # Evaluation
    preds = pipe.predict(X_test)
    acc = accuracy_score(y_test, preds)

    print("\n📈 MODEL PERFORMANCE")
    print(f"Accuracy: {acc:.4f}")
    print(classification_report(y_test, preds))

    # Save model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

    with open(model_path, 'wb') as f:
        pickle.dump(pipe, f)

    print(f"\n✅ Model saved at: {model_path}")


if __name__ == '__main__':
    main()