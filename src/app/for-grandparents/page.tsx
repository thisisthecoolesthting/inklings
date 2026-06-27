import { AudienceLanding } from "@/components/marketing/AudienceLanding";
import { getAudienceLanding } from "@/content/audience-landings";
import { pageMetadata } from "@/lib/seo";

const config = getAudienceLanding("for-grandparents")!;

export const metadata = pageMetadata({
  title: config.metaTitle,
  description: config.metaDescription,
  path: config.path,
});

export default function ForGrandparentsPage() {
  return <AudienceLanding config={config} />;
}
