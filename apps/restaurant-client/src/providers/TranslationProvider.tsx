"use client";
import { IntlProvider } from "react-intl";

import messages_en from "../locales/en.json";

const messages = {
  en: messages_en,
};

const locale = "en";

export const TranslationProvider = ({ children }: { children: JSX.Element }) => {
	return (
		<IntlProvider locale={locale} messages={messages[locale]}>
			{children}
		</IntlProvider>
	)
};
