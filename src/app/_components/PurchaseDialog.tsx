import { CSSProperties } from 'react';

function PurchaseDialog({ isOpen, onClose, children }: any) {
  if (!isOpen) {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const contentStyle: CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative', // for the close button positioning
  };

  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    color: 'black',
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <div style={closeButtonStyle} onClick={onClose}>
          Close
        </div>
        {children}
      </div>
    </div>
  );
}

export default PurchaseDialog;
