import { isSSR } from "@/utils/is";
import Mock from "mockjs";

import "./user";

if (!isSSR) {
  Mock.setup({
    timeout: "500-1500"
  });
}
