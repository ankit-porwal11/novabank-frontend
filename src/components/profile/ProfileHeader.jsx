import { useRef, useState, useEffect } from "react";
import { Camera, ShieldCheck, ZoomIn } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useUpdateAvatar } from "../../hooks/useUpdateAvatar.js";
import { useUpdateCoverImage } from "../../hooks/useUpdateCoverImage.js";
import Spinner from "../ui/Spinner.jsx";
import SuccessCheck from "../ui/SuccessCheck.jsx";
import ImagePreviewModal from "./ImagePreviewModal.jsx";
import MagneticButton from "../motion/MagneticButton.jsx";
import "./ProfileHeader.css";

export default function ProfileHeader({ user }) {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const coverRef = useRef(null);
  const updateAvatarMutation = useUpdateAvatar();
  const updateCoverMutation = useUpdateCoverImage();

  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [coverSuccess, setCoverSuccess] = useState(false);
  const [previewTarget, setPreviewTarget] = useState(null); // "avatar" | "cover" | null

  // Parallax: cover image drifts slightly slower than page scroll.
  const { scrollY } = useScroll();
  const coverY = useTransform(scrollY, [0, 300], [0, 60]);

  useEffect(() => {
    if (updateAvatarMutation.isSuccess) {
      setAvatarSuccess(true);
      const t = setTimeout(() => setAvatarSuccess(false), 1800);
      return () => clearTimeout(t);
    }
  }, [updateAvatarMutation.isSuccess]);

  useEffect(() => {
    if (updateCoverMutation.isSuccess) {
      setCoverSuccess(true);
      const t = setTimeout(() => setCoverSuccess(false), 1800);
      return () => clearTimeout(t);
    }
  }, [updateCoverMutation.isSuccess]);

  function handleAvatarSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    updateAvatarMutation.mutate(file);
    e.target.value = "";
  }

  function handleCoverSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    updateCoverMutation.mutate(file);
    e.target.value = "";
  }

  function handleEditClick(e, ref) {
    // Edit buttons sit visually inside the clickable image area — stop
    // propagation so clicking "change photo" never also opens the preview.
    e.stopPropagation();
    ref.current?.click();
  }

  const initials = (user?.fullName || user?.username || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      className="profile-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="profile-header__cover" ref={coverRef}>
        {user?.coverimage ? (
          <button
            type="button"
            className="profile-header__cover-clicktarget"
            onClick={() => setPreviewTarget("cover")}
            aria-label="View cover image"
          >
            <motion.img
              src={user.coverimage}
              alt=""
              className="profile-header__cover-img"
              style={{ y: coverY }}
            />
            <span className="profile-header__cover-zoom-hint" aria-hidden="true">
              <ZoomIn size={16} />
            </span>
          </button>
        ) : null}
        <motion.div
          className="profile-header__cover-ambient"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <div className="profile-header__cover-overlay" aria-hidden="true" />

        <MagneticButton strength={5} className="profile-header__cover-edit-slot">
          <button
            type="button"
            className="profile-header__cover-edit"
            onClick={(e) => handleEditClick(e, coverInputRef)}
            disabled={updateCoverMutation.isPending}
          >
            <AnimatePresence mode="wait" initial={false}>
              {coverSuccess ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <SuccessCheck size={14} />
                  <span>Updated</span>
                </motion.span>
              ) : updateCoverMutation.isPending ? (
                <motion.span key="loading" style={{ display: "inline-flex" }}>
                  <Spinner size={14} />
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Camera size={14} />
                  <span>Change cover</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </MagneticButton>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="profile-header__hidden-input"
          onChange={handleCoverSelect}
        />
      </div>

      <div className="profile-header__identity">
        <motion.div
          className="profile-header__avatar-float"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="profile-header__avatar-wrap"
            role="button"
            tabIndex={0}
            onClick={() => user?.avatar && setPreviewTarget("avatar")}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && user?.avatar) {
                e.preventDefault();
                setPreviewTarget("avatar");
              }
            }}
            whileHover="hover"
            initial="rest"
            animate="rest"
            aria-label="View profile photo"
          >
            {/* Idle ambient breathing glow — kept separate from the
                hover-boost glow below since mixing a looping `animate`
                with inherited hover variants on the same element causes
                them to fight in framer-motion. */}
            <motion.span
              className="profile-header__avatar-glow profile-header__avatar-glow--idle"
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <motion.span
              className="profile-header__avatar-glow"
              variants={{
                rest: { opacity: 0, scale: 0.9 },
                hover: { opacity: 1, scale: 1.15 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              aria-hidden="true"
            />
            <span className="profile-header__avatar-ring" aria-hidden="true" />
            <motion.span
              className="profile-header__avatar-ring-sweep"
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            />

            {user?.avatar ? (
              <motion.img
                src={user.avatar}
                alt=""
                className="profile-header__avatar"
                variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            ) : (
              <motion.div
                className="profile-header__avatar profile-header__avatar--fallback"
                variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {initials}
              </motion.div>
            )}

            <motion.span
              className="profile-header__avatar-zoom-hint"
              variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.18 }}
              aria-hidden="true"
            >
              <ZoomIn size={20} />
            </motion.span>

            <MagneticButton strength={6} className="profile-header__avatar-edit-slot">
              <button
                type="button"
                className="profile-header__avatar-edit"
                aria-label="Change profile photo"
                onClick={(e) => handleEditClick(e, avatarInputRef)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {avatarSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                    >
                      <SuccessCheck size={15} />
                    </motion.span>
                  ) : updateAvatarMutation.isPending ? (
                    <Spinner key="loading" size={15} />
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 1 }}>
                      <Camera size={15} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </MagneticButton>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="profile-header__hidden-input"
              onChange={handleAvatarSelect}
            />
          </motion.div>
        </motion.div>

        <div className="profile-header__meta">
          <h2 className="profile-header__name">{user?.fullName}</h2>
          <p className="profile-header__username text-muted">@{user?.username}</p>
          <span className="profile-header__verified-badge">
            <ShieldCheck size={12} strokeWidth={2.5} />
            Verified account
          </span>
        </div>
      </div>

      <ImagePreviewModal
        open={previewTarget === "avatar"}
        onClose={() => setPreviewTarget(null)}
        src={user?.avatar}
        alt={`${user?.fullName || user?.username || "User"}'s profile photo`}
        label="Profile photo"
      />
      <ImagePreviewModal
        open={previewTarget === "cover"}
        onClose={() => setPreviewTarget(null)}
        src={user?.coverimage}
        alt="Cover image"
        label="Cover image"
      />
    </motion.div>
  );
}
