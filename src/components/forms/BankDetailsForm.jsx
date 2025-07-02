import React, { useState } from 'react';
import { saveCard } from '../../services/database';
import './BankDetailsForm.css';

const BankDetailsForm = ({ userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    cardName: '',
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await saveCard(formData, userId);
      setIsLoading(false);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setIsLoading(false);
      setError('Failed to save card details. Please try again.');
      console.error('Error saving card:', err);
    }
  };
  
  return (
    <div className="bank-form-container">
      <h2 className="bank-form-title">Add Bank Details</h2>
      
      {error && <div className="bank-form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bank-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cardName">Card Name</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cardHolderName">Card Holder Name</label>
            <input
              type="text"
              id="cardHolderName"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={19}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              maxLength={5}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="password"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              maxLength={4}
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Card'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankDetailsForm;
