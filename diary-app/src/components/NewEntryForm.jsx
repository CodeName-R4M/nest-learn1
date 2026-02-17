import { useState } from 'react';
import { createDiaryEntry } from '../api';
import './NewEntryForm.css';

function NewEntryForm({ onClose, onEntryCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please write something in your diary!');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (title.trim()) {
        formData.append('title', title);
      }
      if (image) {
        formData.append('image', image);
        console.log('[NewEntryForm] Submitting form with image:', {
          fileName: image.name,
          fileSize: image.size,
          fileType: image.type,
          formDataHasImage: formData.has('image'),
        });
      } else {
        console.log('[NewEntryForm] Submitting form without image');
      }

      const result = await createDiaryEntry(formData);
      console.log('[NewEntryForm] Entry created successfully:', result);
      onEntryCreated();
    } catch (error) {
      console.error('[NewEntryForm] Error creating entry:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      alert('Failed to create diary entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-entry-overlay">
      <div className="new-entry-form">
        <div className="form-header">
          <h2>✍️ What happened today?</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title (Optional)</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your day a title..."
              className="title-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">What happened today? *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear Diary,&#10;&#10;Today was..."
              className="content-textarea"
              rows="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Add a photo (Optional)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="remove-image-btn"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? 'Saving...' : '💾 Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewEntryForm;

