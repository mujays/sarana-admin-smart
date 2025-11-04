/**
 * Utility functions for preventing emoji input in form fields
 */

/**
 * Regular expression to detect emoji characters
 * Matches most emoji ranges including:
 * - Basic emojis (😀-🙏)
 * - Supplemental symbols (🌀-🗿)
 * - Transport and map symbols (🚀-🛿)
 * - Additional emojis (🤀-🧿)
 * - Various other emoji ranges
 */
const EMOJI_REGEX =
  /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]|[\uD83E][\uDD00-\uDDFF]/g;

/**
 * Checks if a string contains emoji characters
 * @param text - The text to check
 * @returns true if the text contains emojis, false otherwise
 */
export const containsEmoji = (text: string): boolean => {
  return EMOJI_REGEX.test(text);
};

/**
 * Removes emoji characters from a string
 * @param text - The text to clean
 * @returns The text with emojis removed
 */
export const removeEmojis = (text: string): string => {
  return text.replace(EMOJI_REGEX, "");
};

/**
 * Event handler for input fields to prevent emoji input
 * Use this with onChange event of Input components
 * @param e - The input change event
 * @param callback - Optional callback to handle the cleaned value
 * @returns The cleaned value without emojis
 */
export const handleEmojiPreventionChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback?: (value: string) => void,
): string => {
  const originalValue = e.target.value;
  const cleanedValue = removeEmojis(originalValue);

  // If emojis were detected and removed, update the input value
  if (originalValue !== cleanedValue) {
    // Update the input element directly
    e.target.value = cleanedValue;
  }

  if (callback) {
    callback(cleanedValue);
  }

  return cleanedValue;
};

/**
 * Validation rule for Ant Design Form to prevent emoji input
 * Use this in the rules array of Form.Item
 */
export const noEmojiRule = {
  validator: (_: any, value: string) => {
    if (value && containsEmoji(value)) {
      return Promise.reject(
        new Error("Emoji tidak diperbolehkan dalam field ini"),
      );
    }
    return Promise.resolve();
  },
};

/**
 * Higher-order function to create an onChange handler that prevents emojis
 * @param originalOnChange - The original onChange handler (optional)
 * @returns A new onChange handler that prevents emojis
 */
export const createEmojiPreventionHandler = (
  originalOnChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void,
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const cleanedValue = handleEmojiPreventionChange(e);

    // Create a new event with the cleaned value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: cleanedValue,
      },
    };

    if (originalOnChange) {
      originalOnChange(
        syntheticEvent as React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement
        >,
      );
    }
  };
};
