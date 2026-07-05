import polyglotI18nProvider from "ra-i18n-polyglot";
import portugueseMessages from "ra-language-portuguese";

export const i18nProvider = polyglotI18nProvider(() => portugueseMessages, "pt");
