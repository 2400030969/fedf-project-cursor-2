import { useState, useEffect } from 'react';
import './PortfolioForm.css';

const PortfolioForm = ({ portfolio, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idea');
  const [milestones, setMilestones] = useState([
    { id: '1', name: 'Idea', completed: false, date: null },
    { id: '2', name: 'Prototype', completed: false, date: null },
    { id: '3', name: 'Testing', completed: false, date: null },
    { id: '4', name: 'Completed', completed: false, date: null }
  ]);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (portfolio) {
      setTitle(portfolio.title || '');
      setDescription(portfolio.description || '');
      setStatus(portfolio.status || 'idea');
      setMilestones(portfolio.milestones || milestones);
      setMedia(portfolio.media || []);
    }
  }, [portfolio]);

  const handleMilestoneToggle = (milestoneId) => {
    setMilestones(milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          completed: !m.completed,
          date: !m.completed ? new Date().toISOString() : null
        };
      }
      return m;
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMedia = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: event.target.result,
          file: file
        };
        setMedia([...media, newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (mediaId) => {
    setMedia(media.filter(m => m.id !== mediaId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const portfolioData = {
      id: portfolio?.id,
      title,
      description,
      status,
      milestones,
      media: media.map(m => ({ name: m.name, type: m.type, url: m.url }))
    };
    onSave(portfolioData);
  };

  return (
    <div className="portfolio-form-container">
      <form onSubmit={handleSubmit} className="portfolio-form">
        <h2>{portfolio ? 'Edit Project' : 'Create New Project'}</h2>
        
        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter project title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            placeholder="Describe your project"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="idea">Idea</option>
            <option value="prototype">Prototype</option>
            <option value="testing">Testing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Milestones</label>
          <div className="milestones-editor">
            {milestones.map(milestone => (
              <div key={milestone.id} className="milestone-editor-item">
                <label className="milestone-checkbox">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => handleMilestoneToggle(milestone.id)}
                  />
                  <span>{milestone.name}</span>
                </label>
                {milestone.completed && milestone.date && (
                  <span className="milestone-date-badge">
                    {new Date(milestone.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Upload Media (Images/Videos)</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="file-input"
          />
          {media.length > 0 && (
            <div className="media-preview">
              {media.map((item, idx) => (
                <div key={item.id || idx} className="media-preview-item">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.name} />
                  ) : (
                    <div className="video-preview">
                      <span>📹 {item.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(item.id)}
                    className="btn-remove-media"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save">
            {portfolio ? 'Update' : 'Create'} Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioForm;

