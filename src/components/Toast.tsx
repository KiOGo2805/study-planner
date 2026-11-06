import { useTaskContext } from '../hooks/useTaskContext';

export function Toast() {
  const { toast, tasks, undoDelete } = useTaskContext();
  const deletingTask = tasks.find(t => t.isDeleting);

  if (!toast && !deletingTask) return null;

  return (
    <div className="toast-container" style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      background: 'var(--card-bg)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '1rem', minWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {deletingTask ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>Завдання буде видалено</span>
            <button 
              onClick={() => undoDelete(deletingTask.id)}
              style={{
                padding: '0.25rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)',
                background: 'var(--bg-color)', cursor: 'pointer', fontSize: '0.875rem'
              }}
            >
              Скасувати
            </button>
          </div>
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', background: 'var(--danger)', 
              animation: 'shrink 5s linear forwards' 
            }} />
          </div>
        </div>
      ) : (
        <div style={{ fontWeight: 500, color: toast?.type === 'error' ? 'var(--danger)' : 'var(--text-main)' }}>
          {toast?.message}
        </div>
      )}
    </div>
  );
}