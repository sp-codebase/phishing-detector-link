# backend/train_model.py
import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
# import the feature extractor that exists in ml_utils.py
from ml_utils import extract_features_from_url

def featurize_series(urls):
    """Take an iterable of URLs and return a DataFrame of features
       This must match the keys returned by extract_features_from_url.
    """
    rows = []
    for u in urls:
        f = extract_features_from_url(u)
        # use the same keys that ml_utils.extract_features_from_url returns
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
    # adjust path to your CSV (this file must exist)
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'train.csv')
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Training CSV not found at {csv_path}")

    df = pd.read_csv(csv_path)
    # make sure columns exist and drop NA
    df = df.dropna(subset=['url','label'])
    urls = df['url'].astype(str)
    X = featurize_series(urls)
    y = df['label'].astype(int)

    # train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # create pipeline
    pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=1000))
    ])

    pipe.fit(X_train, y_train)

    # evaluate
    preds = pipe.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Test accuracy: {acc:.4f}")
    print(classification_report(y_test, preds))

    # save model to backend/model.pkl
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(pipe, f)
    print(f"Saved model to {model_path}")

if __name__ == '__main__':
    main()
