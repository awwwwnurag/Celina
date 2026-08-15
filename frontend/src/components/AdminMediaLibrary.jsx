import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';

export const AdminMediaLibrary = ({ getAuthConfig, globalSettings, setGlobalSettings }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadingMedia(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    try {
      const config = getAuthConfig();
      const uploadConfig = { headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload?folder=media', formData, uploadConfig);
      setMediaFiles(prev => [...data.images, ...prev]);
      alert(`${files.length} files uploaded successfully.`);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingMedia(false);
    }
  };

  const loadAllMedia = async () => {
    try {
      const config = getAuthConfig();
      const { data } = await axios.get('/api/settings', config);
      const allImages = [
        ...(data.websiteLogo ? [data.websiteLogo] : []),
        ...(data.footerLogo ? [data.footerLogo] : []),
        ...(data.homepageSponsors?.images || []),
        ...(data.paymentIcons || []),
        ...(data.homepagePromoBanners?.map(b => b.image).filter(Boolean) || [])
      ];
      setMediaFiles(allImages);
    } catch (err) {
      console.error('Failed to load media:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4">
      <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
        <Upload size={18} /> Media Library
      </h3>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploadingMedia}
            className="w-full text-xs"
          />
        </div>
        <button onClick={loadAllMedia} className="bg-brand-burgundy text-white px-4 py-2 rounded text-xs font-bold uppercase">
          Load All Media
        </button>
      </div>

      {uploadingMedia && (
        <div className="text-center py-4 text-brand-burgundy font-bold animate-pulse">Uploading files...</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaFiles.map((media, idx) => (
          <div key={idx} className="relative group">
            <img src={typeof media === 'string' ? media : media.url} alt={`Media ${idx}`} className="w-full aspect-square object-cover rounded border border-gray-200" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(typeof media === 'string' ? media : media.url)} className="bg-white text-black p-2 rounded text-xs font-bold">Copy URL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
