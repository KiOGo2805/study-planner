import { useTaskContext } from '../hooks/useTaskContext';

export function Toast() {
  const { toast, tasks, undoDelete } = useTaskContext();
  const deletingTasks = tasks.filter(task => task.isDeleting);

  if (!toast && deletingTasks.length === 0) return null;

  return (
    <div className="toast-container" style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
      minWidth: '300px', maxWidth: 'min(420px, calc(100vw - 48px))',
      pointerEvents: 'none',
    }}>
      {deletingTasks.map(task => (
        <div key={task.id} style={{
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 500 }}>
              «{task.title}» буде видалено
            </span>
            <button 
              onClick={() => undoDelete(task.id)}
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
      ))}
      {toast && (
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', pointerEvents: 'auto',
          fontWeight: 500, color: toast.type === 'error' ? 'var(--danger)' : 'var(--text-main)',
        }}>
          {toast?.message}
        </div>
      )}
    </div>
  );
}