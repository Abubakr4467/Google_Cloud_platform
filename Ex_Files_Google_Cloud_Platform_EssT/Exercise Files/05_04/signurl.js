/**
 * TODO(developer): Uncomment the following lines before running the sample.
 * Note: when creating a signed URL, unless running in a GCP environment,
 * a service account must be used for authorization.
 */
const bucketName = 'my-pet-project-bucket';
const filename = 'husky.jpg';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
  keyFilename: 'gcs-viewer-service-account-pk.json'
});

async function generateV4ReadSignedUrl() {
  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  // Get a v4 signed URL for reading the file
  const [url] = await storage
    .bucket(bucketName)
    .file(filename)
    .getSignedUrl(options);

  console.log('Generated GET signed URL:');
  console.log(url);
  console.log('You can use this URL with any user agent, for example:');
  console.log(`curl '${url}'`);
}

generateV4ReadSignedUrl().catch(console.error);