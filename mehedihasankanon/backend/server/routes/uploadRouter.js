
import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

import { prisma } from "../database/db.js";


export const uploadRouter = {
    fileUploader: f({
        // we could also specify minFileCount but I guess that's not necessary rn
        image: {maxFileSize: "2MB", maxFileCount: 1},
        video: {maxFileSize: "32MB", maxFileCount: 1},
        text: {maxFileSize: "100KB", maxFileCount: 1},
        pdf: {maxFileSize: "6MB", maxFileCount: 1},
        audio: {maxFileSize: "8MB", maxFileCount: 1}
    }).onUploadComplete(
        // this acts as a webhook that prompts the ORM to store the metadata 
        // in the database as per our schema design

        async ({metadata, file}) => {

            console.log("Upload completed", file);

            try {
                await prisma.file.create({
                data: {
                    name: file.name,
                    fileKey: file.key,
                    url: file.url,
                    size: file.size,
                    type: file.type,
                    ownerId: "PLACEHOLDER",     // TODO:replace this after auth is ready
                }
            })
            }
            catch (error) {
                console.log("File upload failed", error);
                throw new Error("Failed to save file to database");
            }
        }
    )
};