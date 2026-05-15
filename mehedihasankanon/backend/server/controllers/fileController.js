{
  /*
    Add controllers: listFiles(userId), toggleFileAccess(fileId, userId), deleteFile(fileId, userId)
    Add routes to fileRouter.js:
    GET /api/files/get-all — List user's files (protected)
    PATCH /api/files/toggle-access/:fileId — Toggle PRIVATE↔PUBLIC (protected)
    DELETE /api/files/delete/:fileId — Delete file from DB & UploadThing (protected)
    */
}

/*
     
    model File {
    id         String         @id @default(uuid())
    name       String
    fileKey    String         @unique
    url        String
    size       Int
    type       String
    access     AccessLevel    @default(PRIVATE)
    ownerId    String
    folderId   String?
    createdAt  DateTime       @default(now())
    updatedAt  DateTime       @updatedAt
    folder     Folder?        @relation(fields: [folderId], references: [id])
    owner      User           @relation("FileOwner", fields: [ownerId], references: [id], onDelete: Cascade)
    sharedWith SharedAccess[]

    @@index([ownerId])
    @@index([fileKey])
    }

    
    */

import { prisma } from "../database/db.js";
import { deleteFileFromUploadThing } from "../routes/uploadRouter.js";

// list all files
export const listFiles = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        ownerId: req.user.id,
      },
    });

    // map json to include necessary info
    const response = files.map((file) => ({
      id: file.id,
      name: file.name,
      fileKey: file.fileKey,
      url: file.url,
      size: file.size,
      type: file.type,
      access: file.access,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// toggle file access
export const toggleFileAccess = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // find file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // toggle access level
    const newAccess = file.access === "PRIVATE" ? "PUBLIC" : "PRIVATE";

    await prisma.file.update({
      where: { id: fileId },
      data: { access: newAccess },
    });

    res.json({
      message: "File access updated successfully",
      access: newAccess,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete file
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // find file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // delete from UploadThing
    await deleteFileFromUploadThing(file.fileKey);

    // delete from DB
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
