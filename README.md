# Plugin Hosting Service

A simple Express server for hosting jsPsych plugins and related JavaScript files.

## Files Served

- `jspsych.js` - jsPsych core library
- `plugin-columbia-card-task.js` - Columbia Card Task plugin

## Endpoints

- `GET /health` - Health check
- `GET /files` - List available files
- `GET /{filename}` - Serve static files

## Deployment

This service is designed to be deployed on Railway.app for easy access from Qualtrics surveys.

## Usage

Once deployed, the files will be available at:
- `https://your-railway-url.railway.app/jspsych.js`
- `https://your-railway-url.railway.app/plugin-columbia-card-task.js`

## Local Development

```bash
npm install
npm start
```

The service will run on `http://localhost:3000`
