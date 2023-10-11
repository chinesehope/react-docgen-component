# react-docgen-component

## Installation

```bash
npm install -g react-docgen-component
```

## Usage
在生成组件文档目录下执行(或自定义路径)

```bash
docgen ./
```
遵循jsdoc规范，会自动收集组件的props和公共方法，生成markdown文档
注释规范如下
```typescript
/**
 * 描述信息
 * @description 描述信息
 * @deprecated 弃用信息
 * @example 示例用法
 * @public 公共方法
 */
```

## Example

```typescript
import classNames from 'classnames';
import React from 'react';
import './index.less';

type MyButtonType = {
  // 类型
  type?: 'primary' | 'default' | 'gray';
  /** 填充模式 */
  fill?: 'solid' | 'outline' | 'none';
  /** 形状 */
  size?: 'mini' | 'small' | 'middle' | 'large';
  /** 类 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 插槽 */
  children: React.ReactNode;
  /** 点击事件 */
  onClick?: () => void;
};

/**
 * @description 按钮组件
 * @deprecated 这个组件已经被弃用，建议使用其他组件
 * @example
 * <MyButton
 *  onClick={() => {
 *   console.log('click');
 * }}>
 * 确认
 * </MyButton>
 */
const MyButton = ({
  disabled = false,
  size = 'middle',
  type = 'default',
  fill = 'solid',
  onClick = null,
  children,
  className,
}: MyButtonType) => {
  return (
    <div
      onClick={disabled ? null : onClick}
      styleName={classNames('button', {
        [size]: size,
        [type]: type,
        [fill]: fill,
        disable: disabled ? 'disable' : null,
      })}
      className={className}
    >
      {children}
    </div>
  );
};
/**
 * 打开
 * @public open
 */
MyButton.open = (content: string, obj: {} = {}, a: any = 2) => {};

export default MyButton;
```
---
## Return
生成的markdown文档如下

# Button

> **警告:** 这个组件已经被弃用，建议使用其他组件

按钮组件

## 示例

```jsx
<MyButton
 onClick={() => {
  console.log('click');
}}>
确认
</MyButton>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ----------- | ---- | ------- |
| type |  | "primary" \| "default" \| "gray" | default |
| fill | 填充模式 | "solid" \| "outline" \| "none" | solid |
| size | 形状 | "mini" \| "small" \| "middle" \| "large" | middle |
| className | 类 | string |  |
| disabled | 是否禁用 | boolean | false |
| children | 插槽 | React.ReactNode |  |
| onClick | 点击事件 | () => void | null |

## APIs

### open

打开

| 属性 | 说明 | 类型 |
| ---- | ----------- | ---- |
| content |  | string |
| obj |  | {} |
| a |  | any |
