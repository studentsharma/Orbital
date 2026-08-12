import imagekit from "./ImageKitConfig.js";

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/orbital/posts",
        });

        return res.status(201).json({
            message: "Image uploaded successfully",
            imageUrl: result.url,
            fileId: result.fileId,
        });
    } catch (error) {
        console.error("ImageKit upload error:", error);

        return res.status(500).json({
            message: "Failed to upload image",
            error: error.message,
        });
    }
};

export default uploadImage;
