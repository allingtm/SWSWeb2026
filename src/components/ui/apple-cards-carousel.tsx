"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: React.ReactNode[];
  initialScroll?: number;
}

type Card = {
  title: string;
  category: string;
  content: React.ReactNode;
  /** Short line shown on the card face, beneath the title. */
  description?: string;
  /** Background image. When omitted, `gradient` and `icon` are used instead. */
  src?: string;
  /** Tailwind gradient classes, e.g. "from-blue-700 to-cyan-500". */
  gradient?: string;
  icon?: React.ElementType;
  /**
   * Short labels shown on the card face. Desktop only — the mobile card is too
   * narrow for a multi-word tag to sit on one line. The full set still renders
   * inside the card's expanded content.
   */
  tags?: string[];
};

// Enough to signal the breadth of a project without the pills crowding out the
// description on the longest cards. The rest are counted in a "+N" pill.
const FACE_TAG_LIMIT = 4;

const FACE_TAG_CLASS =
  "rounded-md border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm";

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Card pitch (width + flex gap) measured from the DOM. Hardcoding it means
  // the arrows advance by less than a card at some breakpoint, which reads as
  // "the carousel is stuck at the end".
  const getCardStep = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!first) return 300;
    const second = track?.children[1] as HTMLElement | undefined;
    return second
      ? second.offsetLeft - first.offsetLeft
      : first.offsetWidth;
  }, []);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [initialScroll, checkScrollability]);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -getCardStep(), behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: getCardStep(), behavior: "smooth" });
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: getCardStep() * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-16 [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            ref={trackRef}
            className="flex flex-row justify-start gap-4 pl-4 md:pl-8"
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 * index,
                  ease: "easeOut",
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[10%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Edge fades hint at more content off-screen */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-30 w-8 bg-gradient-to-r from-background/50 to-transparent transition-opacity md:w-16",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-30 w-8 bg-gradient-to-l from-background/50 to-transparent transition-opacity md:w-16",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />

        <div className="flex justify-end gap-2 px-4 md:px-8">
          <button
            type="button"
            aria-label="Previous projects"
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/60 transition hover:border-primary/50 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            type="button"
            aria-label="Next projects"
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/60 transition hover:border-primary/50 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ArrowRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);
  const Icon = card.icon;

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [onCardClose, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              role="dialog"
              aria-modal="true"
              aria-label={card.title}
              className="relative z-[60] mx-auto my-10 h-fit max-w-3xl rounded-3xl border border-border bg-card p-6 md:p-10"
            >
              <button
                type="button"
                aria-label="Close"
                className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground"
                onClick={handleClose}
              >
                <X className="h-5 w-5 text-background" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-sm font-medium uppercase tracking-wider text-primary"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-3 text-2xl font-bold text-foreground md:text-4xl"
              >
                {card.title}
              </motion.p>
              <div className="py-8">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        aria-label={`${card.title} - read more`}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-muted md:h-[30rem] md:w-96"
      >
        {card.src ? (
          <BlurImage
            src={card.src}
            alt={card.title}
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 z-10 bg-gradient-to-br",
              card.gradient
            )}
          >
            {Icon && (
              <Icon
                className="absolute -bottom-8 -right-8 h-44 w-44 text-white/10"
                strokeWidth={1}
              />
            )}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="relative z-40 flex h-full w-full flex-col p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left text-sm font-medium uppercase tracking-wider text-white md:text-base"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left text-xl font-semibold [text-wrap:balance] text-white md:text-2xl"
          >
            {card.title}
          </motion.p>
          {card.description && (
            <p className="mt-3 max-w-xs text-left text-sm leading-relaxed text-white/85 md:text-base">
              {card.description}
            </p>
          )}
          {card.tags && card.tags.length > 0 && (
            <ul className="mt-auto hidden flex-wrap gap-2 pt-6 md:flex">
              {card.tags.slice(0, FACE_TAG_LIMIT).map((tag) => (
                <li key={tag} className={FACE_TAG_CLASS}>
                  {tag}
                </li>
              ))}
              {card.tags.length > FACE_TAG_LIMIT && (
                <li className={FACE_TAG_CLASS}>
                  +{card.tags.length - FACE_TAG_LIMIT}
                </li>
              )}
            </ul>
          )}
        </div>
      </motion.button>
    </>
  );
};

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const BlurImage = ({ src, className, alt, ...rest }: BlurImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fill image with unknown intrinsic size
    <img
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      loading="lazy"
      decoding="async"
      alt={alt}
      {...rest}
    />
  );
};
