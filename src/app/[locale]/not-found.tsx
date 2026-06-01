import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mt-10 text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 opacity-70">{t("description")}</p>
    </div>
  );
}
