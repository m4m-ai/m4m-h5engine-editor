import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { IAttrComponent } from '../Attribute';

export type RadioGroupDataType = {
  value: boolean;
  options: { label: string, value: string | number }[];
}

/**
 * 单选框按钮组
 */
export function RadioGroupAttr(data: IAttrComponent<RadioGroupDataType>) {

  const [value, setValue] = useState(data.attrValue);
  useEffect(() => {
    data.setRefresh(setValue)
    setValue(value)
  }, [data]);

  return (
    <Radio.Group options={data.attrValue.options}
    onChange={(e) => {
      data.onChange({ value: e.target.value, options: value.options })
      setValue(e.target.value)
    }}
    value={value} optionType="button" />
  )
}
