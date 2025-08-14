
import { useState, useEffect } from 'react';
import {
  CurrencyPaymentModal,
  EPaymentModal,
  BankPaymentModal,
  StatusModal,
  PaymentModal,
} from './payment';
import { useContext } from "react";
import { UserContext } from '../../contexts/UserContext';
import usePrintReceipt from '../../utils/reciept';

export function PaymentController({  cartItems, selectedCurrency, totalLRD, totalUSD, grandTotal, onClose, method, onClearCart,
                                     showStatusModal}) {
      const { userData } = useContext(UserContext);
  const storeId = userData?.store_id;
    const printReceipt = usePrintReceipt();

    const [queue, setQueue] = useState([]); // All payments with status
    const [current, setCurrent] = useState(null);
    const [showSplit, setShowSplit] = useState(true);
    const [showIntermediateSuccess, setShowIntermediateSuccess] = useState(false);
    const [queueDone, setQueueDone] = useState(false);
    const [finalSuccess, setFinalSuccess] = useState(false);
    const [isSinglePayment, setIsSinglePayment] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [error, setError] = useState(null); // To handle submission errors
    const [submitting, setSubmitting] = useState(false);  

    const resetState = () => {
        setQueue([]);
        setCurrent(null);
        setShowSplit(true);
        setShowIntermediateSuccess(false);
        setQueueDone(false);
        setFinalSuccess(false);
        setIsSinglePayment(false);
        setError(null);
        setSubmitting(false);
    };

 useEffect(() => {
        if (finalSuccess) {
            printReceipt(cartItems, totalUSD, totalLRD, onClearCart);
        }
    }, [finalSuccess]);

    const startSinglePayment = (method) => {
        setIsSinglePayment(true); // Mark as single payment
        const methodMap = {
        'Cash': 'cash',
        'Bank Card': 'bank',
        'Orange Money': 'epayment',
        'Mobile Money': 'epayment',
        };

        const type = methodMap[method] || 'unknown';

        const singlePayment = {
        id: Date.now(),
        method,
        amount: grandTotal,
        currency: selectedCurrency,
        status: 'pending',
        };

        setQueue([singlePayment]);
        setShowSplit(false);
        setQueueDone(false);
        setShowIntermediateSuccess(false);
        setFinalSuccess(false);
        setCurrent({ type, data: singlePayment });
    };

    useEffect(() => {
        if (method) {
        startSinglePayment(method);
        }
    }, [method]);

    const handleSplitProcess = (pendingPayments) => {
        setQueue(prevQueue => {
        const completed = prevQueue.filter(p => p.status === 'completed');

        const updatedPending = pendingPayments.map(p => {
        const existing = prevQueue.find(prev => prev.id === p.id);
        return {
            ...p,
            id: p.id || Date.now() + Math.random(),
            status: existing?.status === 'completed' ? 'completed' : 'pending',
        };
        });

        const deduped = updatedPending.filter(
            up => !completed.some(c => c.id === up.id)
        );

        return [...completed, ...deduped];
    });

    setShowSplit(false);
    setCurrent(null);
    };

    const proceedToNext = () => {
        const next = queue.find((p) => p.status === 'pending');

        if (next) {
        let type;
        switch (next.method) {
            case 'Cash':
            type = 'cash';
            break;
            case 'Bank Card':
            type = 'bank';
            break;
            case 'Orange Money':
            case 'Mobile Money':
            type = 'epayment';
            break;
            default:
            type = 'unknown';
        }

        setCurrent({ type, data: next });
        } else {
        setQueueDone(true);
        }
    };

    const handleComplete = () => {
        if (current) {
        const updated = queue.map((p) =>
            p.id === current.data.id ? { ...p, status: 'completed' } : p
        );
        setQueue(updated);
        setCurrent(null);
        setShowIntermediateSuccess(true);
        }
    };

    const handleReturnToSplit = () => {
        if (isSinglePayment) {
            onClose();
        } else {
            setCurrent(null);
            setShowSplit(true);
        }
    };

    useEffect(() => {
        if (showIntermediateSuccess) {
        const timer = setTimeout(() => {
            setShowIntermediateSuccess(false);
            proceedToNext();
        }, 1000);

        return () => clearTimeout(timer);
        }
    }, [showIntermediateSuccess]);

    useEffect(() => {
        if (finalSuccess) {
        const timer = setTimeout(() => {
            handleFinalSuccessClose();
        }, 1000);
        return () => clearTimeout(timer);
        }
    }, [finalSuccess]);

    useEffect(() => {
        if (!showSplit && !showIntermediateSuccess && !current && !queueDone) {
        proceedToNext();
        }
    }, [queue, current, showSplit, showIntermediateSuccess, queueDone]);

    const handleFinalSuccessClose = () => {
        resetState();
        onClearCart();
        onClose();
    };

    const handleUpdateQueue = (updatedPayments) => {
        setQueue(updatedPayments);
    };

    const submitSale = async (payload) => {
    const access_token = Cookies.get('access_token');
    const tenantDomain = Cookies.get('tenant')
    const url = `https://${tenantDomain}/api/sales/sale/`

    try {
        // const response = await fetch(
        // 'http://testing022.client1.localhost:8000/api/sales/sale/',
        // {
        const response = await fetch(url,
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`, // Add token here
            },
            body: JSON.stringify(payload),
            credentials: 'include',
        }
        );

        if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Network response was not ok');
        }

        return response.json();
    } catch (err) {
        throw new Error(err.message || 'Sale submission failed');
    }
    };

const submitPaymentData = async () => {
  setSubmitting(true);
  setError(null);

  try {
    const currency = selectedCurrency;

    // Build products array
    const products = cartItems.map(item => ({
      product_id: item.product_id,
      quantity_sold: item.quantity,
      variant_id: item.id,
    }));

    // Build payments array
    const payments = queue.map(p => ({
      method: p.method,
      amount: parseFloat(
        p.amount.toString().replace(/[^0-9.-]+/g, '') 
        ),
      currency,
    }));

    const payload = {
      store_id:Number(storeId),
      currency,
      products,
      payments,
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    const response = await submitSale(payload);

    if (response.success) {
      setFinalSuccess(true);
    } else {
      setError(response.message || 'Payment failed');
      setShowErrorModal(true);
      setFinalSuccess(false);
    }
  } catch (err) {
    setError(err.message || 'Payment submission failed');
    setShowErrorModal(true);
    setFinalSuccess(false);
  } finally {
    setSubmitting(false);
  }
};


    useEffect(() => {
        if (queueDone) {
            submitPaymentData();
        }
        }, [queueDone]);


    return (
        <>
            {showSplit && (
                <PaymentModal
                grandTotal={grandTotal}
                payments={queue}
                onUpdatePayments={handleUpdateQueue}
                onClose={onClose}
                onProcess={handleSplitProcess}
                onSingleMethodSelect={startSinglePayment}
                />
            )}

            {current?.type === 'cash' && (
                <CurrencyPaymentModal
                grandTotal={grandTotal}
                onClose={handleReturnToSplit}
                onProceed={handleComplete}
                />
            )}

            {current?.type === 'bank' && (
                <BankPaymentModal
                amount={parseFloat(current.data.amount)}
                onProceed={handleComplete}
                onClose={handleReturnToSplit}
                />
            )}

            {current?.type === 'epayment' && (
                <EPaymentModal
                amount={parseFloat(current.data.amount)}
                method={current.data.method}
                onProceed={handleComplete}
                onClose={handleReturnToSplit}
                />
            )}

         

            {finalSuccess && (
                <StatusModal type="success" message="Sale completed" onClose={handleFinalSuccessClose} />
            )}

            {error && (
                <StatusModal type="error" message={error} onClose={() => {setShowErrorModal(false); setError(null); resetState(); }} />
            )}

        </>
    );
}
