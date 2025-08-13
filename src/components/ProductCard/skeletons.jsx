import React from 'react';
import {Package} from 'lucide-react';
import "./skeleton.css" 

export function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton skeleton">
      <div className="skeleton-image-container">
        <Package size={48} className="skeleton-icon" />
      </div>
      <div className="skeleton-txt">
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  );
}
