import { createVertex } from '@ai-sdk/google-vertex';


const vertex = createVertex({
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION,
    googleAuthOptions: {
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
  },
});

export default vertex