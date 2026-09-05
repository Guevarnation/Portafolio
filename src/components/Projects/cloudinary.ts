// Cloudinary delivery transforms shared by the full project cards
// (Projects.jsx) and the compact "More work" row (ProjectRow.tsx): best
// format/quality for the client, capped width. Posters are the first frame
// (so_0) of the same asset; f_auto lets Cloudinary pick AVIF/WebP for the
// poster too (verified: every poster URL still returns 200 with it).
const VIDEO_TRANSFORM = "f_auto,q_auto";
const POSTER_TRANSFORM = "so_0,q_auto,f_auto";

// The card poster only shows until the video (auto-played once in view) has
// its first frame, and the slot is at most 700 CSS px wide, so 800 px is
// plenty: it halves poster bytes versus w_1200 (measured 60 KB -> 32 KB webp).
export const POSTER_MAX_WIDTH = 800;

export interface PosterOptions {
  /** Upper bound for the requested width (default: POSTER_MAX_WIDTH). */
  maxWidth?: number;
  /**
   * Extra parameters for the same transformation component, e.g. a crop
   * (`c_fill,g_south,ar_1.77`). Keep them in one component: Cloudinary applies
   * the last crop mode listed, so `c_fill` and `c_limit` together do not stack.
   */
  transform?: string;
}

export function cloudinaryVideo(url: string, width: number): string {
  return url.replace(
    "/video/upload/",
    `/video/upload/${VIDEO_TRANSFORM},w_${width}/`,
  );
}

export function cloudinaryPoster(
  url: string,
  width: number,
  { maxWidth = POSTER_MAX_WIDTH, transform }: PosterOptions = {},
): string {
  const w = Math.min(width, maxWidth);
  const params = [POSTER_TRANSFORM, transform, `w_${w}`]
    .filter(Boolean)
    .join(",");
  return url
    .replace("/video/upload/", `/video/upload/${params}/`)
    .replace(/\.(mp4|mov)$/, ".jpg");
}
