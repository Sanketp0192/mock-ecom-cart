import React from 'react'

function Receipt({ receipt, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="receipt-header">
          <h2>🎉 Order Confirmed!</h2>
          <p>Thank you for your purchase</p>
        </div>
        
        <div className="receipt-details">
          <div className="receipt-row">
            <span>Receipt ID:</span>
            <span>{receipt.receiptId}</span>
          </div>
          <div className="receipt-row">
            <span>Order Total:</span>
            <span>${receipt.total}</span>
          </div>
          <div className="receipt-row">
            <span>Order Date:</span>
            <span>{new Date(receipt.timestamp).toLocaleDateString()}</span>
          </div>
          <div className="receipt-row">
            <span>Order Time:</span>
            <span>{new Date(receipt.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="receipt-total">
          <span>Total Paid:</span>
          <span>${receipt.total}</span>
        </div>

        <button className="close-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default Receipt