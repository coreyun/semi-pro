import { GlobalContext } from "@/context";
import defaultLocale from "@/locale/index.json";
import { useContext } from "react";


export default function useLocale(locale = null) {
  const { lang } = useContext(GlobalContext);

  return (locale || defaultLocale)[lang] || {};
}
