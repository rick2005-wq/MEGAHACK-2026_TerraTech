import { s3 } from "../config/s3";
export async function uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `${folder}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const result = await s3.upload(params).promise();
  return result.Location;
}
