import { useState } from "react";
import paintings from "./paintings";

function App() {

  const [remaining, setRemaining] = useState(paintings);
  const [dragged, setDragged] = useState(null);
  const [score, setScore] = useState(0);
const [message, setMessage] = useState(
  "Sort the paintings into the correct movement."
);

const [explanation, setExplanation] =
  useState("");

  const categories = ["Rococo", "Neo-Classical", "Romantic", "Realist", "Impressionist",];

  function handleDrop(category) {
  if (!dragged) return;

  if (dragged.movement === category) {
    setMessage(`✅ Correct! ${dragged.title}`);
    setScore(score + 1);
  } else {
    setMessage(
      `❌ ${dragged.title} belongs to ${dragged.movement}`
    );
  }

  setExplanation(dragged.explanation);

  setRemaining(
    remaining.filter(
      (painting) => painting.title !== dragged.title
    )
  );
}
if (remaining.length === 0) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>🎉 Game Complete!</h1>

      <h2>
        Final Score: {score} / {paintings.length}
      </h2>

      <button
        onClick={() => window.location.reload()}
      >
        Play Again
      </button>
    </div>
  );
}
  return (
    <div
  style={{
    padding: "30px",
    backgroundColor: "#f8f6f2",
    minHeight: "100vh",
    fontFamily: "Georgia, serif",
  }}
>
      <h1>Art Movement Sorting Game</h1>

      <h2>Score: {score}</h2>

      <p>{message}</p>
<p
  style={{
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "800px",
  }}
>
  {explanation}
</p>
      <div
    
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {remaining.map((painting) => (
          <div
            key={painting.title}
            draggable
            onDragStart={() => setDragged(painting)}
            style={{
              border: "1px solid black",
              padding: "10px",
              backgroundColor: "#f5f5f5",
              cursor: "grab",
            }}
          >
            <img
              src={painting.image}
              alt={painting.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />
            <p style={{ marginBottom: 0 }}>{painting.title}</p>
          </div>
        ))}
      </div>

      <div
        style={{
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(180px, 1fr))",
  gap: "20px",
  padding: "10px",
  width: "320px",
  borderRadius: "12px",
  cursor: "grab",
}}
      >
        {categories.map((category) => (
          <div
            key={category}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(category)}
            style={{            
  border: "3px dashed #888",
  minHeight: "180px",
  padding: "20px",
  textAlign: "center",
  borderRadius: "12px",
  backgroundColor: "#fafafa",
  fontWeight: "bold",
}}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
