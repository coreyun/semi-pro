import useRoute, { getName, IRoute, routes as fullRoutes } from '@/routes';
import { RootState } from '@/store';
import { routeKeysClear, routeKeysSet } from '@/store/navbar';
import { openTab } from '@/store/tabbar';
import useLocale from '@/utils/useLocale';
import { Layout, Nav } from '@douyinfe/semi-ui';
import { BasicProps } from '@douyinfe/semi-ui/lib/es/layout';
import cs from 'classnames';
import Router, { NextRouter, useRouter } from 'next/router';
import qs from 'query-string';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAliveController } from 'react-activation';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style/index.module.less';

export function generateFullPathname(router: NextRouter) {
  const query = qs.stringify(router.query);
  return router.asPath + (query ? `?${query}` : '');
}

export interface NavbarProps extends BasicProps {
  onRoute?: (key: string) => void;
  onBreadcrumbChange?: (breadcrumb: []) => void;
  onCollapseChange?: (isCollapse: boolean) => void;
  collapsed: boolean;
  width?: number | string;
}

export default function Navbar(props: NavbarProps = { collapsed: false }) {
  const { className, style, ...restProps } = props;

  const t = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { drop } = useAliveController();
  const {
    user: { userInfo },
  } = useSelector((state: RootState) => state);
  const [routes, defaultRoute] = useRoute(userInfo?.permissions);

  const pathname = router.asPath;
  const fullPathname = generateFullPathname(router);
  const currentComponent = qs.parseUrl(pathname).url.slice(1);
  const defaultSelectedKeys = [currentComponent || defaultRoute];
  const paths = (currentComponent || defaultRoute).split('/');
  const defaultOpenKeys = paths.slice(0, paths.length - 1);

  const [navbar, setNavbar] = useState([]);
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const routeMap = useRef<Map<string, ReactNode[]>>(new Map());
  const menuMap = useRef<Map<string, { menuItem?: boolean; subNav?: boolean }>>(
    new Map()
  );

  function travelNav(_routes: IRoute[], level, parentNode = []) {
    return _routes.map((route) => {
      const { breadcrumb = true, ignore } = route;
      const title = t[route.name] || route.name;
      const titleDom = <>{title}</>;

      routeMap.current.set(
        `/${route.key}`,
        breadcrumb ? [...parentNode, route.name] : []
      );
      dispatch(routeKeysSet(`/${route.key}`));

      const visibleChildren = (route.children || []).filter((child) => {
        const { ignore, breadcrumb = true } = child;
        if (ignore || route.ignore) {
          routeMap.current.set(
            `/${child.key}`,
            breadcrumb ? [...parentNode, route.name, child.name] : []
          );
          dispatch(routeKeysSet(`/${child.key}`));
        }

        return !ignore;
      });

      if (ignore) {
        return '';
      }
      if (visibleChildren.length) {
        menuMap.current.set(route.key, { subNav: true });
        return (
          <Nav.Sub
            key={route.key}
            itemKey={route.key}
            text={titleDom}
            icon={route.icon}
          >
            {travelNav(visibleChildren, level + 1, [...parentNode, route.name])}
          </Nav.Sub>
        );
      }
      menuMap.current.set(route.key, { menuItem: true });
      return (
        <Nav.Item
          key={route.key}
          itemKey={route.key}
          icon={route.icon}
          text={titleDom}
          onClick={() => navItemClickHandle(`/${route.key}`)}
        />
      );
    });
  }

  async function navItemClickHandle(key) {
    await drop(key);
    await Router.push(key);

    if (props.onRoute) props.onRoute(key);
  }

  function updateNavbar() {
    routeMap.current.clear();
    dispatch(routeKeysClear());
    setNavbar(travelNav(routes, 1));
  }

  function updateNavStatus() {
    const pathKeys = fullPathname.split('/');
    pathKeys.shift();
    const newSelectedKeys: string[] = [];
    const newOpenKeys: string[] = [];
    while (pathKeys.length > 0) {
      const currentRouteKey = pathKeys.join('/');
      const menuKey = currentRouteKey.replace(/^\//, '');
      const menuType = menuMap.current.get(menuKey);
      if (menuType && menuType.menuItem) {
        newSelectedKeys.push(menuKey);
      }
      newOpenKeys.push(menuKey);
      pathKeys.pop();
    }
    const mergeOpenKeys = [...openKeys, ...newOpenKeys];
    setOpenKeys(mergeOpenKeys.filter((v, k) => mergeOpenKeys.indexOf(v) == k));
    setSelectedKeys(newSelectedKeys);
  }

  useEffect(() => {
    updateNavbar();
    updateNavStatus();

    const routeConfig = routeMap.current.get(fullPathname);
    if (props.onBreadcrumbChange) {
      props.onBreadcrumbChange((routeConfig as []) || []);
    }

    if (routeConfig && routeConfig.length > 0) {
      const name = routeConfig[routeConfig.length - 1];

      dispatch(openTab({ name, key: pathname, path: fullPathname }));
    } else {
      const name = getName(fullPathname, fullRoutes);
      dispatch(openTab({ name, key: pathname, path: fullPathname }));
    }
  }, [routes, router.asPath, router.query, t]);

  return (
    navbar.length > 0 && (
      <Layout.Sider
        className={cs(styles.sider, className)}
        {...restProps}
        style={style}
      >
        <Nav
          className={styles.navbar}
          style={{
            width: props.width,
          }}
          defaultIsCollapsed={props.collapsed}
          defaultSelectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          onCollapseChange={(e) => {
            if (props.onCollapseChange) props.onCollapseChange(e);
          }}
          onOpenChange={(e) => {
            setOpenKeys(e.openKeys as string[]);
          }}
          footer={{ collapseButton: true, className: styles.collapseButton }}
        >
          {navbar}
        </Nav>
      </Layout.Sider>
    )
  );
}
