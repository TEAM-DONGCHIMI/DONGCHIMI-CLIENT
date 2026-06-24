export type ClassDictionaryTypes = Record<string, unknown>;

export type ClassValueTypes =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionaryTypes
  | readonly ClassValueTypes[];

const appendClassValue = (value: ClassValueTypes, classNames: string[]) => {
  if (!value) {
    return;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    classNames.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendClassValue(item, classNames));
    return;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([className, isActive]) => {
      if (isActive) {
        classNames.push(className);
      }
    });
  }
};

export const cn = (...values: readonly ClassValueTypes[]) => {
  const classNames: string[] = [];

  values.forEach((value) => appendClassValue(value, classNames));

  return classNames.join(' ');
};
