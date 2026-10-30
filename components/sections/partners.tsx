import { Hexagon } from "lucide-react";

import { siteConfig } from "@/site.config";
import { Container } from "@/components/layout/container";

/** 히어로 아래 '함께한 곳' 이름 줄. 이름은 site.config.ts 의 partners 에서 바꿉니다. */
export function Partners() {
  const { partners } = siteConfig;

  return (
    <section className="py-12">
      <Container>
        <p className="text-center text-sm text-muted-foreground">{partners.title}</p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.names.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 text-base font-semibold text-muted-foreground/70"
            >
              <Hexagon className="size-5" />
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
