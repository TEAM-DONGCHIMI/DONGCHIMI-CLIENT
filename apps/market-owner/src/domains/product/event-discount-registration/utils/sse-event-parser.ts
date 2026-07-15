export interface ParsedSseEventTypes {
  data: string;
  event?: string;
}

const EVENT_SEPARATOR_PATTERN = /\r?\n\r?\n/;

const parseEventBlock = (block: string): ParsedSseEventTypes | undefined => {
  const dataLines: string[] = [];
  let event: string | undefined;

  block.split(/\r?\n/).forEach((line) => {
    if (line === '' || line.startsWith(':')) {
      return;
    }

    const separatorIndex = line.indexOf(':');
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    const rawValue = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1);
    const value = rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;

    if (field === 'event') {
      event = value;
    }

    if (field === 'data') {
      dataLines.push(value);
    }
  });

  if (dataLines.length === 0) {
    return undefined;
  }

  return {
    data: dataLines.join('\n'),
    event,
  };
};

export const createSseEventParser = (onEvent: (event: ParsedSseEventTypes) => void) => {
  let buffer = '';

  const emitCompleteEvents = () => {
    let separatorMatch = buffer.match(EVENT_SEPARATOR_PATTERN);

    while (separatorMatch?.index != null) {
      const block = buffer.slice(0, separatorMatch.index);
      buffer = buffer.slice(separatorMatch.index + separatorMatch[0].length);

      const event = parseEventBlock(block);

      if (event) {
        onEvent(event);
      }

      separatorMatch = buffer.match(EVENT_SEPARATOR_PATTERN);
    }
  };

  return {
    flush: () => {
      const event = parseEventBlock(buffer);

      buffer = '';

      if (event) {
        onEvent(event);
      }
    },
    push: (chunk: string) => {
      buffer += chunk;
      emitCompleteEvents();
    },
  };
};
