import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <main className="flex-1">
        <section className="container px-4 py-32 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-6xl font-bold text-black ">
              A better way to track your job applications
            </h1>
            <p className="mb-10 text-xl text-muted-foreground">
              Capture, organize, and manage your job applications in one place.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg font-medium">
                  Start for free <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
