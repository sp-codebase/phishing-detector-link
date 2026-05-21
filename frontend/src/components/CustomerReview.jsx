import React, { useState, useEffect } from "react";
import "./CustomerReview.css";

const CustomerReview = () => {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("customer_reviews") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("customer_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !review) return;

    const newReview = {
      id: Date.now(),
      name,
      review,
    };

    setReviews([newReview, ...reviews]);
    setName("");
    setReview("");
  };

  return (
    <div className="review-container">
      <h1>Customer Reviews</h1>

      {/* Review Form */}
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button type="submit">Submit Review</button>
      </form>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card">
              <h3>{r.name}</h3>
              <p>{r.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerReview;
