import { Layout, Typography } from '@douyinfe/semi-ui';
import { BasicProps } from '@douyinfe/semi-ui/lib/es/layout';
import cs from 'classnames';
import React from 'react';
import styles from './style/index.module.less';

export default function Footer(props: BasicProps = {}) {
  const { className, style, ...restProps } = props;

  const { Text } = Typography;

  return (
    <Layout.Footer
      className={cs(styles.footer, className)}
      {...restProps}
      style={style}
    >
      <Text type="tertiary">Copyright © 2022 Coreyun.com</Text>
    </Layout.Footer>
  );
}
