export const applyGradientToFrame = (img, gradientImage) => {
    const frameCanvas = document.createElement("canvas");
    const frameCtx = frameCanvas.getContext("2d");

    frameCanvas.width = img.width;
    frameCanvas.height = img.height;
    frameCtx.drawImage(img, 0, 0);
    const frameData = frameCtx.getImageData(0, 0, frameCanvas.width, frameCanvas.height);

    const gradientCanvas = document.createElement("canvas");
    const gradientCtx = gradientCanvas.getContext("2d");
    gradientCanvas.width = gradientImage.width;
    gradientCanvas.height = 1;
    gradientCtx.drawImage(gradientImage, 0, 0);
    const gradientData = gradientCtx.getImageData(0, 0, gradientCanvas.width, 1);

    for (let y = 0; y < frameData.height; y++) {
        for (let x = 0; x < frameData.width; x++) {
            const index = (y * frameData.width + x) * 4;
            if (frameData.data[index + 3] !== 0) { // Non-transparent pixel
                const gradientIndex = (x % gradientImage.width) * 4;
                frameData.data[index] = gradientData.data[gradientIndex];       // Red
                frameData.data[index + 1] = gradientData.data[gradientIndex + 1]; // Green
                frameData.data[index + 2] = gradientData.data[gradientIndex + 2]; // Blue
            }
        }
    }

    frameCtx.putImageData(frameData, 0, 0);

    const newImg = new Image();
    newImg.src = frameCanvas.toDataURL(); // Directly set the image source

    return newImg; 
};
