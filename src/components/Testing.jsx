import { useEffect, useState } from "react";

function Testing() {
  const [name, setName] = useState("pascal is boy");

  const [count, setCount] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) {
          return 0;
        }

        return prev - 1;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [count]);
  return (
    <div className="card-container">
      <input
        className="card-input"
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. pascal"
        value={name}
      />
      <div className="card-footer">
        <span className="card-counter">{count}</span>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="card-submit-btn"
        >
          Action
        </button>
      </div>
    </div>
  );
}

export default Testing;
