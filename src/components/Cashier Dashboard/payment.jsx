import { X, Minus, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import './modal.css';

const methods = ['Cash', 'Orange Money', 'Mobile Money', 'Bank Card'];

export default function ModalWrapper({ title, onClose, disableClose = false, hideClose = false, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {!hideClose && (
          <button
            onClick={onClose}
            disabled={disableClose}
            className={`modal-close ${disableClose ? 'modal-disabled' : ''}`}
          >
            <X />
          </button>
        )}
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function CurrencyPaymentModal({ totalUSD, totalLRD, onClose, onProceed }) {
  const [selectedCurrency, setSelectedCurrency] = useState('LRD');

  const handleCurrencyChange = (currency) => setSelectedCurrency(currency);

  const getAmountDisplay = () => {
    switch (selectedCurrency) {
      case 'LRD':
        return { label: 'LRD$', amount: totalLRD.toFixed(2) };
      case 'USD':
        return { label: 'USD$', amount: totalUSD.toFixed(2) };
      case 'Both':
        return {
          label: `LRD$${(totalLRD / 2).toFixed(2)} + USD$${(totalUSD / 2).toFixed(2)}`,
          amount: null,
        };
      default:
        return { label: '', amount: '' };
    }
  };

  const { label, amount } = getAmountDisplay();

  const handleProceed = () => {
    const data = {
      id: Date.now(),
      method: 'Cash',
      amount:
        selectedCurrency === 'Both'
          ? totalUSD
          : selectedCurrency === 'USD'
          ? totalUSD
          : totalLRD,
      currency: selectedCurrency === 'Both' ? 'LRD & USD' : selectedCurrency + '$ ',
    };
    onProceed(data);
  };

  return (
    <ModalWrapper title="Currency Payment" onClose={onClose}>
      <p>Select the currency for this cash payment:</p>
      <div className="currency-options">
        {['USD', 'LRD', 'Both'].map((c) => (
          <label key={c}>
            <input
              type="checkbox"
              checked={selectedCurrency === c}
              onChange={() => handleCurrencyChange(c)}
            />
            {c}
          </label>
        ))}
      </div>

      <div className="currency-summary">
        {label} {amount && <span>{amount}</span>}
      </div>

      <button disabled={!selectedCurrency} onClick={handleProceed} className="modal-btn">
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

export function SuccessModal({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 1000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ModalWrapper title="" onClose={onClose} hideClose={true}>
      <div className="modal-success">
        <CheckCircle size={48} color="green" />
        <h3>Success</h3>
        <p>Payment has been processed successfully</p>
      </div>
    </ModalWrapper>
  );
}

export function SplitPaymentModal({ totalUSD, totalLRD, payments, onUpdatePayments, onClose, onProcess }) {
  const [touchedIds, setTouchedIds] = useState(new Set());
  const [addAttempted, setAddAttempted] = useState(false);
  const [processAttempted, setProcessAttempted] = useState(false);

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

  const handleProcess = () => {
    setProcessAttempted(true);

    const validPayments = payments.filter(p => {
      const { methodError, amountError, duplicateError } = validatePayment(p);
      return !methodError && !amountError && !duplicateError;
    });

    const pendingValid = validPayments.filter(p => p.status !== 'completed');
    if (pendingValid.length === 0) return;

    onProcess(pendingValid);
  };

  const validPayments = payments.filter(p => {
    const { methodError, amountError, duplicateError } = validatePayment(p);
    return !methodError && !amountError && !duplicateError;
  });

  const showSingleWarning =
    processAttempted &&
    validPayments.length === 1 &&
    payments.every(p => p.status !== 'completed');

  const handleClose = () => {
  if (anyCompleted) {
    setCloseAttempted(true);
  } else {
    onClose();
  }
};
  return (
    <ModalWrapper title="Split Payment" onClose={handleClose} disableClose={false}>
      {closeAttempted && anyCompleted && (
        <p className="split-warning">
          Please completed all payments before exiting.
        </p>
      )}

      <p className="split-total">
        Total: LRD${totalLRD.toFixed(2)} | USD${totalUSD.toFixed(2)}
      </p>

      

      {showSingleWarning && (
        <p className="split-warning">
          If you wish to make a single payment using <strong>{validPayments[0]?.method}</strong>,
          please go to the cart and click the preferred method to proceed.
        </p>
      )}

      <div className="split-list">
        {payments.map((p, i) => {
          const isLocked = p.status === 'completed';
          const { methodError, amountError, duplicateError } = validatePayment(p);
          const showError = addAttempted && touchedIds.has(p.id);

          return (
            <div key={p.id} className="split-entry">
              <div className="split-entry-header">
                <span>
                  <strong>Payment {i + 1}</strong>
                </span>
                
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

                {/* {showError && duplicateError && (
                  <p className="split-error">Payment Method already exists</p>
                )}
                {showError && methodError && (
                  <p className="split-error">Choose payment method</p>
                )} */}
              </div>

              <div className='split-inputs'>
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
                {/* {showError && amountError && (
                  <p className="split-error">Amount must be ≥ 1.00</p>
                )} */}
              </div>

              {!isLocked && (
                  <button onClick={() => deletePayment(p.id)} className="split-delete">
                    <Minus size={18} />
                  </button>
                )}
                {isLocked && <span className="status-completed"> <CheckCircle size={18} /></span>}
            </div>
          );
        })}
      </div>

      <div className="split-btns">
        {payments.length < 5 && (
          <button onClick={addPayment} className="split-add-btn">
            Add Payment
          </button>
        )}
        <button
          onClick={handleProcess}
          className="split-process-btn"
          disabled={validPayments.length === 0}
        >
          Process Payment
        </button>
      </div>
    </ModalWrapper>
  );
}
