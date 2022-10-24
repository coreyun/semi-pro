import { GlobalContext } from "@/context";
import defaultLocale from "@/locale/index.json";
import { RootState } from "@/store";
import useLocale from "@/utils/useLocale";
import useStorage from "@/utils/useStorage";
import { IconLanguage, IconMoon, IconQuit, IconSemiLogo, IconSetting, IconSun, IconUser } from "@douyinfe/semi-icons";
import { Avatar, Button, Dropdown, Layout, Nav, Space, Toast, Tooltip, Typography } from "@douyinfe/semi-ui";
import { BasicProps } from "@douyinfe/semi-ui/lib/es/layout";
import cs from "classnames";
import Router from "next/router";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import styles from "./style/index.module.less";


export default function Header(props: BasicProps = {}) {
  const { className, style, ...restProps } = props;

  const { Title } = Typography;

  const t = useLocale();
  const { setLang, lang, setTheme, theme } = useContext(GlobalContext);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [userStatus, setUserStatus] = useStorage("userStatus");

  async function logout() {
    setUserStatus("logout");
    await Router.push("/login");
  }

  async function onLogoutItemClick() {
    await logout();
  }

  function renderHeader() {
    return <>
      <Space><IconSemiLogo size="extra-large" style={{ color: "var(--semi-color-text-0)" }} /><Title heading={4}>{t["navbar.title"]}</Title></Space>
    </>;
  }

  function changeLanguageHandle() {
    let langKey: string;
    if (lang == "zh-CN") {
      setLang("en-US");
      langKey = "en-US";
    } else {
      setLang("zh-CN");
      langKey = "zh-CN";
    }
    const nextLang = defaultLocale[lang];
    Toast.info(
      `${nextLang["message.lang.tips"]}${nextLang[langKey]}`
    );
  }

  function changeThemeHandle() {
    let themeKey: string;
    if (theme == "light") {
      setTheme("dark");
      themeKey = "dark";
    } else {
      setTheme("light");
      themeKey = "light";
    }
    Toast.info(`${t["message.theme.tips"]}${t[themeKey]}`);
  }

  function renderFooter() {
    return <>
      <Space>
        <Tooltip position="bottomRight" content={`${t["message.lang.tips"]}${t[lang == "zh-CN" ? "en-US" : "zh-CN"]}`}>
          <Button theme="borderless" icon={<IconLanguage />} onClick={changeLanguageHandle}>{t[lang]}</Button>
        </Tooltip>
        <Tooltip position="bottomRight" content={`${t["message.theme.tips"]}${t[theme == "light" ? "dark" : "light"]}`}>
          <Button theme="borderless" icon={theme == "light" ? <IconSun /> : <IconMoon />} onClick={changeThemeHandle}></Button>
        </Tooltip>
      </Space>
      {userStatus == "login" && (
        <Dropdown
          position="bottomRight"
          render={
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => Router.push("/exampleUser/info")}>
                <IconUser className={styles["dropdown-icon"]}/>
                {t["navbar.userInfo"]}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => Router.push("/exampleUser/setting")}>
                <IconSetting className={styles["dropdown-icon"]} />
                {t["navbar.userSetting"]}
              </Dropdown.Item>
              <Dropdown.Item onClick={onLogoutItemClick}>
                <IconQuit className={styles["dropdown-icon"]} />
                {t["navbar.logout"]}
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Avatar size="small" className={styles.avatar}>
            <img alt="avatar" src={userInfo.avatar} />
          </Avatar>
        </Dropdown>
      )}
    </>
  }

  return (
    <Layout.Header className={cs(styles.header, className)} {...restProps} style={style}>
      <Nav className={styles.nav} mode="horizontal" header={renderHeader()} footer={renderFooter()} />
    </Layout.Header>
  );
}
