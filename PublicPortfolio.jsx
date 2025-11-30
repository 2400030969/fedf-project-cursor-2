import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPortfolioById, getFeedback } from '../../utils/storage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PublicPortfolio.css';

const PublicPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const portfolioData = getPortfolioById(id);
    if (portfolioData) {
      setPortfolio(portfolioData);
    }
    setLoading(false);
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!portfolio) return;

    setDownloading(true);
    try {
      const element = document.getElementById('portfolio-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${portfolio.title || 'portfolio'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const getMilestoneProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return (completed / milestones.length) * 100;
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="portfolio-error">
        <h2>Portfolio not found</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          Go Home
        </button>
      </div>
    );
  }

  const feedback = getFeedback(portfolio.id);

  return (
    <div className="public-portfolio">
      <header className="portfolio-header">
        <div className="header-content">
          <h1>EduPort</h1>
          <div className="header-actions">
            <button onClick={handleDownloadPDF} className="btn-download" disabled={downloading}>
              {downloading ? 'Generating PDF...' : '📥 Download as PDF'}
            </button>
            <button onClick={() => navigate('/')} className="btn-back">
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="portfolio-container">
        <div id="portfolio-content" className="portfolio-content">
          <div className="portfolio-hero">
            <h1 className="portfolio-title">{portfolio.title}</h1>
            <p className="portfolio-student">By {portfolio.studentName}</p>
            <div className="portfolio-status">
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

          <div className="portfolio-section">
            <h2>Description</h2>
            <p className="portfolio-description">{portfolio.description}</p>
          </div>

          <div className="portfolio-section">
            <h2>Progress</h2>
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
          </div>

          <div className="portfolio-section">
            <h2>Timeline</h2>
            <div className="timeline">
              {(portfolio.milestones || []).map((milestone, index) => (
                <div key={milestone.id} className={`timeline-item ${milestone.completed ? 'completed' : ''}`}>
                  <div className="timeline-marker">
                    {milestone.completed ? '✓' : '○'}
                  </div>
                  <div className="timeline-content">
                    <h3>{milestone.name}</h3>
                    {milestone.date && (
                      <p className="timeline-date">
                        {new Date(milestone.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {portfolio.media && portfolio.media.length > 0 && (
            <div className="portfolio-section">
              <h2>Media Gallery</h2>
              <div className="media-gallery">
                {portfolio.media.map((media, idx) => (
                  <div key={idx} className="gallery-item">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.name || `Media ${idx + 1}`} />
                    ) : (
                      <div className="video-placeholder">
                        <span>📹 {media.name || `Video ${idx + 1}`}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedback.length > 0 && (
            <div className="portfolio-section">
              <h2>Feedback</h2>
              <div className="feedback-list">
                {feedback.map(fb => (
                  <div key={fb.id} className="feedback-card">
                    <div className="feedback-header">
                      <strong>{fb.author}</strong>
                      <span className="feedback-date">
                        {new Date(fb.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="feedback-comment">{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="portfolio-footer">
            <p>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</p>
            {portfolio.updatedAt && (
              <p>Last Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;

