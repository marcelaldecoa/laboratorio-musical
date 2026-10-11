import { type ReactNode, useEffect, useRef } from 'react';

/** Bottom sheet on phones, centered dialog on tablets. */
export function Sheet({ open, onClose, title, children, closeLabel }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; closeLabel: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="sheet"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={title}
    >
      <div className="sheet-inner">
        <div className="sheet-grip" aria-hidden="true" />
        <header className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel}>✕</button>
        </header>
        <div className="sheet-body">{open && children}</div>
      </div>
    </dialog>
  );
}
