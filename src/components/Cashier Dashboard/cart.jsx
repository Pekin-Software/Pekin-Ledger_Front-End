import { useState } from 'react';
import { Package } from 'lucide-react';
import './cart.css';
import { PaymentController } from './PaymentController';
import DiscountModal from './DiscountModal';

Receipt.defaultProps = {
  cartItems: [],
  onQuantityChange: () => {},
  onClearCart: () => {}, 
};

const LRD = "/LRD.jpg";
const mobilemoney = "/momo.jpg";
const orangemoney = "/orange.png";
const visa = "/visacard.png";

export default function Receipt({ cartItems, onQuantityChange, onClearCart }) {
  const totalUSD = (cartItems || []).reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalLRD = totalUSD * 100;
  const [singleMethod, setSingleMethod] = useState(null);
  const isPaymentDisabled = () => totalUSD === 0 || totalLRD === 0;
  const [showDiscount, setShowDiscount] = useState(false);

  const [showSplitModal, setShowSplitModal] = useState(false);
   
  
  const handleApplyDiscount = (data) => {
    console.log("Discount applied:", data);
  };

  return (
    <div className="billing-content">
      <div className="cart">
        <h2>Order No: #12345</h2> 

        {(!cartItems || cartItems.length === 0) ? (
          <div className="empty-cart">
            <Package size={100} />
            <p>No item added</p>
          </div>
        ) : (
          <>
            <button className="empty-cart-btn" onClick={onClearCart}>
              Empty Cart
            </button>

            <table className="order-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Item</th>
                  <th style={{ width: '23%' }}>Quantity</th>
                  <th style={{ paddingLeft: '2px' }}>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
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
                    <td style={{ paddingLeft: '2px' }}>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="payment">
        <div className="payment-summary">
          <div className="row">
            <span>Discount</span>
            <span>N/A</span>
          </div>
          <div className="row">
            <span>Subtotal USD</span>
            <span>${totalUSD.toFixed(2)}</span>
          </div>
          <div className="row border-bottom">
            <span>Subtotal LRD</span>
            <span>${totalLRD.toFixed(2)}</span>
          </div>
          <div className="row total">
            <span>Total USD</span>
            <span>${totalUSD.toFixed(2)}</span>
          </div>
          <div className="row total">
            <span>Total LRD</span>
            <span>${totalLRD.toFixed(2)}</span>
          </div>
          <div className="btn-group">
            <button className="action-btn"
              onClick={() => setShowDiscount(true)}
            >
              Discount</button>
            <button className="action-btn" 
              onClick={() => setShowSplitModal(true)}
              disabled={isPaymentDisabled()}
            >
              Split Payment
            </button>
          </div>
        </div>

        <div className="payment-methods">
          <p>Payment Method</p>
          <div className='payment-btn'>
           <div>
             <button className='cash' 
              onClick={() => setSingleMethod('Cash')}
              disabled={isPaymentDisabled()}
            ><img src={LRD} alt="LRD" />
            </button>
           </div>
           <div><button><img src={mobilemoney} alt="Momo"/></button></div>
           <div><button><img src={orangemoney} alt="Orange Money" /></button></div>
      
           <div>
            <button><img src={visa} alt="Visa" /></button>
           </div>
          </div>
        </div>
      </div>

      {/* ✅ Inject payment logic here */}
      {(showSplitModal || singleMethod) && (
        <PaymentController
          cartItems={cartItems}
          totalUSD={totalUSD}
          totalLRD={totalLRD}
          method={singleMethod}
          onClose={() => {
            setShowSplitModal(false);
            setSingleMethod(null);
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
