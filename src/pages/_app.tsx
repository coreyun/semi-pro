import { GlobalContext } from "@/context";
import { store } from "@/store";
import { updateUserInfo } from "@/store/user";
import changeTheme from "@/utils/changeTheme";
import checkLogin from "@/utils/checkLogin";
import useStorage from "@/utils/useStorage";
import { ConfigProvider } from "@douyinfe/semi-ui";
import enUS from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import zhCN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import axios from "axios";
import cookies from "next-cookies";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { useEffect, useMemo } from "react";
import { AliveScope } from "react-activation";
import { Provider } from "react-redux";
import "../mock";
import "../style/global.less";
import Layout from "./layout";

interface RenderConfig {
  semiLang?: string;
  semiTheme?: string;
}

export default function App({
                              pageProps,
                              Component,
                              renderConfig
                            }: AppProps & { renderConfig: RenderConfig }) {
  const { semiLang, semiTheme } = renderConfig;
  const [lang, setLang] = useStorage("semi-lang", semiLang || "zh-CN");
  const [theme, setTheme] = useStorage("semi-theme", semiTheme || "light");
  const router = useRouter();
  const locale = useMemo(() => {
    switch (lang) {
      case "zh-CN":
        return zhCN;
      case "en-US":
        return enUS;
      default:
        return enUS;
    }
  }, [lang]);

  function fetchUserInfo() {
    axios.get("/api/user/userInfo").then((res) => {
      store.dispatch(updateUserInfo({ userInfo: res.data, userLoading: false }));
    });
  }

  useEffect(() => {
    if (checkLogin()) {
      fetchUserInfo();
    } else if (window.location.pathname.replace(/\//g, "") !== "login") {
      window.location.pathname = "/login";
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      NProgress.set(0.4);
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    document.cookie = `semi-lang=${lang}; path=/`;
    document.cookie = `semi-theme=${theme}; path=/`;
    changeTheme(theme);
  }, [lang, theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme
  };

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/favicon.ico"
        />
        <title>Semi Pro</title>
      </Head>
      <ConfigProvider locale={locale}>
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <AliveScope>
              {Component.displayName === "LoginPage" ? (
                <Component {...pageProps} suppressHydrationWarning />
              ) : (
                <Layout>
                  <Component {...pageProps} suppressHydrationWarning />
                </Layout>
              )}
            </AliveScope>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </>
  );
}

// fix: next build ssr can't attach the localstorage
App.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const serverCookies = cookies(ctx);
  return {
    renderConfig: {
      semiLang: serverCookies["semi-lang"],
      semiTheme: serverCookies["semi-theme"]
    }
  };
};
