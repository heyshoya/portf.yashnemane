import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Trophy, Award, Code, CheckCircle, X } from "lucide-react";
import "./display-cards.css";

export function DisplayCard({
  className = "",
  icon = <Sparkles className="size-4 text-red-400" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-red-500",
  titleClassName = "text-red-500",
  image,
  tag,
  isActive = false,
  style = {},
  onClick,
  onMouseEnter,
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={style}
      className={`display-card ${className} ${isActive ? "is-active" : "is-inactive"}`}
      role="button"
      tabIndex={0}
      title={isActive ? "Click to expand certificate" : "Hover to scroll, click to expand"}
    >
      {/* Certificate Image Preview Banner */}
      {image && (
        <div className="display-card-image-wrap">
          <img src={image} alt={title} className="display-card-img" />
          {tag && <span className="display-card-tag">{tag}</span>}
          <div className="display-card-zoom-hint">[CLICK TO EXPAND ↗]</div>
        </div>
      )}

      {/* Card Content Footer */}
      <div className="display-card-body">
        <div className="display-card-topline">
          <div className="display-card-icon-title">
            <span className={`display-card-icon ${iconClassName}`}>{icon}</span>
            <span className={`display-card-title ${titleClassName}`}>{title}</span>
          </div>
          <span className="display-card-date">{date}</span>
        </div>
        <p className="display-card-desc">{description}</p>
      </div>
    </div>
  );
}

// Fisheye Scale & Position Hierarchy Function
// - Middle active card: Large popped-up size (scale 1.14)
// - Adjacent cards (|diff| = 1): Normal size (scale 0.98)
// - Next adjacent cards (|diff| = 2): Lower size (scale 0.86)
// - Outer cards (|diff| >= 3): Lowest size (scale 0.76)
const getCardMetrics = (diff, isMobile, isTablet) => {
  const absDiff = Math.abs(diff);
  const sign = diff >= 0 ? 1 : -1;

  if (isMobile) {
    if (absDiff === 0) return { scale: 1.08, x: 0, opacity: 1, zIndex: 50 };
    if (absDiff === 1) return { scale: 0.92, x: sign * 42, opacity: 0.88, zIndex: 40 };
    if (absDiff === 2) return { scale: 0.80, x: sign * 72, opacity: 0.78, zIndex: 30 };
    return { scale: 0.70, x: sign * (72 + (absDiff - 2) * 24), opacity: 0.65, zIndex: Math.max(5, 20 - absDiff) };
  }

  if (isTablet) {
    if (absDiff === 0) return { scale: 1.10, x: 0, opacity: 1, zIndex: 50 };
    if (absDiff === 1) return { scale: 0.94, x: sign * 64, opacity: 0.90, zIndex: 40 };
    if (absDiff === 2) return { scale: 0.82, x: sign * 105, opacity: 0.80, zIndex: 30 };
    return { scale: 0.72, x: sign * (105 + (absDiff - 2) * 34), opacity: 0.68, zIndex: Math.max(5, 20 - absDiff) };
  }

  // Desktop
  if (absDiff === 0) return { scale: 1.14, x: 0, opacity: 1, zIndex: 50 };
  if (absDiff === 1) return { scale: 0.98, x: sign * 82, opacity: 0.92, zIndex: 40 };
  if (absDiff === 2) return { scale: 0.86, x: sign * 138, opacity: 0.82, zIndex: 30 };
  return { scale: 0.76, x: sign * (138 + (absDiff - 2) * 42), opacity: 0.68, zIndex: Math.max(5, 20 - absDiff) };
};

export default function DisplayCards({ 
  cards = [], 
  activeIndex = 3, 
  onSelectIndex 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const containerRef = useRef(null);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wheel scroll navigation: scrolls card by card
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > 12 || Math.abs(e.deltaX) > 12) {
        e.preventDefault();
        e.stopPropagation();

        if (wheelLockRef.current) return;
        wheelLockRef.current = true;
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 130);

        const direction = (e.deltaY > 0 || e.deltaX > 0) ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(cards.length - 1, activeIndex + direction));
        if (nextIndex !== activeIndex && onSelectIndex) {
          if (window.soundFX) window.soundFX.cardHover();
          onSelectIndex(nextIndex);
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeIndex, cards.length, onSelectIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 35) {
      const direction = diff < 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(cards.length - 1, activeIndex + direction));
      if (nextIndex !== activeIndex && onSelectIndex) {
        if (window.soundFX) window.soundFX.cardHover();
        onSelectIndex(nextIndex);
      }
    }
  };

  // Hovering scrolls/selects the card into the middle (no upward lift)
  const handleCardMouseEnter = (index) => {
    if (index !== activeIndex && onSelectIndex) {
      if (window.soundFX) window.soundFX.cardHover();
      onSelectIndex(index);
    }
  };

  // Clicking opens fullscreen modal preview
  const handleCardClick = (card, index) => {
    if (index !== activeIndex && onSelectIndex) {
      onSelectIndex(index);
    }
    if (window.soundFX) window.soundFX.cardSelect();
    if (card.image) {
      setSelectedImage(card.image);
      setSelectedTitle(card.title || "Certificate");
    }
  };

  const handleCloseModal = () => {
    if (window.soundFX) window.soundFX.cardClose();
    setSelectedImage(null);
    setSelectedTitle("");
  };

  useEffect(() => {
    if (!selectedImage) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const isMobile = windowWidth <= 600;
  const isTablet = windowWidth <= 1024 && windowWidth > 600;

  return (
    <div 
      className="display-cards-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="display-cards-grid">
        {cards.map((card, index) => {
          const diff = index - activeIndex;
          const { scale, x, opacity, zIndex } = getCardMetrics(diff, isMobile, isTablet);
          const isCurrentActive = diff === 0;

          return (
            <DisplayCard
              key={index}
              {...card}
              isActive={isCurrentActive}
              onMouseEnter={() => handleCardMouseEnter(index)}
              onClick={() => handleCardClick(card, index)}
              style={{
                transform: `translateX(${x}px) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
              }}
            />
          );
        })}
      </div>

      {/* Certificate Fullscreen Preview Modal via Portal to document.body */}
      {selectedImage && typeof document !== "undefined" && createPortal(
        <div 
          className="cert-modal-backdrop" 
          onClick={handleCloseModal}
        >
          <div 
            className="cert-modal-dialog" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cert-modal-header">
              <span className="cert-modal-title">// CERTIFICATE: {selectedTitle}</span>
              <button 
                type="button" 
                className="cert-modal-close-btn" 
                onClick={handleCloseModal}
              >
                [CLOSE ✕]
              </button>
            </div>
            <div className="cert-modal-img-container">
              <img 
                src={selectedImage} 
                alt={selectedTitle} 
                className="cert-modal-img" 
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
