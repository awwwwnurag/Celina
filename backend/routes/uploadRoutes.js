import express from 'express';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Upload multiple files to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const folder = req.query.folder || 'misc';

    // Map each file buffer to uploadToCloudinary promise
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, folder));
    
    // Resolve all uploads in parallel
    const uploadResults = await Promise.all(uploadPromises);

    // Provide urls array (for backwards compatibility if any) and rich objects array
    res.json({
      urls: uploadResults.map(r => r.url),
      images: uploadResults // [{ public_id, url }]
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// @desc    Delete a file from Cloudinary by public_id
// @route   DELETE /api/upload
// @access  Private/Admin
router.delete('/', protect, admin, async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) {
    return res.status(400).json({ message: 'public_id is required' });
  }
  try {
    const result = await deleteFromCloudinary(public_id);
    res.json({ message: 'File deleted from Cloudinary', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete file', error: error.message });
  }
});

export default router;
