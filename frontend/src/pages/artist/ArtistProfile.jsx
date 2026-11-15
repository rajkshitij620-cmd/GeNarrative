import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  User,
  Camera,
  Upload,
  Trash2,
  Save,
  CheckCircle2,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function ArtistProfile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Ananya Sengupta');
  const [bio, setBio] = useState(user?.bio || 'Kathak & Folk choreographer exploring rhythmic accessibility and multisensory cultural storytelling.');
  const [culturalSpecialty, setCulturalSpecialty] = useState(user?.culturalSpecialty || 'Bengali Classical & Folk Traditions');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Camera capture modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.bio) setBio(user.bio);
      if (user.culturalSpecialty) setCulturalSpecialty(user.culturalSpecialty);
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [cameraStream]);

  // Compress/Optimize any uploaded image format using HTML Canvas to ensure seamless storage & performance
  const processImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 800; // 800x800 is crystal clear for avatars
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Export as high quality JPEG data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Unable to read selected image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsDataURL(file);
    });
  };

  // 1. File Upload Handler (Accepts ANY image format: jpg, png, webp, gif, svg, etc.)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    try {
      const optimizedDataUrl = await processImageFile(file);
      setAvatar(optimizedDataUrl);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process image file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 2. Camera Controls
  const startCamera = async () => {
    setCameraError('');
    setCapturedPhoto(null);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });
      setCameraStream(stream);

      // Attach stream to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn('Video play error:', e));
        }
      }, 100);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : 'Could not access camera. Please make sure no other app is using it.'
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const closeCameraModal = () => {
    stopCamera();
    setIsCameraOpen(false);
    setCapturedPhoto(null);
    setCameraError('');
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Center crop square from video
    const startX = ((video.videoWidth || 640) - size) / 2;
    const startY = ((video.videoHeight || 640) - size) / 2;
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhoto(dataUrl);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    if (videoRef.current && cameraStream) {
      videoRef.current.play().catch(e => console.warn('Video resume error:', e));
    }
  };

  const applyCapturedPhoto = () => {
    if (capturedPhoto) {
      setAvatar(capturedPhoto);
      closeCameraModal();
    }
  };

  // Remove photo back to default
  const handleRemovePhoto = () => {
    setAvatar('');
  };

  // Save profile and avatar to backend & sync AuthContext
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);
    try {
      const res = await api.put('/artist/profile', {
        name,
        bio,
        culturalSpecialty,
        avatar
      });

      if (res.data.success) {
        if (updateUser) {
          updateUser(res.data.user || { name, bio, culturalSpecialty, avatar });
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Artist Profile & Credentials</h1>
        <p className="text-xs text-gray-400">Manage your choreographic attribution, avatar photo, and artistic background.</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">Profile and photo updated successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6 shadow-2xl">
        {/* ========================================================
            PROFILE PHOTO / AVATAR SECTION
            ======================================================== */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <label className="block text-xs font-semibold text-gray-300">
            Profile Photo
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Preview Frame */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-violet-500/40 bg-[#0F1422] shadow-xl shadow-violet-600/10 flex items-center justify-center relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name || 'Artist Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-violet-950/40 to-slate-900/60">
                    <User className="w-10 h-10 text-violet-400/80 mb-1" />
                    <span className="text-[10px] font-mono text-gray-400">No Photo</span>
                  </div>
                )}
              </div>

              {/* Ambient badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-violet-600 border-2 border-[#090D16] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Photo Action Buttons */}
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                {/* Upload from file button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Upload className="w-3.5 h-3.5 text-violet-400" />
                  <span>Upload Image</span>
                </button>

                {/* Open camera button */}
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Take with Camera</span>
                </button>

                {/* Remove photo button */}
                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    title="Remove custom photo"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Hidden file input supporting any image format */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="text-[11px] text-gray-400 font-normal leading-relaxed pt-1">
                Supports all formats (<span className="text-gray-300">JPG, PNG, WEBP, GIF, SVG, BMP</span>) of any size. Image is auto-calibrated for high-res studio display.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            TEXT INPUTS
            ======================================================== */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Artist / Ensemble Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sengupta"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Cultural Specialty
            </label>
            <input
              type="text"
              value={culturalSpecialty}
              onChange={(e) => setCulturalSpecialty(e.target.value)}
              placeholder="e.g. Classical Kathak, Bharatanatyam, Theatre"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Artistic Biography
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description of your artistic heritage, repertoire, and choreographic intent..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F17] border border-white/[0.08] text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
          <span className="text-[11px] text-gray-400 font-mono">
            Changes reflect across artist studio & public stage
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ========================================================
          LIVE CAMERA MODAL
          ======================================================== */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C101A] border border-white/[0.12] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Live Camera Snapshot</h3>
              </div>
              <button
                type="button"
                onClick={closeCameraModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Camera Viewport / Frozen Snapshot */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
              {cameraError ? (
                <div className="p-4 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                  <p className="text-xs text-rose-300 leading-relaxed">{cameraError}</p>
                </div>
              ) : capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Captured snapshot"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]" // mirror view for natural selfie
                  />
                  {/* Circular framing target guideline */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-52 h-52 rounded-full border-2 border-dashed border-cyan-400/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
                  </div>
                </>
              )}
            </div>

            {/* Hidden canvas for snapshot rasterization */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Action Buttons */}
            {!cameraError && (
              <div className="flex items-center justify-between gap-3 pt-1">
                {capturedPhoto ? (
                  <>
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={applyCapturedPhoto}
                      className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Use This Photo</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={closeCameraModal}
                      className="px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={captureFrame}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02]"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
