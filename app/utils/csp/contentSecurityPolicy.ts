import { getCSP, NONE, STRICT_DYNAMIC, UNSAFE_INLINE } from 'csp-header';


export const contentSecurityPolicy = (nonce: string): string => {
  return getCSP({
    directives: {
      'script-src': [
        `${UNSAFE_INLINE} ${STRICT_DYNAMIC} https: 'nonce-${nonce}'`
      ],
      'object-src': [NONE],
      'base-uri': [NONE],
    }
  });
};