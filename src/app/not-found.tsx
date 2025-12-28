import Link from "next/link";
import { Button } from "@/components/ui/button";

// Floating code symbols for the background
const floatingSymbols = [
  { symbol: "{ }", top: "10%", left: "5%", delay: "0s", duration: "6s" },
  { symbol: "</>", top: "20%", right: "10%", delay: "1s", duration: "7s" },
  { symbol: "//", top: "60%", left: "8%", delay: "2s", duration: "5s" },
  { symbol: "=>", top: "70%", right: "15%", delay: "0.5s", duration: "8s" },
  { symbol: "[ ]", top: "40%", left: "3%", delay: "3s", duration: "6s" },
  { symbol: "( )", top: "30%", right: "5%", delay: "1.5s", duration: "7s" },
  { symbol: "&&", top: "80%", left: "20%", delay: "2.5s", duration: "5s" },
  { symbol: "||", top: "15%", right: "25%", delay: "0s", duration: "9s" },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Floating symbols */}
      {floatingSymbols.map((item, index) => (
        <div
          key={index}
          className="absolute text-4xl md:text-6xl font-mono text-muted-foreground/20 select-none pointer-events-none"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animation: `float ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* 404 with gradient */}
        <h1
          className="text-[8rem] md:text-[12rem] font-bold leading-none text-gradient"
          style={{
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        >
          404
        </h1>

        {/* Playful message */}
        <p className="text-xl md:text-2xl text-muted-foreground mt-4 mb-2">
          Page not found
        </p>
        <p className="text-base md:text-lg text-muted-foreground/80 mb-8 max-w-md mx-auto">
          Looks like this page wandered off into the void.
          <br />
          Maybe it&apos;s debugging itself somewhere.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Take me home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.4;
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 20px rgba(37, 99, 235, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(37, 99, 235, 0.5));
          }
        }
      `}</style>
    </div>
  );
}
