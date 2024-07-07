document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    const predictButton = document.getElementById('predict-button');
    const predictionResult = document.getElementById('prediction-result');

    predictButton.addEventListener('click', async function() {
        // Preprocess the canvas image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const input = tf.browser.fromPixels(imageData)
                               .resizeNearestNeighbor([28, 28])
                               .mean(2)
                               .expandDims(0)
                               .expandDims(-1)
                               .toFloat()
                               .div(tf.scalar(255.0));

        const inputArray = input.arraySync();

        // Send the input data to the Flask server
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: inputArray }),
        });

        const result = await response.json();
        predictionResult.innerText = `Prediction: ${result.prediction}`;
    });
});
