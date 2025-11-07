const Minio = require('minio');

let minioClient = null;

// Configure bucket for public read access and CORS
const configureBucketAccess = async () => {
    try {
        const bucketName = process.env.MINIO_BUCKET;

        // Set bucket policy for public read access
        const bucketPolicy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${bucketName}/*`]
                }
            ]
        };

        await new Promise((resolve, reject) => {
            minioClient.setBucketPolicy(bucketName, JSON.stringify(bucketPolicy), (err) => {
                if (err) {
                    console.error('⚠️ Could not set bucket policy (may require manual setup):', err.message);
                    resolve(); // Don't fail if policy can't be set
                } else {
                    console.log('✅ Bucket policy set for public read access');
                    resolve();
                }
            });
        });

        // Set CORS configuration for video streaming
        const corsConfig = [
            {
                AllowedOrigins: ['*'],
                AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                AllowedHeaders: ['*'],
                ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
                MaxAgeSeconds: 3000
            }
        ];

        await new Promise((resolve, reject) => {
            minioClient.setBucketCors(bucketName, corsConfig, (err) => {
                if (err) {
                    console.error('⚠️ Could not set CORS configuration (may require manual setup):', err.message);
                    resolve(); // Don't fail if CORS can't be set
                } else {
                    console.log('✅ CORS configured for video streaming');
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('⚠️ Error configuring bucket access:', error.message);
        console.log('💡 You may need to configure CORS and bucket policy manually in MinIO console');
    }
};

const initializeMinIO = () => {
    try {
        const url = new URL(process.env.MINIO_ENDPOINT);
        minioClient = new Minio.Client({
            endPoint: url.hostname,
            port: parseInt(url.port) || 9000,
            useSSL: url.protocol === 'https:',
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });

        // Test connection and create bucket if it doesn't exist
        minioClient.bucketExists(process.env.MINIO_BUCKET, async (err, exists) => {
            if (err) {
                console.error('❌ MinIO connection error:', err);
                return;
            }

            if (!exists) {
                minioClient.makeBucket(process.env.MINIO_BUCKET, process.env.MINIO_REGION, async (err) => {
                    if (err) {
                        console.error('❌ Error creating bucket:', err);
                    } else {
                        console.log('✅ MinIO bucket created successfully');
                        await configureBucketAccess();
                    }
                });
            } else {
                console.log('✅ MinIO connected successfully');
                await configureBucketAccess();
            }
        });
    } catch (error) {
        console.error('❌ MinIO initialization error:', error);
    }
};

// const uploadFile = async (file, fileName, contentType) => {
//     try {
//         const objectName = `${Date.now()}-${fileName}`;
//         const metaData = {
//             'Content-Type': contentType,
//         };

//         const result = await minioClient.putObject(
//             process.env.MINIO_BUCKET,
//             objectName,
//             file,
//             metaData
//         );

//         return {
//             success: true,
//             url: `${process.env.MINIO_URL}/${process.env.MINIO_BUCKET}/${objectName}`,
//             objectName
//         };
//     } catch (error) {
//         console.error('Upload error:', error);
//         return {
//             success: false,
//             error: error.message
//         };
//     }
// };




// const uploadFile = async (file, fileName, contentType) => {
//     try {
//         const objectName = `${Date.now()}-${fileName}`;
//         const metaData = {
//             'Content-Type': contentType,
//         };

//         const result = await minioClient.putObject(
//             process.env.MINIO_BUCKET,
//             objectName,
//             file,
//             metaData
//         );

//         const baseURL =
//             process.env.MINIO_URL ||
//             `${process.env.MINIO_ENDPOINT.replace(/\/$/, '')}:${process.env.MINIO_PORT}`;

//         return {
//             success: true,
//             url: `${baseURL}/${process.env.MINIO_BUCKET}/${objectName}`,
//             objectName
//         };
//     } catch (error) {
//         console.error('Upload error:', error);
//         return {
//             success: false,
//             error: error.message
//         };
//     }
// };




const fs = require('fs');
const path = require('path');

const uploadFile = async (file, fileName, contentType, options = {}) => {
    try {
        const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const folder = options.folder ? `${options.folder.replace(/\s+/g, '_').replace(/\/+$/, '')}/` : '';
        const targetBucket = options.bucket || process.env.MINIO_BUCKET;
        const objectName = `${folder}${Date.now()}-${safeFileName}`;
        const metaData = { 'Content-Type': contentType, ...(options.metaData || {}) };

        console.log('🚀 Uploading to MinIO:', fileName, 'size:', file.length || file.size);

        // ✅ If file is a Buffer (like from multer.memoryStorage)
        if (Buffer.isBuffer(file)) {
            console.log('📦 File is a Buffer — uploading with size parameter');
            await minioClient.putObject(
                targetBucket,
                objectName,
                file,
                file.length, // << required for large buffers
                metaData
            );
            console.log('✅ MinIO upload success:', objectName);

        } else if (typeof file === 'string' && fs.existsSync(file)) {
            // ✅ If it's a file path (disk storage case)
            console.log('🗂️ File is a path — streaming to MinIO');
            const fileStream = fs.createReadStream(file);
            await minioClient.putObject(
                targetBucket,
                objectName,
                fileStream,
                metaData
            );
            fs.unlinkSync(file); // optional: delete temp file
        } else {
            throw new Error('Invalid file type — not a buffer or path');
        }

        console.log('✅ MinIO upload success');

        const baseBucketUrl = `${process.env.MINIO_URL}/${targetBucket}`;

        return {
            success: true,
            url: `${baseBucketUrl}/${objectName}`,
            bucket: targetBucket,
            objectName
        };
    } catch (error) {
        console.error('💥 MinIO upload error:', error);
        return { success: false, error: error.message };
    }
};














const deleteFile = async (objectName) => {
    try {
        await minioClient.removeObject(process.env.MINIO_BUCKET, objectName);
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    initializeMinIO,
    uploadFile,
    deleteFile,
    getClient: () => minioClient
};
