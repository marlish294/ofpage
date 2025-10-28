const Minio = require('minio');

let minioClient = null;

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
        minioClient.bucketExists(process.env.MINIO_BUCKET, (err, exists) => {
            if (err) {
                console.error('❌ MinIO connection error:', err);
                return;
            }

            if (!exists) {
                minioClient.makeBucket(process.env.MINIO_BUCKET, process.env.MINIO_REGION, (err) => {
                    if (err) {
                        console.error('❌ Error creating bucket:', err);
                    } else {
                        console.log('✅ MinIO bucket created successfully');
                    }
                });
            } else {
                console.log('✅ MinIO connected successfully');
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




const uploadFile = async (file, fileName, contentType) => {
    try {
        const objectName = `${Date.now()}-${fileName}`;
        const metaData = {
            'Content-Type': contentType,
        };

        const result = await minioClient.putObject(
            process.env.MINIO_BUCKET,
            objectName,
            file,
            metaData
        );

        const baseURL =
            process.env.MINIO_URL ||
            `${process.env.MINIO_ENDPOINT.replace(/\/$/, '')}:${process.env.MINIO_PORT}`;

        return {
            success: true,
            url: `${baseURL}/${process.env.MINIO_BUCKET}/${objectName}`,
            objectName
        };
    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error.message
        };
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
