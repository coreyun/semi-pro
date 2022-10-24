import { generatePermission } from "@/routes";
import Mock from "mockjs";
import { NextApiRequest, NextApiResponse } from "next";

export default function UserInfo(req: NextApiRequest, res: NextApiResponse) {
  return res.json(Mock.mock({
    name: "王立群",
    avatar: "https://lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png",
    email: "wangliqun@email.com",
    job: "frontend",
    jobName: "前端开发工程师",
    organization: "Frontend",
    organizationName: "前端",
    location: "beijing",
    locationName: "北京",
    introduction: "王力群并非是一个真实存在的人。",
    personalWebsite: "https://www.semi.design",
    verified: true,
    phoneNumber: /177[*]{6}[0-9]{2}/,
    accountId: /[a-z]{4}[-][0-9]{8}/,
    registrationTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    permissions: generatePermission("admin")
  }));
}
