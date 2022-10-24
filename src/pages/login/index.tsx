import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Card, Layout } from "@douyinfe/semi-ui";
import React, { useEffect } from "react";
import LoginForm from "./form";
import styles from "./style/index.module.less";

Login.displayName = "LoginPage";


export default function Login() {
  useEffect(() => {
    document.body.setAttribute("theme-mode", "light");
  }, []);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header} />
      <Layout.Content className={styles.content}>
        <Card shadows="always" bordered={false} className={styles.card} bodyStyle={{ backgroundColor: "transparent" }}>
          <LoginForm />
        </Card>
      </Layout.Content>
      <Footer className={styles.footer} />
    </Layout>
  );
}
