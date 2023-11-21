
import { PredictionAPIClient } from "@azure/cognitiveservices-customvision-prediction";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import * as dotenv from 'dotenv';
import * as express from 'express';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

const customVisionPredictionKey = process.env.CUSTOM_VISION_API_KEY;
const endpoint = process.env.CUSTOM_VISION_ENDPOINT;
const projectId = process.env.CUSTOM_VISION_PROJECT_ID;

// Serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile('/home/virgo/code/mission2electricboogaloo/public/index.html');
});

app.get('/config', (req, res) => {
  res.header('Content-Type', 'application/json');
  res.json({
    customVisionPredictionKey,
    customVisionEndpoint: endpoint,
    projectId,
  });
});


app.post('/predict', async (req, res) => {
  try {
	const credentials = new ApiKeyCredentials({ inHeader: {"Prediction-key": customVisionPredictionKey } });
  const client = new PredictionAPIClient(credentials, endpoint);

    // Assuming the file is attached to the 'image' field in the form
    const image = req.files.image;

    if (!image) {
      return res.status(400).json({ error: 'Image not provided' });
    }

    const result = await client.classifyImage(projectId, "Iteration1", image.data);

    console.log("The result is: ");
    console.log(result);

    res.json(result);
  } catch (error) {
    console.log("An error occurred:");
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
