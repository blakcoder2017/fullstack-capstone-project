import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';// Make sure you have this file correctly set up
import './DetailsPage.css'; // optional styling

function DetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [gift, setGift] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Task 1: Authentication check
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/app/login');
      return;
    }

    // Task 3: Scroll to top
    window.scrollTo(0, 0);

    // Task 2: Fetch gift details
    const fetchGift = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch gift details');

        const data = await response.json();
        setGift(data.gift);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGift();
  }, [productId, navigate]);

  // Task 4: Handle back click
  const handleBackClick = () => {
    navigate(-1);
  };

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  if (!gift) {
    return <div className="container mt-5">Loading gift details...</div>;
  }

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={handleBackClick}>
        &larr; Go Back
      </button>

      <div className="card mb-4 p-4 shadow-sm">
        {gift.image ? (
          <img src={gift.image} alt={gift.name} className="product-image-large mb-3" />
        ) : (
          <div className="text-center text-muted">No Image Available</div>
        )}

        <h2>{gift.name}</h2>
        <p><strong>Category:</strong> {gift.category}</p>
        <p><strong>Condition:</strong> {gift.condition}</p>
        <p><strong>Age:</strong> {gift.age}</p>
        <p><strong>Date Added:</strong> {new Date(gift.createdAt).toLocaleDateString()}</p>
        <p><strong>Description:</strong> {gift.description}</p>
      </div>

      {/* Task 7: Comments Section */}
      <div className="card p-3 shadow-sm">
        <h4>Comments</h4>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="border-bottom py-2">
              <strong>{comment.user}</strong>: {comment.text}
            </div>
          ))
        ) : (
          <p className="text-muted">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default DetailsPage;
