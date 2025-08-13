import { X, Minus, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import './modal.css';

const methods = ['Cash', 'Orange Money', 'Mobile Money', 'Bank Card'];
const paymentMethods = [
  { value: 'Cash', icon: '/LRD20.jpeg' },
  { value: 'Bank Card', icon: '/visacard.png' },
  { value: 'Orange Money', icon: '/orange.png' },
  { value: 'Mobile Money', icon: '/momo.jpg' },
];


export default function ModalWrapper({ title, onClose, disableClose = false, hideClose = false, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className='modal-header'>
          <h2 className="modal-title">{title}</h2>
          {!hideClose && (
          <button
            onClick={onClose}
            disabled={disableClose}
            className={`modal-close ${disableClose ? 'modal-disabled' : ''}`}
          >
            <X size={16}/>
          </button>
        )}
        
        </div>
        {children}
      </div>
    </div>
  );
}

export function CurrencyPaymentModal({ grandTotal, onClose, onProceed }) {

  const handleProceed = () => {
    const data = {
      id: Date.now(),
      method: 'Cash',
    };
    onProceed(data);
  };

  return (
    <ModalWrapper title="Comfirm Cash Payment" onClose={onClose} >
      <p className='cash-msg'>
      By clicking this Proceed, you confirm that you have recieved {grandTotal} as 
      payment for this sale.
      </p>

      <button onClick={handleProceed} className="modal-btn">
        Proceed
      </button>
    </ModalWrapper>
  );
}

export const EPaymentModal = ({ amount, method, onProceed, onClose }) => (
  <ModalWrapper title={`${method} Payment`} onClose={onClose}>
    <p>Processing {method.toLowerCase()} transaction...</p>
    <div className="payment-amount">Amount: ${parseFloat(amount).toFixed(2)}</div>
    <button onClick={onProceed} className="modal-btn">
      Proceed
    </button>
  </ModalWrapper>
);

export const BankPaymentModal = ({ amount, onProceed, onClose }) => (
  <ModalWrapper title="Bank Payment" onClose={onClose}>
    <p>Please insert or tap card on terminal to proceed</p>
    <div className="payment-amount">Amount: {amount}</div>
    <button onClick={onProceed} className="modal-btn">
      Proceed
    </button>
  </ModalWrapper>
);


// export function StatusModal({ type = 'success', message, onClose }) {
//   const isSuccess = type === 'success';

//   useEffect(() => {
//     const timer = setTimeout(() => onClose(), 1000);
//     return () => clearTimeout(timer);
//   }, [onClose, isSuccess]);

  

//   return (
//     <ModalWrapper title="" onClose={onClose} hideClose={isSuccess}>
//       <div className={`modal-status ${isSuccess ? 'modal-success' : 'modal-error'}`}>
//         <div>
//           {isSuccess ? (
//           <CheckCircle size={48} color="green" />
//         ) : (
//           <XCircle size={20} color="red" />
//         )}
//         <h3>{isSuccess ? 'Success' : 'Error'}</h3>
//         </div>
        
//         <p>{message || (isSuccess ? 'Payment has been processed successfully' : 'Payment failed')}</p>
//       </div>
//     </ModalWrapper>
//   );
// }

export function StatusModal({ type = 'success', message, onClose }) {
  const isSuccess = type === 'success';

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => onClose(), 1000); // auto-close success
      return () => clearTimeout(timer);
    }
  }, [onClose, isSuccess]);

  return (
    <ModalWrapper title="" onClose={onClose} hideClose={isSuccess}>
      <div className={`modal-status ${isSuccess ? 'modal-success' : 'modal-error'}`}>
        <div>
          {isSuccess ? (
            <CheckCircle size={48} color="green" />
          ) : (
            <XCircle size={48} color="red" />
          )}
          <h3>{isSuccess ? 'Success' : 'Error'}</h3>
        </div>
        <p>{message || (isSuccess ? 'Payment has been processed successfully' : 'Payment failed')}</p>
      </div>
    </ModalWrapper>
  );
}


