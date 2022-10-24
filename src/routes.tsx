import auth, { AuthParams } from "@/utils/authentication";
import {
  IconAlertTriangle,
  IconArticle,
  IconGridRectangle,
  IconHistogram,
  IconInfoCircle,
  IconKanban,
  IconTextRectangle,
  IconUserCircle
} from "@douyinfe/semi-icons";
import React, { useEffect, useMemo, useState } from "react";

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
  icon?: React.ReactNode;
};

export const routes: IRoute[] = [
  {
    name: "menu.console",
    key: "exampleHome",
    icon: <IconKanban />
  },
  {
    name: "menu.analysis",
    key: "exampleAnalysis",
    icon: <IconHistogram />,
    children: [
      {
        name: "menu.analysis.basic",
        key: "exampleAnalysis/basic"
      },
      {
        name: "menu.analysis.multiDimension",
        key: "exampleAnalysis/multiDimension"
      }
    ]
  },
  {
    name: "menu.list",
    key: "exampleList",
    icon: <IconGridRectangle />,
    children: [
      {
        name: "menu.list.search",
        key: "exampleList/search"
      },
      {
        name: "menu.list.card",
        key: "exampleList/card"
      }
    ]
  },
  {
    name: "menu.form",
    key: "exampleForm",
    icon: <IconTextRectangle />,
    children: [
      {
        name: "menu.form.group",
        key: "exampleForm/group"
      },
      {
        name: "menu.form.step",
        key: "exampleForm/step"
      }
    ]
  },
  {
    name: "menu.profile",
    key: "exampleProfile",
    icon: <IconArticle />,
    children: [
      {
        name: "menu.profile.basic",
        key: "exampleProfile/basic"
      }
    ]
  },
  {
    name: "menu.result",
    key: "exampleResult",
    icon: <IconInfoCircle />,
    children: [
      {
        name: "menu.result.success",
        key: "exampleResult/success"
      },
      {
        name: "menu.result.failure",
        key: "exampleResult/failure"
      }
    ]
  },
  {
    name: "menu.exception",
    key: "exception",
    icon: <IconAlertTriangle />,
    children: [
      {
        name: "menu.exception.403",
        key: "exception/403"
      },
      {
        name: "menu.exception.404",
        key: "exception/404"
      },
      {
        name: "menu.exception.500",
        key: "exception/500"
      }
    ]
  },
  {
    name: "menu.user",
    key: "exampleUser",
    icon: <IconUserCircle/>,
    requiredPermissions: [
      {
        resource: "auth"
      }
    ],
    children: [
      {
        name: "menu.user.info",
        key: "exampleUser/info"
      },
      {
        name: "menu.user.setting",
        key: "exampleUser/setting"
      }
    ]
  }
];

export function findNode(tree, func) {
  for (const node of tree) {
    if (func(node)) return node
    if (node.children) {
      const res = findNode(node.children, func)
      if (res) return res
    }
  }
  return null
}

export function getName(path: string, routes: IRoute[]) {
  const node = findNode(routes, item => `/${item.key}` == path)
  if (node) {
    return node.name
  } else {
    return path
  }
}

export const generatePermission = (role: string) => {
  const actions = role === "admin" ? ["*"] : ["read"];
  const result = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (userPermission): [IRoute[], string] => {
  const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }

    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      return first?.children?.[0]?.key || first.key;
    }
    return "";
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
