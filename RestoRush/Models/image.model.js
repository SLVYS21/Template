const mongoose = require("mongoose");

const image = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        required: true
    },
    lastUpdate: {
        type: Date,
        default: Date
    },
    createdAt: {
        type: Date,
        default: Date
    }
});

const crypto = require('crypto')
const sharp = require('sharp');
const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const uniqueName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

class Image {
    constructor {
        this.s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            region: process.env.BUCKET_REGION
        })
    }
    
    async uploadImg(file) {
        try {
            console.log("file", file);
            if (!file)
                return null;
            const name = uniqueName();
            const buffer = await sharp(file.buffer).resize({
                height: 1080,
                width: 1920,
                fit: "contain"
            }).toBuffer();
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: name,
                Body: buffer,
                ContentType: file.mimetype,
            }
            const send_command = new PutObjectCommand(params);
            await s3.send(send_command);
            
            const get_command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3, get_command, {expiresIn: 3600});
            return {
                name,
                url
            }
        } catch (error) {
            console.log("Error uploading image to S3", error);
            return null;
        }
    }
    
    async getImageUrl(name) {
        try {
            if (!name)
                return null;
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: name
            };
            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3, command, {expiresIn: 3600});
            return {
                url
            }
        } catch (error) {
            return null;
        }
    }
    
    async deleteImg(imageName) {
        try {
            if (!file) {
                return null;
            }
            const params = {
            Bucket: process.env.BUCKET_NAME,
                Key: imageName
            };
            const command = new DeleteObjectCommand(params);
            const response = await s3.send(command);
            return (response) ? true : false;
        } catch (error) {
            return null;
        }
    }
}

module.exports = mongoose.model("Image", image);
