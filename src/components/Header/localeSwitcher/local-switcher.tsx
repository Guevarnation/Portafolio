"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import FlagIcon from "./flag-icon";

const LocaleSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
    router.refresh();
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left bg-transparent pt-2">
      <button
        onClick={handleToggle}
        type="button"
        className="inline-flex items-center justify-center w-full text-sm font-medium text-gray-700 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FlagIcon countryCode={locale === "en" ? "US" : "MX"} />
        <svg
          className="ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <button
              onClick={() => switchLocale("en")}
              className={`block px-4 py-2 text-sm ${
                locale === "en" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
              role="menuitem"
              tabIndex={-1}
            >
              <FlagIcon countryCode="US" className="mr-2" />
              English
            </button>
            <button
              onClick={() => switchLocale("es")}
              className={`block px-4 py-2 text-sm ${
                locale === "es" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
              role="menuitem"
              tabIndex={-1}
            >
              <FlagIcon countryCode="MX" className="mr-2" />
              Español
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;
