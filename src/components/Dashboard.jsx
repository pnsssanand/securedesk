import React, { useContext } from 'react';
import { useRealTimeItemCounts } from '../hooks/useRealTimeItemCounts';
import { AuthContext } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { counts, loading } = useRealTimeItemCounts(currentUser?.uid);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Password Vault</h1>
        <p>Welcome back, {currentUser?.displayName || 'admin'}! <span className="secure-badge">Your data is secure</span></p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card password-card">
          <div className="stat-icon">🔑</div>
          <div className="stat-count">{loading ? '...' : counts.passwords}</div>
          <div className="stat-label">Passwords</div>
        </div>
        
        <div className="stat-card bank-card">
          <div className="stat-icon">💳</div>
          <div className="stat-count">{loading ? '...' : counts.bankCards}</div>
          <div className="stat-label">Bank Cards</div>
        </div>
        
        <div className="stat-card document-card">
          <div className="stat-icon">📄</div>
          <div className="stat-count">{loading ? '...' : counts.documents}</div>
          <div className="stat-label">Documents</div>
        </div>
        
        <div className="stat-card bank-details-card">
          <div className="stat-icon">🏦</div>
          <div className="stat-count">{loading ? '...' : counts.bankDetails}</div>
          <div className="stat-label">Bank Details</div>
        </div>
      </div>
      
      {/* Rest of dashboard content */}
    </div>
  );
};

export default Dashboard;
