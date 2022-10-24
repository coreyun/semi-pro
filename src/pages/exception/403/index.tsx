import useLocale from "@/utils/useLocale";
import { IllustrationNoAccess } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
import React from "react";
import locale from "./locale/index.json";

export default function Exception403() {
  const t = useLocale(locale);

  return (
    <Empty
      image={<IllustrationNoAccess style={{ width: 150, height: 150 }} />}
      title="403"
      description={t["exception.result.403.description"]}
    />
  );
}
