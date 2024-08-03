import { contentSecurityPolicy } from "./contentSecurityPolicy";

// https://owasp.org/www-project-secure-headers/ci/headers_remove.json
const headersToClear = Object.freeze({
  "last_update_utc": "2024-05-19 14:06:22",
  "headers": [
    "$wsep",
    "Host-Header",
    "K-Proxy-Request",
    "Liferay-Portal",
    "OracleCommerceCloud-Version",
    "Pega-Host",
    "Powered-By",
    "Product",
    "Server",
    "SourceMap",
    "X-AspNet-Version",
    "X-AspNetMvc-Version",
    "X-Atmosphere-error",
    "X-Atmosphere-first-request",
    "X-Atmosphere-tracking-id",
    "X-B3-ParentSpanId",
    "X-B3-Sampled",
    "X-B3-SpanId",
    "X-B3-TraceId",
    "X-BEServer",
    "X-CF-Powered-By",
    "X-CMS",
    "X-CalculatedBETarget",
    "X-Cocoon-Version",
    "X-Content-Encoded-By",
    "X-DiagInfo",
    "X-Envoy-Attempt-Count",
    "X-Envoy-External-Address",
    "X-Envoy-Internal",
    "X-Envoy-Original-Dst-Host",
    "X-Envoy-Upstream-Service-Time",
    "X-FEServer",
    "X-Framework",
    "X-Generated-By",
    "X-Generator",
    "X-Kubernetes-PF-FlowSchema-UI",
    "X-Kubernetes-PF-PriorityLevel-UID",
    "X-LiteSpeed-Cache",
    "X-LiteSpeed-Purge",
    "X-LiteSpeed-Tag",
    "X-LiteSpeed-Vary",
    "X-Litespeed-Cache-Control",
    "X-Mod-Pagespeed",
    "X-Nextjs-Cache",
    "X-Nextjs-Matched-Path",
    "X-Nextjs-Page",
    "X-Nextjs-Redirect",
    "X-OWA-Version",
    "X-Old-Content-Length",
    "X-OneAgent-JS-Injection",
    "X-Page-Speed",
    "X-Php-Version",
    "X-Powered-By",
    "X-Powered-By-Plesk",
    "X-Powered-CMS",
    "X-Redirect-By",
    "X-Server-Powered-By",
    "X-SourceFiles",
    "X-SourceMap",
    "X-Turbo-Charged-By",
    "X-Umbraco-Version",
    "X-Varnish-Backend",
    "X-Varnish-Server",
    "X-dtAgentId",
    "X-dtHealthCheck",
    "X-dtInjectedServlet",
    "X-ruxit-JS-Agent"
  ]
})


export const securityHeaders = (nonce: string): Headers => {
  const owaspHeaders = new Headers();
  owaspHeaders.set('Content-Security-Policy', contentSecurityPolicy(nonce));
  owaspHeaders.set('Cross-Origin-Embedder-Policy', 'same-origin');
  owaspHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
  owaspHeaders.set('Cross-Origin-Resource-Policy', 'same-origin');
  owaspHeaders.set('Origin-Agent-Cluster', '?1');
  owaspHeaders.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
  owaspHeaders.set('Referrer-Policy', 'origin-when-cross-origin');
  owaspHeaders.set('X-Content-Type-Options', 'nosniff');
  owaspHeaders.set('X-DNS-Prefetch-Control', 'off');
  owaspHeaders.set('X-Download-Options', 'noopen');
  owaspHeaders.set('X-Frame-Options', 'SAMEORIGIN');
  owaspHeaders.set('X-Permitted-Cross-Domain-Policies', 'none');
  owaspHeaders.set('X-XSS-Protection', '0');
  owaspHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  return owaspHeaders;
};

export const addSecurityHeaders = (headers: Headers, nonce: string): Headers => {
  const owaspHeaders = securityHeaders(nonce);

  owaspHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
};

export const sanitizeHeaders = (headers: Headers): Headers => {
  headersToClear.headers.forEach((header) => {
    headers.delete(header);
  });

  return headers;
};
