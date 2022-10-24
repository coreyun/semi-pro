import settings from "@/settings.json";
import useLocale from "@/utils/useLocale";
import useStorage from "@/utils/useStorage";
import { Button, Divider, Form, Toast, useFormApi } from "@douyinfe/semi-ui";
import axios from "axios";
import Router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import locale from "./locale/index.json";
import styles from "./style/form.module.less";

export default function LoginForm() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage("loginParams");

  const t = useLocale(locale);

  const [rememberPassword, setRememberPassword] = useState(!!loginParams);

  async function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
    } else {
      removeLoginParams();
    }
    // 记录登录状态
    localStorage.setItem("userStatus", "login");
    // 跳转首页
    await Router.push(settings.home);
  }

  function login(params) {
    setLoading(true);
    axios
      .post("/api/user/login", params)
      .then(async (res) => {
        const { status, msg } = res.data;
        if (status === "ok") {
          await afterLoginSuccess(params);
        } else {
          Toast.error(msg || t["login.form.login.errMsg"]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const SubmitButton = () => {
    const formApi = useFormApi();

    const onSubmitClick = () => {
      formApi.validate().then((values) => {
        login(values);
      });
    };

    return <Button size="large" theme="solid" type="primary" block onClick={onSubmitClick} loading={loading} className={styles.submitButton}>
      {t["login.form.login"]}
    </Button>;
  };

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(loginParams);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      formRef.current.formApi.setValues(parseParams);
    }
  }, [loginParams]);

  return (
    <Form
      labelPosition="inset"
      layout="vertical"
      ref={formRef}
      initValues={{ userName: "admin", password: "admin" }}
    >
      <Form.Section text={t["login.form.title"]} className={styles.title}>
        <Form.Input
          size="large"
          label={t["login.form.userName"]}
          field="userName"
          rules={[{ required: true, message: t["login.form.userName.errMsg"] }]}
          placeholder={t["login.form.userName.placeholder"]}
        />
        <Form.Input
          size="large"
          label={t["login.form.password"]}
          field="password"
          rules={[{ required: true, message: t["login.form.password.errMsg"] }]}
          placeholder={t["login.form.password.placeholder"]}
        />
        <SubmitButton />
        <Divider margin={20}>or</Divider>
        <Button theme="borderless" type="tertiary" block>
          {t["login.form.register"]}
        </Button>
      </Form.Section>
    </Form>
  );
}
