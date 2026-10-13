import { useState, useRef } from "react";
import { detectFace } from "./FaceLandmarker";
import { getFaceMeasurements } from "./FaceAnalysis";

function ImageUploader() {
    // Store uploaded image
    const [image, setImage] = useState(null);

    // Store face analysis result
    const [analysis, setAnalysis] = useState(null);

    // Reference to the canvas
    const canvasRef = useRef(null);


    // Handle image upload
    function handleImageUpload(event) {
        const file = event.target.files[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);

            setImage(imageUrl);

            // Clear previous analysis
            setAnalysis(null);
        }
    }


    // Analyze the image after it loads
    async function handleImageLoad(event) {
        const img = event.target;

        // Detect facial landmarks using MediaPipe
        const landmarks = await detectFace(img);

        if (!landmarks || landmarks.length === 0) {
            console.log("No face detected");
            setAnalysis(null);
            return;
        }


        // Get the first detected face
        const facePoints = landmarks[0];


        // Analyze face measurements and face shape
        const measurements = getFaceMeasurements(facePoints);

        // Save analysis result
        setAnalysis(measurements);

        console.log("Face Analysis:", measurements);


        // Draw facial landmarks
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = img.clientWidth;
        canvas.height = img.clientHeight;

        // Clear old landmarks
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        facePoints.forEach((point) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        });
    }


    return (
        <div>
            <h2>Upload Your Photo</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
            />


            {/* Uploaded image and facial landmarks */}
            {image && (
                <div
                    style={{
                        position: "relative",
                        width: "400px"
                    }}
                >
                    <img
                        src={image}
                        alt="Uploaded face"
                        width="400"
                        onLoad={handleImageLoad}
                    />

                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            pointerEvents: "none"
                        }}
                    />
                </div>
            )}


            {/* Face analysis result */}
            {analysis && (
                <div>
                    <h3>Face Analysis</h3>

                    <p>
                        Face Shape: <strong>{analysis.faceShape}</strong>
                    </p>

                    <p>
                        Chin Shape: <strong>{analysis.chinShape}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}

export default ImageUploader;