import { PUBLIC_CONFIG } from "~/config";


export const loader = () => {
  const robotText = `User-agent: *\nAllow: /\nSitemap:${PUBLIC_CONFIG.DOMAIN_NAME}/sitemap-index.xml`
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    }
  });
};