import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers (next-intl v4). `Link` keeps/switches the
// locale prefix; `usePathname` returns the pathname without the prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
