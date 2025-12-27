"use client";

import type { Components } from "react-markdown";
import { MediaImage, MediaGallery, MediaVideo, MediaAudio } from "./media";

// Custom component wrapper types
interface MediaImageComponentProps {
  id?: string;
  className?: string;
  sizes?: string;
  showcaption?: string;
}

interface MediaGalleryComponentProps {
  ids?: string;
  columns?: string;
  gap?: string;
  showcaptions?: string;
}

interface MediaVideoComponentProps {
  id?: string;
  autoplay?: string;
  controls?: string;
  loop?: string;
  muted?: string;
  className?: string;
}

interface MediaAudioComponentProps {
  id?: string;
  showwaveform?: string;
  className?: string;
}

// Component wrapper for MediaImage that handles string props from HTML
function MediaImageWrapper({ id, className, sizes, showcaption }: MediaImageComponentProps) {
  if (!id) return null;
  return (
    <MediaImage
      id={id}
      className={className}
      sizes={sizes}
      showCaption={showcaption !== "false"}
    />
  );
}

// Component wrapper for MediaGallery
function MediaGalleryWrapper({ ids, columns, gap, showcaptions }: MediaGalleryComponentProps) {
  if (!ids) return null;
  return (
    <MediaGallery
      ids={ids}
      columns={columns ? (parseInt(columns, 10) as 2 | 3 | 4) : 3}
      gap={gap as "sm" | "md" | "lg" | undefined}
      showCaptions={showcaptions === "true"}
    />
  );
}

// Component wrapper for MediaVideo
function MediaVideoWrapper({
  id,
  autoplay,
  controls,
  loop,
  muted,
  className,
}: MediaVideoComponentProps) {
  if (!id) return null;
  return (
    <MediaVideo
      id={id}
      autoplay={autoplay === "true"}
      controls={controls !== "false"}
      loop={loop === "true"}
      muted={muted === "true"}
      className={className}
    />
  );
}

// Component wrapper for MediaAudio
function MediaAudioWrapper({ id, className }: MediaAudioComponentProps) {
  if (!id) return null;
  return <MediaAudio id={id} className={className} />;
}

// Components map for ReactMarkdown
// These match HTML tag names that can be used in markdown
// Cast to Components since these are custom elements not in the standard HTML spec
export const markdownMediaComponents = {
  // PascalCase versions (for JSX-style usage in MDX)
  MediaImage: MediaImageWrapper,
  MediaGallery: MediaGalleryWrapper,
  MediaVideo: MediaVideoWrapper,
  MediaAudio: MediaAudioWrapper,
  // lowercase versions (for HTML-style usage in markdown with rehype-raw)
  mediaimage: MediaImageWrapper,
  mediagallery: MediaGalleryWrapper,
  mediavideo: MediaVideoWrapper,
  mediaaudio: MediaAudioWrapper,
} as Partial<Components>;
