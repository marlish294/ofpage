const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
});

async function testMinIO() {
    try {
        console.log('Testing MinIO connection...');

        // Check if bucket exists
        const bucketExists = await minioClient.bucketExists('social-platform');
        console.log('Bucket exists:', bucketExists);

        if (!bucketExists) {
            console.log('Creating bucket...');
            await minioClient.makeBucket('social-platform', 'us-east-1');
            console.log('Bucket created successfully');
        }

        // Test file upload
        const testContent = Buffer.from('test image content', 'utf8');
        const objectName = `test-${Date.now()}.txt`;

        console.log('Uploading test file...');
        await minioClient.putObject('social-platform', objectName, testContent, {
            'Content-Type': 'text/plain'
        });

        console.log('File uploaded successfully');

        // Get file URL
        const url = await minioClient.presignedGetObject('social-platform', objectName, 24 * 60 * 60);
        console.log('File URL:', url);

    } catch (error) {
        console.error('MinIO test error:', error);
    }
}

testMinIO();

