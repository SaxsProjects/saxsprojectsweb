import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/** A password box with an eye button that shows or hides what was typed. Takes the same props as <input>. */
export default function PasswordInput({ style, id, ...props }) {
  const [visible, setVisible] = useState(false);
  const label = visible ? 'Hide password' : 'Show password';
  return (
    <div style={{ position: 'relative' }}>
      <input
        {...props}
        id={id}
        type={visible ? 'text' : 'password'}
        spellCheck={false}
        autoCapitalize="off"
        style={{ ...style, paddingRight: '2.9rem', boxSizing: 'border-box' }}
      />
      <button
        type="button"
        aria-label={label}
        aria-pressed={visible}
        aria-controls={id}
        title={label}
        onClick={() => setVisible((v) => !v)}
        style={{
          position: 'absolute', top: '50%', right: '0.35rem', transform: 'translateY(-50%)',
          width: '2.25rem', height: '2.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: 0, borderRadius: '6px', background: 'transparent', color: '#6b7280', cursor: 'pointer', padding: 0,
        }}
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
