---
tags:
  - typescript
date: 2020-11-05
title: 高扩展性类
vssue-title: 高扩展性类
---

高扩展性类

<!-- more -->

最近在写ant design pro脚手架生成的ts项目，想把之前js版本的from表单区块升级成ts版本，遇到了一个问题，于是想记录下。
<br />
问题就是不同的表单提交项，JSON Schema内的需要传的值就不同。比如下拉选择就需要下拉选择的内容，日期选择就需要格式化后的格式等等。对于高扩展性的表单提交项，其JSON Schema对应的类也应该具有高拓展性。

<br />

#### [Extract](https://www.tslang.cn/docs/release-notes/typescript-2.9.html)

ts官网是这么介绍的， 现在是Extract<keyof T, string>。（换句话说，是keyof T的子集，它仅包含类字符串的值。）。所以可以理解 在keyof T范围下满足第二个条件的一个子集。那么下面看看代码更改前后的变化。

<br />
before

```
import SearchSelect, { SearchInputProps } from './SearchSelect';

export interface listItem extends SearchInputProps, ChargeManagementListProps {
  list?: any[];
  name: string;
  type: string;
  span?: number;
  label?: string;
  required?: boolean | undefined;
  message?: string;
  mode?: "multiple" | "tags" | undefined;
  initValue?: any;
  maxLength?: number;
  precision?: number;
  selectArr?: selectItem[];
  serverFormat?: string;
  picker?: 'week' | 'month' | 'year' | undefined;
  handleChange?: (props: any) => void;
  [propName: string]: any;
}

export interface selectItem {
  name: any;
  value: number;
}

interface BaseFormProps {
  type: number;
  cancelFunc?: () => void;
  okFunc?: (props: any) => void;
  resetFunc?: () => void;
  list?: listItem[];
}
```
listItem这个类只能加?来规避不同的提交项不同的传值，可以说写的不人性化。

<br />

after

```

type TypeProps = 'Text' | 'Select' | 'TextArea' | 'Group' | 'InputNumber' | 'Password' | 'SearchSelect' | 'DateRange' | 'ChargeManagementList';

type TextItem = {
  type?: Extract<TypeProps, 'Text'>,
}

type SelectItem = {
  type?: Extract<TypeProps, 'Select'>,
  selectArr: selectItem[];
  mode?: "multiple" | "tags" | undefined;
}

type TextAreaItem = {
  type?: Extract<TypeProps, 'TextArea'>,
}


type GroupItem = {
  type?: Extract<TypeProps, 'Group'>,
  selectArr: selectItem[];
}

type InputNumberItem = {
  type?: Extract<TypeProps, 'InputNumber'>,
}

type PasswordItem = {
  type?: Extract<TypeProps, 'Password'>,
}

export type SearchSelectItem = {
  type?: Extract<TypeProps, 'SearchSelect'>,
  placeholder?: string;
  style?: any;
  getListApi: (props: any) => Promise<any>;
  onChange?: (props: any) => void;
}

type DateRangePicekr = {
  type?: Extract<TypeProps, 'DateRange'>,
  picker: 'week' | 'month' | 'year';
}

export type ChargeManagementListItem = {
  list: any[];
  onChange?: (props: any) => void;
  type?: Extract<TypeProps, 'ChargeManagementList'>,
}


type FormConfigItemProps = SelectItem | DateRangePicekr | TextItem | ChargeManagementListItem | SearchSelectItem | TextAreaItem | GroupItem | InputNumberItem | PasswordItem;

export type listItem = {
  name: string;
  span?: number;
  label?: string;
  required?: boolean | undefined;
  message?: string;
  initValue?: any;
  maxLength?: number;
  precision?: number;
  serverFormat?: string;
  handleChange?: (props: any) => void;
  [propName: string]: any;
} & FormConfigItemProps;

export interface selectItem {
  name: any;
  value: number;
}


interface BaseFormProps {
  type: number;
  cancelFunc?: () => void;
  okFunc?: (props: any) => void;
  resetFunc?: () => void;
  list?: listItem[];
}
```
改版后可以对所有不同的提交项目单独定制化处理，然后相应的组件的props的类也是可以直接引用这里的定义的item类。
<br />



-------------------2020.11.10 更新-----------------

以上方式就是typescript的联合类型。联合类型（Union Types）表示取值可以为多种类型中的一种。
<br />
例子如下：
```
interface Square {
  kind: 'square';
  size: number;
}
interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}
type Shape = Square | Rectangle;
function area(s: Shape) {
  switch (s.kind) {
    case: 'square':
      return s.size * s.size;
    case 'rectangle':
      return s.width * s.height
  }
}
```
<br />
总结就是联合类型可使类型具有一定的不确定性，提高代码的灵活性。




