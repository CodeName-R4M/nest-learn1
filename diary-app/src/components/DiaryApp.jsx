import { useState, useEffect } from 'react';
import { getDiaryEntries } from '../api';
import DiaryEntry from './DiaryEntry';
import NewEntryForm from './NewEntryForm';
import ProfileDropdown from './ProfileDropdown';
import './DiaryApp.css';

function DiaryApp({ user, onLogout }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await getDiaryEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      alert('Failed to load diary entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleNewEntry = () => {
    setShowNewEntry(true);
  };

  const handleEntryCreated = () => {
    setShowNewEntry(false);
    fetchEntries();
  };

  const handleEntryDeleted = () => {
    fetchEntries();
  };

  return (
    <div className="diary-app">
      <header className="diary-header">
        <div className="header-content">
          <h1 className="diary-title">📖 My Personal Diary</h1>
          <div className="user-info">
            <span className="user-name">{user.displayName}</span>
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>

      <main className="diary-main">
        <div className="diary-container">
          <div className="diary-actions">
            <button onClick={handleNewEntry} className="new-entry-btn">
              ✍️ Write Today's Entry
            </button>
          </div>

          {showNewEntry && (
            <NewEntryForm 
              onClose={() => setShowNewEntry(false)}
              onEntryCreated={handleEntryCreated}
            />
          )}

          {loading ? (
            <div className="loading-entries">
              <div className="loading-spinner"></div>
              <p>Loading your diary...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="no-entries">
              <p className="no-entries-icon">📝</p>
              <p className="no-entries-text">No entries yet</p>
              <p className="no-entries-subtext">Start writing your first diary entry!</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map((entry) => (
                <DiaryEntry 
                  key={entry.id} 
                  entry={entry}
                  onDeleted={handleEntryDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DiaryApp;