export function PaymentModal({ grandTotal, payments, onUpdatePayments, onClose, onProcess, onSingleMethodSelect }) {
  const [touchedIds, setTouchedIds] = useState(new Set());
  const [addAttempted, setAddAttempted] = useState(false);
  const [processAttempted, setProcessAttempted] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [splitMismatch, setSplitMismatch] = useState(false);

  const anyCompleted = payments.some(p => p.status === 'completed');
  const [closeAttempted, setCloseAttempted] = useState(false);

  const validatePayment = (p) => {
    const methodError = !p.method;
    const amountError = p.amount === '' || isNaN(p.amount) || parseFloat(p.amount) < 1;
    const duplicateError = payments.some(
      other =>
        other.method === p.method &&
        other.id !== p.id &&
        other.status !== 'completed'
    );
    return { methodError, amountError, duplicateError };
  };

  const addPayment = () => {
    setAddAttempted(true);

    const hasInvalid = payments.some(p => {
      const { methodError, amountError } = validatePayment(p);
      return methodError || amountError;
    });

    if (hasInvalid) {
      const invalidIds = payments
        .filter(p => {
          const { methodError, amountError } = validatePayment(p);
          return methodError || amountError;
        })
        .map(p => p.id);
      setTouchedIds(new Set([...touchedIds, ...invalidIds]));
      return;
  }

  // 👇 Clear single selected payment if it's active
  if (selectedPayment) {
    setSelectedPayment('');
  }

  if (payments.length < 5) {
    const newPayment = { id: Date.now(), method: '', amount: '', status: 'pending' };
    onUpdatePayments([...payments, newPayment]);
  }
  };


  const updatePayment = (id, field, value) => {
    const p = payments.find(p => p.id === id);
    if (p?.status === 'completed') return;
    const updated = payments.map(p => (p.id === id ? { ...p, [field]: value } : p));
    onUpdatePayments(updated);
  };

  const handleAmountBlur = (id, value) => {
    const num = parseFloat(value);
    const formatted = isNaN(num) ? '' : num.toFixed(2);
    updatePayment(id, 'amount', formatted);
  };

  const deletePayment = (id) => {
    const p = payments.find(p => p.id === id);
    if (p?.status === 'completed') return;
    const updated = payments.filter(p => p.id !== id);
    onUpdatePayments(updated);
    setTouchedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // const handleProcess = () => {
  //   setProcessAttempted(true);

  //   const validPayments = payments.filter(p => {
  //     const { methodError, amountError, duplicateError } = validatePayment(p);
  //     return !methodError && !amountError && !duplicateError;
  //   });

  //   const pendingValid = validPayments.filter(p => p.status !== 'completed');
  //   if (pendingValid.length === 0) return;

  //   onProcess(pendingValid);
  // };

  const handleProcess = () => {
    setProcessAttempted(true);
    setSplitMismatch(false);

    const validPayments = payments.filter(p => {
      const { methodError, amountError, duplicateError } = validatePayment(p);
      return !methodError && !amountError && !duplicateError;
    });

    const pendingValid = validPayments.filter(p => p.status !== 'completed');
    const totalAmount = validPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    if (pendingValid.length === 0) return false;

    const raw = grandTotal.replace(/[^\d.,]/g, '').replace(',', '');
    const grandTotalNumeric = parseFloat(raw);

    const roundedTotal = parseFloat(totalAmount.toFixed(2));
    const roundedGrand = parseFloat(grandTotalNumeric.toFixed(2));

    if (Math.abs(roundedTotal - roundedGrand) > 0.01) {
      setSplitMismatch(true);
      return false; // 🚫 Prevent closing
    }

    onProcess(pendingValid); // ✅ Success
    return true;
  };



    const validPayments = payments.filter(p => {
      const { methodError, amountError, duplicateError } = validatePayment(p);
      return !methodError && !amountError && !duplicateError;
    });

    const showSingleWarning =
      processAttempted &&
      validPayments.length === 1 &&
      payments.every(p => p.status !== 'completed');

    useEffect(() => {
      // Reset processAttempted when payments change, so warning clears
      if (processAttempted) {
        setProcessAttempted(false);
      }
    }, [payments]);

    const handleClose = () => {
      if (anyCompleted) {
        setCloseAttempted(true);
      } else {
        onClose();
      }
    };
  return (
    <ModalWrapper title="Add Payment" onClose={handleClose} disableClose={false}>
      {closeAttempted && anyCompleted && (
        <p className="split-warning">
          Please completed all payments before exiting.
        </p>
      )}

      <p className="total">
        Total: {grandTotal}
      </p>

      {showSingleWarning && (
        <p className="split-warning">
          If you wish to make a single payment using <strong>{validPayments[0]?.method}</strong>,
          please go to the cart and click the preferred method to proceed.
        </p>
      )}

{splitMismatch && !showSingleWarning && payments.length > 1 &&(
  <p className="split-warning">
    The total of all split payments must exactly match {grandTotal}.
  </p>
)}
      
      <div className="payment-btns">
        {paymentMethods.map(method => (
        <label key={method.value} className="payment-option">
          <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={selectedPayment === method.value}
              disabled={payments.some(p => p.status === 'completed')}
              onChange={() => {
                // 👇 Clear all split payments if they exist
                if (payments.length > 0) {
                  onUpdatePayments([]);
                }
                setSelectedPayment(method.value);
              }}
              style={{ display: 'none' }}
            />
            <span className="custom-radio-btn" />
            <img
              src={method.icon}
              alt={method.value}
            />
        </label>
      ))}
    </div>
    
      <div className="split-list">
        {payments.map((p, i) => {
          const isLocked = p.status === 'completed';
          const { methodError, amountError, duplicateError } = validatePayment(p);
          const showError = addAttempted && touchedIds.has(p.id);

          return (
            <div key={p.id} className="split-entry">
              <div className="split-entry-header">
                <p>
                  <strong>Payment {i + 1}</strong>
                </p>
                
              </div>

              <div className='split-method'>
                <select
                  value={p.method}
                  onChange={(e) => {
                    updatePayment(p.id, 'method', e.target.value);
                    setTouchedIds(new Set([...touchedIds, p.id]));
                  }}
                  disabled={isLocked}
                  className={`split-select ${showError && (methodError || duplicateError) ? 'invalid' : ''}`}
                >
                    <option value="">Select Method</option>
                  {methods.map(m => (
                    <option
                      key={m}
                      value={m}
                      disabled={
                        payments.some(
                          other =>
                            other.method === m &&
                            other.id !== p.id &&
                            other.status !== 'completed'
                        )
                      }
                    >
                      {m}
                    </option>
                  ))}
                </select>
                   <input
                  type="number"
                  placeholder="0.00"
                  value={p.amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val.includes('e') && !val.includes('E')) {
                      updatePayment(p.id, 'amount', val);
                    }
                  }}
                  onFocus={() => {
                    if (p.amount !== '') {
                      updatePayment(p.id, 'amount', '');
                    }
                  }}
                  onBlur={(e) => {
                    handleAmountBlur(p.id, e.target.value);
                    setTouchedIds(new Set([...touchedIds, p.id]));
                  }}
                  disabled={isLocked}
                  className={`split-input ${showError && amountError ? 'invalid' : ''}`}
                />
                {!isLocked && (
                  <button onClick={() => deletePayment(p.id)} className="split-delete">
                    <Minus size={18} />
                  </button>
                )}
        
                {isLocked && <span className="status-completed"> <CheckCircle size={18} /></span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="split-btns">
        {payments.length < 5 && (
          <button onClick={addPayment} className="split-add-btn">
            Split Payment
          </button>
        )}
        <button
          // disabled={!selectedPayment && validPayments.length === 0} uncomment to process all payment methods
          disabled={
            
            (!selectedPayment && validPayments.length === 0) || //remove this when processing all method
            ['Orange Money', 'Mobile Money', 'Bank Card'].includes(selectedPayment)
          }

          onClick={() => {
            if (selectedPayment) {
              onSingleMethodSelect(selectedPayment);
            } else {
              const success = handleProcess();
              if (success) {
              }
            }
          }}

          className="split-process-btn"
        >
          Process Payment
        </button>
      </div>
    </ModalWrapper>
  );
}
