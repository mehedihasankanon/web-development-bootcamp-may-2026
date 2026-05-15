import { prisma } from "../database/db.js";

export const listFolders = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        ownerId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    if (parentId) {
      const parent = await prisma.folder.findFirst({
        where: {
          id: parentId,
          ownerId: req.user.id,
        },
      });

      if (!parent) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        ownerId: req.user.id,
        parentId: parentId || null,
      },
    });

    res.status(201).json({ folder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
