import useLocale from "@/utils/useLocale";
import { IllustrationNotFound } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
import React from "react";
import locale from "./locale/index.json";

export default function Exception404() {
  const t = useLocale(locale);

  return (
    <Empty
      image={<IllustrationNotFound style={{ width: 150, height: 150 }} />}
      title="404"
      description={t["exception.result.404.description"]}
    />
  );
}
