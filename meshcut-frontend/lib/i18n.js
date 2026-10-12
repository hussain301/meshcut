// i18n skeleton for MeshCut — imported by app/page.js as `import { t } from "../lib/i18n";`
// Pure JS, no dependencies.

export const SUPPORTED_LANGS = ['en', 'ur'];

export const STRINGS = {
  en: {
    tagline: "Edit videos online, right in your browser.",
    subtitle: "Upload, trim, merge, add text and filters, then export — no install needed.",
  },
  ur: {
    tagline: "Browser me hi video edit karo, online.",
    subtitle: "Upload, trim, merge, text aur filters lagao, phir export karo — install ki zaroorat nahi.",
  },
};

export function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}
