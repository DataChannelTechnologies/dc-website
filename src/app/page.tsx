import { Hero } from "@/components/sections/hero";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { Platform } from "@/components/sections/platform";
import { Neo } from "@/components/sections/neo";
import { Activation } from "@/components/sections/activation";
import { Testimonials } from "@/components/sections/testimonials";
import { Trust } from "@/components/sections/trust";
import { CtaCards } from "@/components/sections/cta-cards";
import { Webinar } from "@/components/sections/webinar";
import { Blog } from "@/components/sections/blog";
import { homeContent as c } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero hero={c.hero} stats={c.stats} reviews={c.reviews} />
      <LogoCloud logos={c.logos} />
      <Platform platform={c.platform} />
      <Neo neo={c.neo} />
      <Activation activation={c.activation} />
      <Testimonials testimonials={c.testimonials} />
      <Trust trust={c.trust} />
      <Webinar webinar={c.webinar} />
      <Blog blog={c.blog} />
      <CtaCards ctaCards={c.ctaCards} />
    </>
  );
}
