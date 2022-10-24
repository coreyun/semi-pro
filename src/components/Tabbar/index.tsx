import { RootState } from "@/store";
import { removeNextTabs, removeOtherTabs, removeTab } from "@/store/tabbar";
import useLocale from "@/utils/useLocale";
import { IconClose, IconRefresh } from "@douyinfe/semi-icons";
import { Button, Dropdown, Space, Toast } from "@douyinfe/semi-ui";
import { BasicProps } from "@douyinfe/semi-ui/lib/es/layout";
import cs from "classnames";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useAliveController } from "react-activation";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style/index.module.less";


let scrollToTabTimer = null;

export function scrollToTab(key) {
  if (scrollToTabTimer) {
    clearTimeout(scrollToTabTimer);
  }

  scrollToTabTimer = setTimeout(() => {
    const item = document.querySelector(`[data-key="${key}"]`);
    if (item) {
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    clearTimeout(scrollToTabTimer);
    scrollToTabTimer = null;
  }, 100);
}

export default function Tabbar(props: BasicProps = {}) {
  const {className, style, ...restProps} = props;

  const t = useLocale();
  const dispatch = useDispatch();
  const {refresh} = useAliveController();
  const {tabs, currentKey, currentIndex} = useSelector((state: RootState) => state.tabbar);

  const [tabbar, setTabbar] = useState([]);
  const [navMenuIndex, setNavMenuIndex] = useState<number>(-1);

  async function refreshTabHandle(i) {
    setNavMenuIndex(-1);
    await refresh(tabs[i].key);
  }

  async function removeTabHandle(i) {
    setNavMenuIndex(-1);
    if (tabs.length <= 1) {
      Toast.info(t["message.tabbar.close.tips"]);
    } else {
      dispatch(removeTab(i));
      if (currentIndex == i) {
        if (i == 0) {
          await Router.push(tabs[i + 1].path);
        } else {
          await Router.push(tabs[i - 1].path);
        }
      }
    }
  }

  async function removeNextTabsHandle(i) {
    setNavMenuIndex(-1);
    dispatch(removeNextTabs(i));
    if (currentIndex > i) {
      await Router.push(tabs[i].path);
    }
  }

  async function removeOtherTabsHandle(i) {
    setNavMenuIndex(-1);
    dispatch(removeOtherTabs(i));
    if (currentIndex != i) {
      await Router.push(tabs[i].path);
    }
  }

  function updateTabbar() {
    const tabbar = tabs.map((tab, i) => {
      return <Dropdown
          key={`dropdown-${i}`}
          trigger={"custom"}
          position={"bottom"}
          visible={navMenuIndex == i}
          onEscKeyDown={() => {
            setNavMenuIndex(-1);
          }}
          onClickOutSide={() => {
            setNavMenuIndex(-1);
          }}
          render={
            <Dropdown.Menu>
              <Dropdown.Item className={styles.menuItem} onClick={() => refreshTabHandle(i)} icon={
                <IconRefresh size="small"/>}>刷新</Dropdown.Item>
              <Dropdown.Divider/>
              <Dropdown.Item className={styles.menuItem} onClick={() => removeTabHandle(i)} icon={
                <IconClose size="small"/>}>关闭当前标签页</Dropdown.Item>
              <Dropdown.Item className={styles.menuItem} onClick={() => removeNextTabsHandle(i)} icon={
                <IconClose size="small" style={{visibility: "hidden"}}/>}>关闭右侧标签页</Dropdown.Item>
              <Dropdown.Item className={styles.menuItem} onClick={() => removeOtherTabsHandle(i)} icon={
                <IconClose size="small" style={{visibility: "hidden"}}/>}>关闭其他标签页</Dropdown.Item>
            </Dropdown.Menu>
          }
      >
        <Button
            theme={currentKey == tab.key ? "solid" : "light"}
            type={currentKey == tab.key ? "primary" : "tertiary"}
            data-key={tab.key}
          key={`button-${i}`}
          onContextMenu={e => {
            e.preventDefault();
            setNavMenuIndex(i);
          }}
          icon={<IconClose size="small" onClick={async (e) => {
            e.stopPropagation();
            await removeTabHandle(i);
          }} />}
          iconPosition="right"
          onClick={async () => {
            setNavMenuIndex(-1);
            if (currentKey != tab.key) {
              await Router.push(tab.path);
            }

            scrollToTab(tab.key);
          }}
        >{t[tab.name] || tab.name}
        </Button>
      </Dropdown>;
    });
    setTabbar(tabbar);
  }

  useEffect(() => {
    updateTabbar();
  }, [tabs, currentIndex, navMenuIndex, t]);

  return (<div className={cs(styles.tabbar, className)} {...restProps} style={style}><Space>{tabbar}</Space></div>);
}
