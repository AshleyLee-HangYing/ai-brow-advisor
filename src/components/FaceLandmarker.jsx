import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { getFaceMeasurements } from "./FaceAnalysis";


const createFaceLandmarker = async () => {

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
            },

            runningMode: "IMAGE",
            numFaces: 1,
        }
    );

    return faceLandmarker;
};


export const detectFace = async (imageElement) => {

    const faceLandmarker = await createFaceLandmarker();

    const results = faceLandmarker.detect(imageElement);

    console.log("Face landmarks:", results.faceLandmarks);

    if (results.faceLandmarks.length > 0) {

        const landmarks = results.faceLandmarks[0];

        const measurements = getFaceMeasurements(landmarks);

        console.log("Face measurements:", measurements);
    }

    return results.faceLandmarks;
};