import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export const BUCKET = process.env.NCP_OS_BUCKET;

export const s3 = new S3Client({
    region: process.env.NCP_OS_REGION || "kr-standard",
    endpoint: process.env.NCP_OS_ENDPOINT || "https://kr.object.ncloudstorage.com",
    credentials: {
      accessKeyId: process.env.NCP_ACCESS_KEY,
      secretAccessKey: process.env.NCP_SECRET_KEY,
    },
    forcePathStyle: true, // S3 호환 스토리지에서 안전
  });
  
  export async function putBuffer({ key, body, contentType }) {
    if (!BUCKET) throw new Error("NCP_OS_BUCKET is missing");
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType || "application/octet-stream",
      })
    );
    return key;
  }
  
  export async function getObjectStream(key) {
    if (!BUCKET) throw new Error("NCP_OS_BUCKET is missing");
    return s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  }
  
  export async function deleteByKey(key) {
    if (!BUCKET) throw new Error("NCP_OS_BUCKET is missing");
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  }
  