import { useState } from "react";
import paintings from "./paintings";
function getRandomPaintings(allPaintings, count) {
  const shuffled = [...allPaintings].sort(
    () => Math.random() - 0.5
  );

  return shuffled.slice(0, count);
}
function App() {

  const [remaining, setRemaining] = useState(
  getRandomPaintings(paintings, 8)
);
  const [dragged, setDragged] = useState(null);
  const [score, setScore] = useState(0);
const [message, setMessage] = useState(
  "Sort the paintings into the correct movement."
);
const [results, setResults] = useState([]);
const [explanation, setExplanation] =
  useState("");
const [selectedImage, setSelectedImage] =
  useState(null);
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
setResults((prev) => [
  ...prev,
  {
    title: dragged.title,
    correct: dragged.movement === category,
    movement: dragged.movement,
    selected: category,
    explanation: dragged.explanation,
  },
]);

  setExplanation(dragged.explanation);

  setRemaining(
    remaining.filter(
      (painting) => painting.title !== dragged.title
    )
  );
}
if (remaining.length === 0) {
  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Georgia, serif",
      }}
    >
      <h1>🎉 Game Complete!</h1>

      <h2>
        Final Score: {score} / 8
      </h2>

      <hr />

      <h2>Review</h2>

      {results.map((result, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            backgroundColor: result.correct
              ? "#eef9ee"
              : "#fff0f0",
          }}
        >
          <h3>{result.title}</h3>

          <p>
            {result.correct
              ? "✅ Correct"
              : "❌ Incorrect"}
          </p>
 <p>
            <strong>Your Answer:</strong>{" "}
            {result.selected}
          </p>

          <p></p>
          <p>
            <strong>Movement:</strong>{" "}
            {result.movement}
          </p>

          <p>{result.explanation}</p>
        </div>
      ))}

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
        }}
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
              onClick={() => setSelectedImage(painting)}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                cursor: "pointer",
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

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <h2>{selectedImage.title}</h2>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
