import React, { useState } from 'react';
import { Package } from 'lucide-react';
import './ItemCard.css';

export default function ItemCard({
  itemName,
  price,
  imageSrc,
  selected = false,
  quantity = 0,
  onSelect = () => {},
  onQuantityChange = () => {},
}) {
  const [imgError, setImgError] = useState(false);

  const handleDecrease = (e) => {
    e.stopPropagation();
    const newQty = quantity - 1;
    if (newQty <= 0) {
      onQuantityChange(0);
      onSelect(false); // Deselect the item
    } else {
      onQuantityChange(newQty);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    const newQty = quantity + 1;
    if (quantity === 0) {
      onSelect(true); // Select the item
    }
    onQuantityChange(newQty);
  };

  const handleInputChange = (e) => {
    e.stopPropagation();
    const val = parseInt(e.target.value, 10);
    const sanitizedVal = isNaN(val) || val < 0 ? 0 : val;

    if (sanitizedVal === 0) {
      onQuantityChange(0);
      onSelect(false);
    } else {
      if (quantity === 0) onSelect(true); // select if moving from 0
      onQuantityChange(sanitizedVal);
    }
  };

  return (
    <div
      className={`item-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(!selected)}
    >
      <div className="item-img-container">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={itemName}
            className="item-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <Package size={48} className="fallback-icon" />
        )}
      </div>

      <div className="item-details">
        <div className="item-name">{itemName}</div>
        <div className="item-price">${price.toFixed(2)}</div>

        {/* Always show quantity control */}
        <div className="quantity-ctrl">
          <button onClick={handleDecrease}>-</button>
          <input
            type="number"
            value={quantity}
            min={0}
            onChange={handleInputChange}
          />
          <button onClick={handleIncrease}>+</button>
        </div>
      </div>
    </div>
  );
}
