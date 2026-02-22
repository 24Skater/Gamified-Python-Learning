export type GlitchCategory =
  | "SyntaxGlitch"
  | "LogicGlitch"
  | "RuntimeGlitch"
  | "QuestGlitch";

export interface GlitchInfo {
  errorType: string;
  category: GlitchCategory;
  hint: string;
}

const ERROR_MAP: Record<string, { category: GlitchCategory; hint: string }> = {
  SyntaxError: {
    category: "SyntaxGlitch",
    hint: "Your spell has a typo! Check for missing colons, brackets, or quotes.",
  },
  IndentationError: {
    category: "SyntaxGlitch",
    hint: "Your code alignment is off. Python is picky about spaces \u2014 make sure each line starts in the right place!",
  },
  NameError: {
    category: "SyntaxGlitch",
    hint: "The system doesn\u2019t recognize that word. Did you spell your variable or function name correctly?",
  },
  TypeError: {
    category: "LogicGlitch",
    hint: "You\u2019re mixing up types! Make sure you\u2019re using the right kind of data (text vs. number, for example).",
  },
  IndexError: {
    category: "LogicGlitch",
    hint: "You tried to reach something that doesn\u2019t exist! Check your list positions \u2014 remember, they start at 0.",
  },
  ValueError: {
    category: "LogicGlitch",
    hint: "The value doesn\u2019t look right. Double-check what you\u2019re passing in.",
  },
  KeyError: {
    category: "LogicGlitch",
    hint: "That key doesn\u2019t exist in the dictionary. Check your key names \u2014 spelling and capitalization matter!",
  },
  AttributeError: {
    category: "LogicGlitch",
    hint: "That object doesn\u2019t have that ability. Check your method names \u2014 did you use the right one?",
  },
  ZeroDivisionError: {
    category: "RuntimeGlitch",
    hint: "Dividing by zero creates a black hole! Make sure your divisor isn\u2019t zero.",
  },
  RecursionError: {
    category: "RuntimeGlitch",
    hint: "Infinite loop detected! Your spell is casting itself forever. Check your loop or function for a missing exit condition.",
  },
  TimeoutError: {
    category: "RuntimeGlitch",
    hint: "Your code took too long! It might be stuck in a loop. Check your `while` condition or loop logic.",
  },
  MemoryError: {
    category: "RuntimeGlitch",
    hint: "Your code used too much memory! Try simplifying your approach \u2014 smaller lists, fewer variables.",
  },
  AssertionError: {
    category: "QuestGlitch",
    hint: "Almost there! The quest check didn\u2019t pass. Re-read the instructions carefully.",
  },
};

const DEFAULT_GLITCH: { category: GlitchCategory; hint: string } = {
  category: "RuntimeGlitch",
  hint: "An unexpected glitch occurred! Try a different approach, or check your code for anything unusual.",
};

/**
 * Extract the Python error type from a traceback / error message string.
 * Looks for patterns like "ErrorType: message" in the last meaningful line.
 */
export function parseGlitch(stderr: string): GlitchInfo {
  if (!stderr.trim()) {
    return { errorType: "Unknown", ...DEFAULT_GLITCH };
  }

  // Pyodide error messages often include the Python error type at the start
  // of the last line: "ZeroDivisionError: division by zero"
  const lines = stderr.trim().split("\n");

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    const match = line.match(/^(\w+Error|AssertionError):\s*/);
    if (match) {
      const errorType = match[1];
      const mapped = ERROR_MAP[errorType];
      if (mapped) {
        return { errorType, ...mapped };
      }
      return { errorType, ...DEFAULT_GLITCH };
    }
  }

  // Check if the whole message starts with a known error type (no ":" separator)
  for (const errorType of Object.keys(ERROR_MAP)) {
    if (stderr.includes(errorType)) {
      return { errorType, ...ERROR_MAP[errorType] };
    }
  }

  return { errorType: "Unknown", ...DEFAULT_GLITCH };
}
