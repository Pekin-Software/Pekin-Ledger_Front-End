import { useState, useContext } from 'react';
import { Package } from 'lucide-react';
import './cart.css';
import { PaymentController } from './PaymentController';
import DiscountModal from './DiscountModal';

Receipt.defaultProps = {
  cartItems: [],
  onQuantityChange: () => {},
  onClearCart: () => {}, 
};

export default function Receipt({ cartItems, onQuantityChange, onClearCart }) {
  const conversionRate = localStorage.getItem('exchange_rate');
  const [selectedCurrency, setselectedCurrency] = useState("LRD");

  const totalUSD = (cartItems || [])
  .filter(item => item.currency === "USD")
  .reduce((acc, item) => acc + item.price * item.quantity, 0);

const totalLRD = (cartItems || [])
  .filter(item => item.currency === "LRD")
  .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const grandTotal =
  selectedCurrency === 'USD'
    ? 'USD$ ' + (totalUSD + totalLRD / conversionRate).toFixed(2)
    : 'LRD$ ' + (totalLRD + totalUSD * conversionRate).toFixed(2) ;


  const isPaymentDisabled = () => totalUSD === 0 && totalLRD === 0;
  const [showDiscount, setShowDiscount] = useState(false);

  const [showSplitModal, setShowSplitModal] = useState(false);
   

  
  const handleApplyDiscount = (data) => {
    console.log("Discount applied:", data);
  };

  return (
    <div className="billing-content">
      <div className="cart">
        {(!cartItems || cartItems.length === 0) ? (
          <div className="empty-cart">
            <Package size={100} />
            <p>No item added</p>
          </div>
        ) : (
          <>
            <button className="empty-cart-btn" onClick={onClearCart}>
               &times;
            </button>

            <table className="order-table">
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Item</th>
                  <th style={{ width: '23%' }}>Quantity</th>
                  <th style={{ width: '22%' }}>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}>-</button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            onQuantityChange(item.id, isNaN(val) || val < 1 ? 1 : val);
                          }}
                        />
                        <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>{item.currency}$ {item.price.toFixed(2)}</td>
                    <td>{item.currency}$ {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </>
        )}
      </div>

      <div className="payment">
          <div className="row">
            <span>Subtotal USD</span>
            <span>$ {totalUSD.toFixed(2)}</span>
          </div>
          <div className="row border-bottom">
            <span>Subtotal LRD</span>
            <span>$ {totalLRD.toFixed(2)}</span>
          </div>

          <div className="row">
            <span>Select Currency</span>
            <div className="currency-box">
              <label className="radio-option"> USD
              <input
                type="radio"
                name="currency"
                value="USD"
                checked={selectedCurrency=== "USD"}
                onChange={(e) => setselectedCurrency(e.target.value)}
              /> <span className="custom-radio" />
              
            </label>
            <label className="radio-option"> LRD
              <input
                type="radio"
                name="currency"
                value="LRD"
                checked={selectedCurrency === "LRD"}
                onChange={(e) => setselectedCurrency(e.target.value)}
              /> <span className="custom-radio" />
              
            </label>
            </div>
          </div>

          <div className="row total">
            <span>Grand Total</span>
            <span>
              {grandTotal}
          </span>
          </div>
          <div className="btn-group">
            <button className="action-btn"
              onClick={() => setShowSplitModal(true)}
              disabled={isPaymentDisabled()}
            >
              Make Payment</button>
          </div>
      </div>

      {/* ✅ Inject payment logic here */}
      {showSplitModal && (
        <PaymentController
          cartItems={cartItems}
          grandTotal={grandTotal}
          selectedCurrency={selectedCurrency}
          onClose={() => {
            setShowSplitModal(false);
          }}
          onClearCart={onClearCart}
        />
      )}

      <DiscountModal
        isOpen={showDiscount}
        onClose={() => setShowDiscount(false)}
        onApply={handleApplyDiscount}
      />
    </div>
  );
}