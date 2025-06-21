import React from 'react';
import './authentication.css';
import { LogOut } from 'lucide-react';

const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <LogOut className="modal-icon" />
        <p className="modal-text">Are you sure you want to sign out?</p>
        <div className="modal-buttons">
          <button className="btn no-btn" onClick={onClose}>No</button>
          <button className="btn yes-btn" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
