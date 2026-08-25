import { useState } from 'react';

let pushFn = null;

export function toast(msg, type = 'info') {
  if (pushFn) pushFn(msg, type);
}

export function ToastHost() {
  const [items, setItems] = useState([]);

  pushFn = (msg, type) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 3200);
  };

  return (
    <>
      {items.map((i) => (
        <div key={i.id} className={`toast ${i.type}`}>
          {i.msg}
        </div>
      ))}
    </>
  );
}
