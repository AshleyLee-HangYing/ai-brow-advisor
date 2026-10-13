// 1. Calculate the distance between two landmarks
function distance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;

    return Math.sqrt(dx * dx + dy * dy);
}


// 2. Analyze the chin shape
function getChinShape(landmarks) {

    // Calculate the lower jaw width
    const lowerJawWidth = distance(
        landmarks[172],
        landmarks[397]
    );

    // Calculate the width near the chin
    const chinWidth = distance(
        landmarks[148],
        landmarks[377]
    );

    // Compare chin width with jaw width
    const chinRatio = chinWidth / lowerJawWidth;

    let chinShape;

    if (chinRatio < 0.75) {
        chinShape = "Pointed";
    } else {
        chinShape = "Rounded/Wide";
    }

    return {
        chinWidth,
        chinRatio,
        chinShape
    };
}


// Analyze face shape using facial proportions
function classifyFaceShape(
    lengthToWidthRatio,
    foreheadToCheekRatio,
    jawToCheekRatio,
    chinShape
) {
    // Long face
    if (lengthToWidthRatio > 1.45) {
        return "Oblong";
    }

    // Heart: wider forehead + pointed chin
    if (
        foreheadToCheekRatio > 0.9 &&
        jawToCheekRatio < 0.85 &&
        chinShape === "Pointed"
    ) {
        return "Heart";
    }

    // Diamond: cheekbones are widest + pointed chin
    if (
        foreheadToCheekRatio < 0.9 &&
        jawToCheekRatio < 0.85 &&
        chinShape === "Pointed"
    ) {
        return "Diamond";
    }

    // Square: similar width proportions + wider chin
    if (
        jawToCheekRatio > 0.9 &&
        chinShape === "Rounded/Wide"
    ) {
        return "Square";
    }

    // Round: short face + rounded chin
    if (
        lengthToWidthRatio < 1.3 &&
        chinShape === "Rounded/Wide"
    ) {
        return "Round";
    }

    // Triangle: jaw wider relative to forehead
    if (
        jawToCheekRatio > foreheadToCheekRatio &&
        chinShape === "Rounded/Wide"
    ) {
        return "Triangle";
    }

    // Default balanced face
    return "Oval";
}

// 3. Calculate important face measurements
export function getFaceMeasurements(landmarks) {

    // Measure from the upper face to the chin
    const upperFaceToChin = distance(
        landmarks[10],
        landmarks[152]
    );

    // Calculate forehead width
    const foreheadWidth = distance(
        landmarks[54],
        landmarks[284]
    );

    // Calculate cheekbone width
    const cheekboneWidth = distance(
        landmarks[234],
        landmarks[454]
    );

    // Calculate jaw width
    const jawWidth = distance(
        landmarks[172],
        landmarks[397]
    );


    // Calculate face ratios
    const lengthToWidthRatio =
        upperFaceToChin / cheekboneWidth;

    const foreheadToCheekRatio =
        foreheadWidth / cheekboneWidth;

    const jawToCheekRatio =
        jawWidth / cheekboneWidth;


    // Analyze the chin
    const chin = getChinShape(landmarks);

    // Determine face shape
    const faceShape = classifyFaceShape(
        lengthToWidthRatio,
        foreheadToCheekRatio,
        jawToCheekRatio,
        chin.chinShape
    );


    // Return all face measurements
    return {
        upperFaceToChin,
        foreheadWidth,
        cheekboneWidth,
        jawWidth,

        lengthToWidthRatio,
        foreheadToCheekRatio,
        jawToCheekRatio,

        chinWidth: chin.chinWidth,
        chinRatio: chin.chinRatio,
        chinShape: chin.chinShape,

        faceShape
    };
} 
