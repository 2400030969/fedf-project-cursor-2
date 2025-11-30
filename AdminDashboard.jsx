import { useState, useEffect } from 'react';
import { getPortfolios, savePortfolio, deletePortfolio, getFeedback, addFeedback, deleteFeedback } from '../../utils/storage';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = () => {
    const allPortfolios = getPortfolios();
    setPortfolios(allPortfolios);
  };

  const handleViewDetails = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setFeedbackText('');
  };

  const handleCloseDetails = () => {
    setSelectedPortfolio(null);
    setFeedbackText('');
  };

  const handleApprove = (portfolio) => {
    const updatedPortfolio = {
      ...portfolio,
      status: 'approved',
      adminStatus: 'approved'
    };
    savePortfolio(updatedPortfolio);
    loadPortfolios();
    if (selectedPortfolio?.id === portfolio.id) {
      setSelectedPortfolio(updatedPortfolio);
    }
  };

  const handleReject = (portfolio) => {
    const updatedPortfolio = {
      ...portfolio,
      status: 'rejected',
      adminStatus: 'rejected'
    };
    savePortfolio(updatedPortfolio);
    loadPortfolios();
    if (selectedPortfolio?.id === portfolio.id) {
      setSelectedPortfolio(updatedPortfolio);
    }
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedPortfolio) return;

    addFeedback({
      portfolioId: selectedPortfolio.id,
      author: user.name,
      comment: feedbackText,
      type: 'admin'
    });

    setFeedbackText('');
    loadPortfolios();
    if (selectedPortfolio) {
      const updated = getPortfolios().find(p => p.id === selectedPortfolio.id);
      setSelectedPortfolio(updated);
    }
  };

  const handleDeletePortfolio = (portfolio) => {
    if (window.confirm(`Are you sure you want to delete "${portfolio.title}" by ${portfolio.studentName}? This action cannot be undone and will also delete all associated feedback.`)) {
      deletePortfolio(portfolio.id);
      loadPortfolios();
      if (selectedPortfolio?.id === portfolio.id) {
        setSelectedPortfolio(null);
      }
    }
  };

  const handleDeleteFeedback = (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      deleteFeedback(feedbackId);
      loadPortfolios();
      if (selectedPortfolio) {
        const updated = getPortfolios().find(p => p.id === selectedPortfolio.id);
        setSelectedPortfolio(updated);
      }
    }
  };

  const getMilestoneProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return (completed / milestones.length) * 100;
  };

  const filteredPortfolios = filterStatus === 'all' 
    ? portfolios 
    : portfolios.filter(p => p.status === filterStatus || p.adminStatus === filterStatus);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>EduPort - Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="admin-filters">
          <h2>All Student Portfolios</h2>
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="idea">Idea</option>
              <option value="prototype">Prototype</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="portfolios-grid">
          {filteredPortfolios.length === 0 ? (
            <div className="empty-state">
              <p>No portfolios found.</p>
            </div>
          ) : (
            filteredPortfolios.map(portfolio => (
              <div key={portfolio.id} className="portfolio-card">
                <div className="card-header">
                  <h3>{portfolio.title}</h3>
                  <div className="status-group">
                    <span className={`status-badge status-${portfolio.status}`}>
                      {portfolio.status}
                    </span>
                    {portfolio.adminStatus && (
                      <span className={`admin-status admin-${portfolio.adminStatus}`}>
                        {portfolio.adminStatus}
                      </span>
                    )}
                  </div>
                </div>
                <div className="student-info">
                  <strong>Student:</strong> {portfolio.studentName}
                </div>
                <p className="card-description">{portfolio.description}</p>
                
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getMilestoneProgress(portfolio.milestones || [])}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(getMilestoneProgress(portfolio.milestones || []))}% Complete
                  </span>
                </div>

                <div className="card-actions">
                  <button 
                    onClick={() => handleViewDetails(portfolio)} 
                    className="btn-view"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDeletePortfolio(portfolio)} 
                    className="btn-delete"
                    style={{ 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      marginLeft: '10px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedPortfolio && (
          <div className="modal-overlay" onClick={handleCloseDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedPortfolio.title}</h2>
                <button onClick={handleCloseDetails} className="btn-close">×</button>
              </div>
              <div className="modal-body">
                <div className="project-details">
                  <div className="detail-row">
                    <strong>Student:</strong> {selectedPortfolio.studentName}
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong>
                    <span className={`status-badge status-${selectedPortfolio.status}`}>
                      {selectedPortfolio.status}
                    </span>
                    {selectedPortfolio.adminStatus && (
                      <span className={`admin-status admin-${selectedPortfolio.adminStatus}`}>
                        {selectedPortfolio.adminStatus}
                      </span>
                    )}
                  </div>
                  
                  <p><strong>Description:</strong> {selectedPortfolio.description}</p>
                  
                  <div className="milestones-section">
                    <h3>Milestones</h3>
                    <div className="milestones-list">
                      {(selectedPortfolio.milestones || []).map(milestone => (
                        <div key={milestone.id} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                          <span className="milestone-check">{milestone.completed ? '✓' : '○'}</span>
                          <span className="milestone-name">{milestone.name}</span>
                          {milestone.date && (
                            <span className="milestone-date">{new Date(milestone.date).toLocaleDateString()}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="feedback-section">
                    <h3>Feedback</h3>
                    {getFeedback(selectedPortfolio.id).length === 0 ? (
                      <p className="no-feedback">No feedback yet</p>
                    ) : (
                      getFeedback(selectedPortfolio.id).map(fb => (
                        <div key={fb.id} className="feedback-item" style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '10px',
                          marginBottom: '10px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '5px'
                        }}>
                          <div>
                            <p><strong>{fb.author}:</strong> {fb.comment}</p>
                            <span className="feedback-date">{new Date(fb.date).toLocaleDateString()}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteFeedback(fb.id)}
                            className="btn-delete-feedback"
                            style={{ 
                              backgroundColor: '#dc3545', 
                              color: 'white', 
                              border: 'none', 
                              padding: '5px 10px', 
                              borderRadius: '3px', 
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            title="Delete feedback"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                    
                    <form onSubmit={handleSubmitFeedback} className="feedback-form">
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Add your feedback..."
                        rows="3"
                        required
                      />
                      <button type="submit" className="btn-submit-feedback">
                        Add Feedback
                      </button>
                    </form>
                  </div>

                  {selectedPortfolio.media && selectedPortfolio.media.length > 0 && (
                    <div className="media-section">
                      <h3>Media</h3>
                      <div className="media-gallery">
                        {selectedPortfolio.media.map((media, idx) => (
                          <div key={idx} className="media-item">
                            {media.type === 'image' ? (
                              <img src={media.url} alt={`Media ${idx + 1}`} />
                            ) : (
                              <div className="video-placeholder">Video: {media.name}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="admin-actions">
                    <button 
                      onClick={() => handleApprove(selectedPortfolio)}
                      className="btn-approve"
                    >
                      ✓ Approve
                    </button>
                    <button 
                      onClick={() => handleReject(selectedPortfolio)}
                      className="btn-reject"
                    >
                      ✗ Reject
                    </button>
                    <button 
                      onClick={() => handleDeletePortfolio(selectedPortfolio)}
                      className="btn-delete"
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        marginLeft: '10px'
                      }}
                    >
                      🗑️ Delete Portfolio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

