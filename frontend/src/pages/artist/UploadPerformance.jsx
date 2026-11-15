import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  UploadCloud,
  Film,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileVideo,
  Image,
  CheckCircle2,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { INDIAN_OFFICIAL_LANGUAGES } from '../../constants/languages';

export default function UploadPerformance() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dance');
  const [originalLanguage, setOriginalLanguage] = useState('Bengali');
  const [additionalLanguages, setAdditionalLanguages] = useState('Hindi, English');
  const [tags, setTags] = useState('Kathak, Mudra, Classical');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [duration, setDuration] = useState(60.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('video') && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      setError('Please select an MP4, MOV, or WEBM video file.');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');

    // Estimate duration using temporary video element
    const tempVid = document.createElement('video');
    tempVid.preload = 'metadata';
    tempVid.src = URL.createObjectURL(file);
    tempVid.onloadedmetadata = () => {
      if (tempVid.duration) {
        setDuration(Math.round(tempVid.duration * 10) / 10);
      }
    };
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Performance title is required.');
      return;
    }
    if (!videoFile) {
      setError('Please select a video file for your performance.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('originalLanguage', originalLanguage);
      formData.append('supportedLanguages', `${originalLanguage}, ${additionalLanguages}`);
      formData.append('tags', tags);
      formData.append('duration', duration);

      if (videoFile) {
        formData.append('video', videoFile);
      }
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      // Step 1: Create Performance in Express
      const res = await api.post('/performances', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const perfId = res.data.performance._id;
        // Step 2: Trigger AI Analysis
        await api.post(`/ai/analyze/${perfId}`);
        // Step 3: Navigate to AI Analysis live status view
        navigate(`/artist/analysis/${perfId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title & Info */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-300 text-xs font-semibold">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Stage Video Ingestion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Upload Performance Master</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Upload your original performance. RASA CUE creates separate derived accessibility layers; your original audio and visual work will never be modified.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* VIDEO UPLOAD DROPZONE */}
        <div className="p-6 rounded-3xl glass-panel border border-dashed border-gray-700 hover:border-primary-500/50 transition-colors">
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleVideoChange}
              className="hidden"
            />
            {videoPreview ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-[320px] flex items-center justify-center">
                  <video src={videoPreview} controls className="max-h-[320px] w-auto mx-auto rounded-xl" />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300 px-2">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Video Loaded ({videoFile?.name || 'Selected'})
                  </span>
                  <span className="font-mono text-gray-400">Duration: ~{duration}s</span>
                  <span className="text-primary-400 hover:underline">Click to Replace Video</span>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-primary-600/20 text-primary-300 border border-primary-500/30 flex items-center justify-center mx-auto">
                  <FileVideo className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Select or drop stage performance video</span>
                  <span className="text-xs text-gray-400">Supports MP4, MOV, or WEBM up to 200MB</span>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* METADATA FORM FIELDS */}
        <div className="p-6 rounded-3xl glass-panel border border-gray-800 space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Film className="w-4 h-4 text-primary-400" />
            <span>Performance Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Performance Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rituranga: Season of Joy (Bengali Classical & Folk Fusion)"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white focus:border-primary-500 focus:outline-none"
              >
                <option value="Dance">Dance</option>
                <option value="Theatre">Theatre</option>
                <option value="Music">Music Performance</option>
                <option value="Spoken Word">Spoken Word / Poetry</option>
                <option value="Cultural Performance">Cultural Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Original Language</label>
              <select
                value={originalLanguage}
                onChange={(e) => setOriginalLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white focus:border-primary-500 focus:outline-none"
              >
                {INDIAN_OFFICIAL_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Additional Output Accessibility Languages
              </label>
              <input
                type="text"
                value={additionalLanguages}
                onChange={(e) => setAdditionalLanguages(e.target.value)}
                placeholder="e.g. Hindi, English"
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">Comma-separated languages for multilingual caption and narration generation.</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Artistic & Cultural Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the choreographic style, symbolic mudras, musical composition, or dramatic context to guide AI analysis..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tags & Descriptors
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Kathak, Bengali Folk, Teental, Ghungroo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-gray-700 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CULTURAL ETHICS NOTICE */}
        <div className="p-4 rounded-2xl bg-surface border border-emerald-500/30 flex items-start gap-3 text-xs text-gray-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold mb-0.5">RASA CUE Preservation Guarantee</strong>
            Your original video remains pristine on disk. Submitting this form extracts metadata and schedules an asynchronous analysis job on the FastAPI microservice.
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-primary-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Uploading & Queuing AI Pipeline...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Upload & Begin AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
