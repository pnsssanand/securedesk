import React, { useState, useEffect, useContext } from 'react';
import { FiKey, FiCreditCard, FiFileText, FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiCopy, FiMoreVertical, FiSearch, FiBank } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';
import { getAllPasswords, deletePassword } from '../services/database';
import AddPasswordModal from './AddPasswordModal';
import EditPasswordModal from './EditPasswordModal';
import { useRealTimeItemCounts } from '../hooks/useRealTimeItemCounts';
import './PasswordVault.css';

const PasswordVault = () => {
  const { currentUser } = useContext(AuthContext);
  const { counts, loading: countsLoading } = useRealTimeItemCounts(currentUser?.uid);
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);

  const fetchPasswords = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const userPasswords = await getAllPasswords(currentUser.uid);
      setPasswords(userPasswords);
      setFilteredPasswords(userPasswords);
      setError(null);
    } catch (err) {
      setError('Failed to fetch passwords.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, [currentUser]);

  useEffect(() => {
    const filtered = passwords.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPasswords(filtered);
  }, [searchTerm, passwords]);

  const handleAddPassword = () => {
    setAddModalOpen(true);
  };

  const handleEditPassword = (password) => {
    setSelectedPassword(password);
    setEditModalOpen(true);
  };

  const handleDeletePassword = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await deletePassword(id, currentUser.uid);
        fetchPasswords(); // Refetch passwords after deletion
      } catch (err) {
        setError('Failed to delete password.');
        console.error(err);
      }
    }
  };

  const handlePasswordAdded = () => {
    fetchPasswords(); // Refetch passwords when a new one is added
  };

  const handlePasswordUpdated = () => {
    fetchPasswords(); // Refetch passwords when one is updated
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswordId(prevId => (prevId === id ? null : id));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You might want to show a toast notification here
  };

  return (
    <div className="password-vault-container">
      <div className="dashboard-header">
        <h1>Password Vault</h1>
        <p>Welcome back, {currentUser?.displayName || 'admin'}! <span className="secure-badge">Your data is secure</span></p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card password-card">
          <div className="stat-icon"><FiKey /></div>
          <div className="stat-count">{countsLoading ? '...' : counts.passwords}</div>
          <div className="stat-label">Passwords</div>
        </div>
        <div className="stat-card bank-card">
          <div className="stat-icon"><FiCreditCard /></div>
          <div className="stat-count">{countsLoading ? '...' : counts.bankCards}</div>
          <div className="stat-label">Bank Cards</div>
        </div>
        <div className="stat-card document-card">
          <div className="stat-icon"><FiFileText /></div>
          <div className="stat-count">{countsLoading ? '...' : counts.documents}</div>
          <div className="stat-label">Documents</div>
        </div>
        <div className="stat-card bank-details-card">
          <div className="stat-icon"><FiBank /></div>
          <div className="stat-count">{countsLoading ? '...' : counts.bankDetails}</div>
          <div className="stat-label">Bank Details</div>
        </div>
      </div>

      <div className="passwords-section">
        <div className="passwords-header">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-password-btn" onClick={handleAddPassword}>
            <FiPlus /> Add Password
          </button>
        </div>

        {loading && <p>Loading passwords...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <div className="password-list">
            {filteredPasswords.length > 0 ? (
              filteredPasswords.map(p => (
                <div key={p.id} className="password-item">
                  <div className="password-item-header">
                    <div className="password-title-strength">
                      <span className="password-title">{p.title}</span>
                      <span className={`strength-badge strength-${p.strength}`}>{p.strength}</span>
                    </div>
                    <div className="password-actions">
                      <button onClick={() => handleEditPassword(p)}><FiEdit /></button>
                      <button onClick={() => handleDeletePassword(p.id)}><FiTrash2 /></button>
                    </div>
                  </div>
                  <div className="password-details">
                    <p><strong>Username:</strong> {p.username}</p>
                    <p className="password-field">
                      <strong>Password:</strong> 
                      <span>{visiblePasswordId === p.id ? p.password : '••••••••'}</span>
                      <button onClick={() => togglePasswordVisibility(p.id)}>
                        {visiblePasswordId === p.id ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <button onClick={() => copyToClipboard(p.password)}><FiCopy /></button>
                    </p>
                    <p><strong>URL:</strong> <a href={p.url} target="_blank" rel="noopener noreferrer">{p.url}</a></p>
                    <p className="last-modified">Last modified: {new Date(p.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No passwords found.</p>
            )}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddPasswordModal
          onClose={() => setAddModalOpen(false)}
          onPasswordAdded={handlePasswordAdded}
        />
      )}

      {isEditModalOpen && selectedPassword && (
        <EditPasswordModal
          password={selectedPassword}
          onClose={() => setEditModalOpen(false)}
          onPasswordUpdated={handlePasswordUpdated}
        />
      )}
    </div>
  );
};

export default PasswordVault;
