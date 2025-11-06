import './PortfolioCard.css';

const PortfolioCard = ({ portfolio, onEdit, onViewDetails, progress }) => {
  return (
    <div className="portfolio-card">
      <div className="card-header">
        <h3>{portfolio.title}</h3>
        <span className={`status-badge status-${portfolio.status}`}>
          {portfolio.status}
        </span>
      </div>
      <p className="card-description">{portfolio.description}</p>
      
      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progress)}% Complete</span>
      </div>

      <div className="card-actions">
        <button onClick={() => onViewDetails(portfolio)} className="btn-view">
          View Details
        </button>
        <button onClick={() => onEdit(portfolio)} className="btn-edit">
          Edit
        </button>
      </div>
    </div>
  );
};

export default PortfolioCard;

