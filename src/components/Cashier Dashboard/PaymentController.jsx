
import { useState, useEffect } from 'react';
import {
  CurrencyPaymentModal,
  EPaymentModal,
  BankPaymentModal,
  SuccessModal,
  SplitPaymentModal,
} from './payment';

import usePrintReceipt from '../../utils/reciept';

export function PaymentController({  cartItems, totalUSD, totalLRD, onClose, method, onClearCart, showSuccessModal }) {
    
    const printReceipt = usePrintReceipt();

    const [queue, setQueue] = useState([]); // All payments with status
    const [current, setCurrent] = useState(null);
    const [showSplit, setShowSplit] = useState(true);
    const [showIntermediateSuccess, setShowIntermediateSuccess] = useState(false);
    const [queueDone, setQueueDone] = useState(false);
    const [finalSuccess, setFinalSuccess] = useState(false);
    const [isSinglePayment, setIsSinglePayment] = useState(false);

    const resetState = () => {
        setQueue([]);
        setCurrent(null);
        setShowSplit(true);
        setShowIntermediateSuccess(false);
        setQueueDone(false);
        setFinalSuccess(false);
        setIsSinglePayment(false);
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
        amount: totalUSD,
        currency: 'USD$ ',
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

        // Remove any duplicate pending payments by ID
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
        setFinalSuccess(true);
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

    return (
        <>
            {showSplit && (
                <SplitPaymentModal
                totalUSD={totalUSD}
                totalLRD={totalLRD}
                payments={queue}
                onUpdatePayments={handleUpdateQueue}
                onClose={onClose}
                onProcess={handleSplitProcess}
                />
            )}

            {current?.type === 'cash' && (
                <CurrencyPaymentModal
                totalUSD={totalUSD}
                totalLRD={totalLRD}
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

            {showIntermediateSuccess && <SuccessModal onClose={() => {}} />}
            {finalSuccess && <SuccessModal onClose={handleFinalSuccessClose} />}
        </>
    );
}
