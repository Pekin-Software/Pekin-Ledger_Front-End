import { useState, useEffect } from "react";
import { AlertCircle, Currency, Package } from "lucide-react";
import "./variantCard.css";

const VariantCard = ({
  isOpen,
  onClose,
  title = "",
  variants = [],
  currency = "",
  onQuantityChange = () => {},
  loading = false,
  error = "",
  initialQuantities = {},
}) => {
  const [quantities, setQuantities] = useState({});

  const handleClear = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleQtyInputBlur = (id) => {
    setQuantities((prev) => {
      const val = prev[id];
      if (val === "" || val === undefined) {
        return {
          ...prev,
          [id]: initialQuantities[id] ?? 0,
        };
      }
      return prev;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setQuantities(initialQuantities);
    }
  }, [isOpen, initialQuantities]);

  const updateQuantity = (id, newQty) => {
    const qty = Math.max(0, newQty);
    setQuantities((prev) => ({
      ...prev,
      [id]: qty,
    }));

    const variantData = variants.find((v) => v.id === id);
    if (variantData) {
      onQuantityChange(id, qty, variantData);
    }
  };

  const decreaseQty = (id) => {
    const currentQty = quantities[id] ?? 0;
    if (currentQty > 0) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const increaseQty = (id) => {
    const currentQty = quantities[id] ?? 0;
    updateQuantity(id, currentQty + 1);
  };

  const handleQtyInputChange = (id, e) => {
    const val = Number(e.target.value);
    if (val >= 0) {
      updateQuantity(id, val);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="variant-modal-overlay">
      <div className="variant-modal">
        <div className="variant-header">
          <h2 className="variant-modal-title">{title}</h2>
          <button className="variant-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="variant-modal-body">
          {loading ? (
            <div className="variant-grid">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div className="variant-card" key={idx}>
                  <div className="skeleton skeleton-image"> 
                  </div>
                  <div className="variant-info">
                    <p className=" skeleton txt"></p>
                    <p className=" skeleton txt"></p>
                  </div>
                  <div className="quantity-controls">
                    <div className="skeleton skeleton-btn"></div>
                    <div className="skeleton skeleton-input"></div>
                    <div className="skeleton skeleton-btn"></div>
                  </div>
                </div>
          ))}
            </div>
          ) : error ? (
            <div className="error">
              <AlertCircle size={30} className="error-icon" />
              <p>Error: {error}</p>
            </div>
          ) : variants.length > 0 ? (
            <div className="variant-grid">
              {variants.map((v) => {
                const qty = quantities[v.id] ?? 0;
                return (
                  <div className="variant-card" key={v.id}>
                    <div className="variant-image">
                      <img src={v.image} alt={v.name} />
                    </div>
                    <div className="variant-info">
                      <p className="variant-name">{`${v.name} ${title}`}</p>
                      <p className="variant-price">{currency}$ {v.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQty(v.id);
                        }}
                        disabled={qty <= 0}
                      >
                        –
                      </button>
                      <input
                        type="number"
                        min="0"
                        className="qty-input"
                        value={qty}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleQtyInputChange(v.id, e);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={() => handleClear(v.id)}
                        onBlur={() => handleQtyInputBlur(v.id)}
                      />
                      <button
                        className="qty-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQty(v.id);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-message">
              <Package size={38} />
              <p>No variants available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantCard;
