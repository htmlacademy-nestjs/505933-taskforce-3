import { UploaderConfig } from '../contracts';

export const getUploaderConfig = (): UploaderConfig => {
  return {
    uploadDirectory: process.env.UPLOAD_DIRECTORY,
    serveStatic: process.env.SERVE_STATIC,
  };
};
