import React, { useState } from 'react';
import './DiscountModal.css';

const DiscountModal = ({ isOpen, onClose, onApply }) => {
  const [mode, setMode] = useState('amount'); // 'amount' or 'percentage'
  const [amountDiscount, setAmountDiscount] = useState({ LRD: '', USD: '' });
  const [percentageDiscount, setPercentageDiscount] = useState({ LRD: 0, USD: 0 });

  const handleIncrement = (currency) => {
    setPercentageDiscount((prev) => ({
      ...prev,
      [currency]: Math.min(prev[currency] + 1, 100)
    }));
  };

  const handleDecrement = (currency) => {
    setPercentageDiscount((prev) => ({
      ...prev,
      [currency]: Math.max(prev[currency] - 1, 0)
    }));
  };

  const handleApply = () => {
    if (mode === 'amount') {
      onApply({ type: 'amount', ...amountDiscount });
    } else {
      onApply({ type: 'percentage', ...percentageDiscount });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="discount-overlay" onClick={onClose}>
      <div className="discount-modal" onClick={(e) => e.stopPropagation()}>
        <div className="discount-tabs">
          <button className={mode === 'amount' ? 'active' : ''} onClick={() => setMode('amount')}>
            Amount
          </button>
          <button className={mode === 'percentage' ? 'active' : ''} onClick={() => setMode('percentage')}>
            Percentage
          </button>
        </div>

        <div className="discount-content">
          {mode === 'amount' ? (
            <div className='discount-amount'> 
              <div>
                <label>LRD Discount</label>
                <input
                  type="number"
                  value={amountDiscount.LRD}
                  onChange={(e) =>
                    setAmountDiscount((prev) => ({ ...prev, LRD: e.target.value }))
                  }
                />  
              </div>
              <div>
                <label>USD Discount</label>
                <input
                  type="number"
                  value={amountDiscount.USD}
                  onChange={(e) =>
                    setAmountDiscount((prev) => ({ ...prev, USD: e.target.value }))
                  }
                />
              </div>
            </div>
          ) : (
            < div className='discount-percent'>
            <div>
                <label>LRD Discount (%)</label>
                <input
                    type="number"
                    value={percentageDiscount.LRD}
                    onChange={(e) =>
                      setPercentageDiscount((prev) => ({ ...prev, LRD: Number(e.target.value) }))
                    }
                  />
                <div className="percentage-control">
                  <button onClick={() => handleDecrement('LRD')}>-</button>
                  <button onClick={() => handleIncrement('LRD')}>+</button>
                </div>
            </div>

                  <div>
                    <label>USD Discount (%)</label>
                    <input
                        type="number"
                        value={percentageDiscount.USD}
                        onChange={(e) =>
                          setPercentageDiscount((prev) => ({ ...prev, USD: Number(e.target.value) }))
                        }
                      />
                    <div className="percentage-control">
                      <button onClick={() => handleDecrement('USD')}>-</button>
                      <button onClick={() => handleIncrement('USD')}>+</button>
                    </div>    
                  </div>
            </div>
          )}
        </div>

        <div className="discount-actions">
          <button onClick={handleApply}>Apply</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
