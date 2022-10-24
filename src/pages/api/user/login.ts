import { NextApiRequest, NextApiResponse } from "next";

export default function Login(req: NextApiRequest, res: NextApiResponse) {
  const { userName, password } = req.body;
  if (!userName) {
    return res.json({
      status: "error",
      msg: "用户名不能为空"
    });
  }
  if (!password) {
    return res.json({
      status: "error",
      msg: "密码不能为空"
    });
  }
  if (userName === "admin" && password === "admin") {
    return res.json({
      status: "ok"
    });
  }
  return res.json({
    status: "error",
    msg: "账号或者密码错误"
  });
}
