import React, { useEffect } from "react";
import { CheckCircle, X, XCircle, Loader2 } from "lucide-react";
import "./submissionModal.css"; // styling assumed

export default function SubmissionModal({ status, message, count, onClose }) {
  // Auto-close on success after 5s
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div className="submission-modal-backdrop">
      <div className="submission-modal">
        {status === "loading" && (
          <div className="modal-content loading">
            <Loader2 size={30} className="loader spinning" />
            <p>Sending products...</p>
          </div>
        )}

        {status === "success" && (
          <div className="modal-content success">
            <CheckCircle size={48} color="green" />
            <p>
              {count === 1
                ? "1 product sent successfully!"
                : `${count} products sent successfully!`}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="modal-content error">
            <button className="modal-exit" onClick={onClose}>
              <X size={14} />
            </button>
            <XCircle size={20} color="red" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
