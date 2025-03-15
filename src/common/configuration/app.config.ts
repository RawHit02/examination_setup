export const APP_CONFIG = () => {
  return {
    APP_NAME: process.env['APP_NAME'],
    APP_ENV: process.env['APP_ENV'],

    awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,

    awsRegion: process.env.AWS_REGION,

    awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,

    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,

    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
};
