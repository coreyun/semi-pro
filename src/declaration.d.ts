declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.less" {
  const classes: { [className: string]: string };
  export default classes;
}

declare module "*/settings.json" {
  const value: {
    header: boolean;
    tabbar: boolean;
    navbar: boolean;
    footer: boolean;
    keepalive: boolean;
    siderWidth: number;
    home: string;
  };

  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}
