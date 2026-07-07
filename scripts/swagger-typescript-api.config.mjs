const GENERIC_BASE_EXTENSION = 'x-generic-base';
const GENERIC_TYPE_ARG_EXTENSION = 'x-generic-type-arg';

export default {
  hooks: {
    onParseSchema: (originalSchema, parsedSchema) => {
      const genericBase = originalSchema?.[GENERIC_BASE_EXTENSION];
      const genericTypeArg = originalSchema?.[GENERIC_TYPE_ARG_EXTENSION];

      if (genericBase && genericTypeArg) {
        parsedSchema.content = `${genericBase}<${genericTypeArg}>`;
      }

      return parsedSchema;
    },
  },
};
