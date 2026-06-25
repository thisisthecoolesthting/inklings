import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export function KidDemoVideo() {
  return (
    <section className="section bg-cream-100">
      <div className="container-ink">
        <div className="section-header-center">
          <span className="eyebrow">See it in action</span>
          <h2 className="section-title">A kid makes a book in about 20 minutes</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Tap choices with Sparky, watch illustrated pages appear, then ask a grown-up to approve and order a printed copy.
          </p>
        </div>
        <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-card shadow-card">
          <div className="relative aspect-video bg-ink">
            <Image
              src="/images/marketing/kid-creating-tablet.jpg"
              alt="Child creating an illustrated storybook with Inklings on a tablet"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/35">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral text-white shadow-lg">
                <Play className="ml-1 h-8 w-8" aria-hidden />
              </span>
              <p className="mt-4 text-lg font-semibold text-cream-100">Try it yourself — free first book</p>
              <Link href="/trial" className="btn-primary mt-4">
                Create your first book free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
