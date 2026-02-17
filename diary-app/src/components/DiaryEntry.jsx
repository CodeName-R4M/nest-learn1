import { useState, useEffect } from 'react';
import { deleteDiaryEntry } from '../api';  // Removed unused getImageUrl
import './DiaryEntry.css';

function DiaryEntry({ entry, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  // Log when component mounts + what data it received
  useEffect(() => {
    console.log("[DiaryEntry] Component mounted - received entry:", {
      id: entry.id,
      hasTitle: !!entry.title,
      titlePreview: entry.title?.substring(0, 50) || null,
      hasImage: !!entry.imageUrl,
      imageUrl: entry.imageUrl || null,  // Log the actual URL to verify
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      contentLength: entry.content?.length || 0,
    });
  }, [entry]);

  const formatDate = (dateString) => {
    if (!dateString) {
      console.warn("[DiaryEntry] formatDate received invalid date:", dateString);
      return "Invalid date";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("[DiaryEntry] Invalid date parsed:", dateString);
      return "Invalid date";
    }

    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    console.log("[DiaryEntry] Formatted date:", { input: dateString, output: formatted });
    return formatted;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) {
      console.log("[DiaryEntry] Delete cancelled by user");
      return;
    }

    console.log("[DiaryEntry] Delete confirmed - starting deletion", { entryId: entry.id });
    setDeleting(true);

    try {
      await deleteDiaryEntry(entry.id);
      console.log("[DiaryEntry] Delete successful", { entryId: entry.id });
      onDeleted();
    } catch (error) {
      console.error("[DiaryEntry] Delete failed:", {
        message: error.message,
        stack: error.stack?.split('\n')[0],  // Short stack trace
        entryId: entry.id,
      });
      alert('Failed to delete entry. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const API_URL = "https://diary-back.vercel.app";
  // Optional: log API_URL once for context
  useEffect(() => {
    console.log("[DiaryEntry] Using API_URL:", API_URL);
  }, [API_URL]);

  return (
    <div className="diary-entry">
      <div className="entry-header">
        <div className="entry-date">
          📅 {formatDate(entry.createdAt)}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="delete-btn"
          title="Delete entry"
        >
          {deleting ? '⏳ Deleting...' : '🗑️'}
        </button>
      </div>

      {entry.title && (
        <h3 className="entry-title">{entry.title}</h3>
      )}

      {entry.imageUrl && (
        <div className="entry-image">
          <img
            src={entry.imageUrl}
            alt={entry.title ? `Image for diary entry: ${entry.title}` : "Diary entry image"}
            loading="lazy"
            onLoad={() => {
              console.log("[DiaryEntry] Image loaded successfully:", entry.imageUrl);
            }}
            onError={(e) => {
              console.error("[DiaryEntry] Image failed to load:", {
                url: entry.imageUrl,
                errorEvent: e.type,
              });
              e.target.src = "/fallback-image.jpg"; // or "https://placehold.co/600x400?text=Image+Not+Found"
              e.target.alt = "Failed to load image";
            }}
          />
        </div>
      )}

      <div className="entry-content">
        {entry.content}
      </div>

      <div className="entry-footer">
        <span className="entry-time">
          Last updated: {formatDate(entry.updatedAt)}
        </span>
      </div>
    </div>
  );
}

export default DiaryEntry;