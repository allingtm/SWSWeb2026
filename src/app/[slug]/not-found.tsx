import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </Container>
  );
}
