import { useState, useEffect } from 'react';
import { getPortfoliosByStudentId, savePortfolio, getFeedback, addFeedback } from '../../utils/storage';
import PortfolioForm from './PortfolioForm';
import PortfolioCard from './PortfolioCard';
import './StudentDashboard.css';

const StudentDashboard = ({ user, onLogout }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = () => {
    const studentPortfolios = getPortfoliosByStudentId(user.id);
    setPortfolios(studentPortfolios);
  };

  const handleSavePortfolio = (portfolioData) => {
    const portfolio = {
      ...portfolioData,
      studentId: user.id,
      studentName: user.name
    };
    savePortfolio(portfolio);
    loadPortfolios();
    setShowForm(false);
    setEditingPortfolio(null);
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setShowForm(true);
  };

  const handleViewDetails = (portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const handleCloseDetails = () => {
    setSelectedPortfolio(null);
  };

  const getMilestoneProgress = (milestones) => {
    const completed = milestones.filter(m => m.completed).length;
    return (completed / milestones.length) * 100;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>EduPort - Student Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button 
            onClick={() => { setShowForm(true); setEditingPortfolio(null); }} 
            className="btn-add"
          >
            + Add New Project
          </button>
        </div>

        {showForm && (
          <PortfolioForm
            portfolio={editingPortfolio}
            onSave={handleSavePortfolio}
            onCancel={() => { setShowForm(false); setEditingPortfolio(null); }}
          />
        )}

        <div className="portfolios-grid">
          {portfolios.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet. Create your first project!</p>
            </div>
          ) : (
            portfolios.map(portfolio => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                progress={getMilestoneProgress(portfolio.milestones || [])}
              />
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
                  <p><strong>Description:</strong> {selectedPortfolio.description}</p>
                  <p><strong>Status:</strong> <span className={`status-badge status-${selectedPortfolio.status}`}>{selectedPortfolio.status}</span></p>
                  
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
                        <div key={fb.id} className="feedback-item">
                          <p><strong>{fb.author}:</strong> {fb.comment}</p>
                          <span className="feedback-date">{new Date(fb.date).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

