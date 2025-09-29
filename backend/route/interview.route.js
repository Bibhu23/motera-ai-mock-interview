// import express from "express";
// import { detectFaces } from "../service/FaceDetectionService.js";

// const router = express.Router();

// router.post("/detect-face", express.json({ limit: "10mb" }), async (req, res) => {
//     try {
//         const { imageUrl } = req.body;
//         if (!imageUrl) return res.status(400).json({ error: "No image provided" });

//         const faces = await detectFaces(imageUrl); // raw ONNX output
//         res.json({ faces });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Face detection failed" });
//     }
// });

// export default router;
