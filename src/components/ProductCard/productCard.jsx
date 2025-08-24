import React, { useState } from 'react';
import { Package, ShoppingCart, AlertCircle } from 'lucide-react';
import './productCard.css';


export default function ProductCard({
  showVariantCardOnClick = false,
  onCardClick = () => {},
  itemName,
  imageSrc,
  selected = false,

}) {

  const [imgError, setImgError] = useState(false);
  const [variantOpen, setvariantOpen] = useState(false);

  const handleCardClick = () => {
    if (showVariantCardOnClick) {
      setvariantOpen(true);
    }
     onCardClick();
  };


  return (
    <div className={`product-cards ${selected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="product-img-container">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={itemName}
            className="product-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <Package size={48} className="fallback-icon" />
        )}
      </div>

      <div className="product-details">
          <div className="product-name">{itemName}</div>
      </div>
    </div>
  );
}
