import "./App.css";
import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <div className="app">
      <h1>AI Brow Advisor</h1>

      <p>
        Discover the eyebrow style that fits your face.
      </p>

      <ImageUploader />
    </div>
  );
}

export default App;