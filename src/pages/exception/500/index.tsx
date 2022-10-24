import useLocale from "@/utils/useLocale";
import { IllustrationFailure } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
import React from "react";
import locale from "./locale/index.json";

export default function Exception500() {
  const t = useLocale(locale);

  return (
    <Empty
      image={<IllustrationFailure style={{ width: 150, height: 150 }} />}
      title="500"
      description={t["exception.result.500.description"]}
    />
  );
}
