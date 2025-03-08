var log = (function() {
  // Base logger function - core functionality, styling, and output.
  function baseLogger(message, options) {
    options = options || {}; // Default options if none provided

    var fontColor   = options.fontColor   || "#FFFFFF";      // Default white text
    var backColor   = options.backColor   || "transparent";
    var fontFamily  = options.fontFamily  || "monospace";
    var fontSize    = options.fontSize    || "14px";
    var fontWeight  = options.fontWeight  || "normal";
    var textShadow  = options.textShadow  || "none";
    var icon        = options.icon        || "";        // Icon/Emoji prefix

    // Check if message is an array (for multi-color segments)
    if (Array.isArray(message)) {
      let combinedMessage = "";
      let combinedStyles = [];

      message.forEach(segment => {
        let segmentText = "";
        let segmentOptions = {};

        if (typeof segment === 'object' && !Array.isArray(segment)) {
          // Simplified syntax: Assume first property is text, rest are styles
          for (const key in segment) {
            if (segmentText === "") {
              segmentText = segment[key]; // First property is text
            } else {
              segmentOptions[key] = segment[key]; // Subsequent properties are styles
            }
          }
        } else {
          segmentText = segment; // If not an object, assume it's just text
        }

        let formattedSegmentText = String(segmentText); // Default string conversion

        const segmentDataType = typeof segmentText; // Detect data type of segment text

        if (segmentDataType === 'object') {
          if (segmentText === null) {
            formattedSegmentText = "null";
          } else if (Array.isArray(segmentText)) {
            formattedSegmentText = JSON.stringify(segmentText, null, 2); // Pretty print arrays
          } else {
            formattedSegmentText = JSON.stringify(segmentText, null, 2); // Pretty print objects
          }
        } else if (segmentDataType === 'boolean') {
          formattedSegmentText = String(segmentText); // Stringify boolean
        } else if (segmentDataType === 'function') {
          formattedSegmentText = String(segmentText); // Stringify function
        } else if (segmentDataType === 'undefined') {
          formattedSegmentText = "undefined";
        }
         // Numbers and strings are already handled by String(segmentText)


        const segmentFontColor = segmentOptions.fontColor !== undefined ? segmentOptions.fontColor : fontColor;
        const segmentBackColor = segmentOptions.backColor !== undefined ? segmentOptions.backColor : backColor;
        const segmentFontFamily = segmentOptions.fontFamily !== undefined ? segmentOptions.fontFamily : fontFamily;
        const segmentFontSize = segmentOptions.fontSize !== undefined ? segmentOptions.fontSize : fontSize;
        const segmentFontWeight = segmentOptions.fontWeight !== undefined ? segmentOptions.fontWeight : fontWeight;
        const segmentTextShadow = segmentOptions.textShadow !== undefined ? segmentOptions.textShadow : textShadow;
        const segmentIcon = segmentOptions.icon !== undefined ? segmentOptions.icon : "";


        const segmentStyle = "color: " + segmentFontColor +
                             "; background: " + segmentBackColor +
                             "; font-family: " + segmentFontFamily +
                             "; font-size: " + segmentFontSize +
                             "; font-weight: " + segmentFontWeight +
                             "; text-shadow: " + segmentTextShadow + ";";

        combinedMessage += "%c" + segmentIcon + formattedSegmentText; // Use formattedSegmentText
        combinedStyles.push(segmentStyle);                // Add style to styles array
      });

      console.log(combinedMessage, ...combinedStyles); // Apply all styles in a single console.log

    } else { // Handle single-color message (original behavior)
      let outputMessage = String(message); // Ensure message is a string

      let typeBasedStyle = "";
      const dataType = typeof message;

      if (dataType === 'object') {
        if (message === null) {
          outputMessage = "null";
          typeBasedStyle = "color: #A0A0A0;"; // Gray for null
          icon = "☠︎︎ "; // Null icon
        } else if (Array.isArray(message)) {
          outputMessage = JSON.stringify(message, null, 2); // Pretty print arrays
          typeBasedStyle = "color: #80D010;"; // Light green for arrays
          icon = "⛁ "; // Array icon
        } else {
          outputMessage = JSON.stringify(message, null, 2); // Pretty print objects
          typeBasedStyle = "color: #3DE0D0;"; // Cyan for objects
          icon = "⛁ "; // Object icon
        }
      } else if (dataType === 'number') {
        typeBasedStyle = "color: #F08080;"; // Light coral for numbers
        icon = "⌗ "; // Number icon
      } else if (dataType === 'boolean') {
        typeBasedStyle = "color: #FFA000;"; // Amber for booleans
        outputMessage = String(message); // Ensure boolean is stringified
        icon = "⚡︎ "; // Boolean icon
      } else if (dataType === 'function') {
        typeBasedStyle = "color: #DA70D6;"; // Orchid for functions
        outputMessage = String(message);
        icon = "ƒ "; // Function icon
      } else if (dataType === 'undefined') {
        outputMessage = "undefined";
        typeBasedStyle = "color: #A0A0A0;"; // Gray for undefined
        icon = "☠︎︎ "; // Undefined icon
      }


      var style = "color: " + (options.fontColor || fontColor) +
                  "; background: " + (options.backColor || backColor) +
                  "; font-family: " + (options.fontFamily || fontFamily) +
                  "; font-size: " + (options.fontSize || fontSize) +
                  "; font-weight: " + (options.fontWeight || fontWeight) +
                  "; text-shadow: " + (options.textShadow || textShadow) +
                  ";" + typeBasedStyle; // Append type-based style

      console.log("%c" + icon + outputMessage, style); // Prepend icon to message and ensure message is string
    }
  }

  // Factory function to create specialized logger variants with preset defaults.
  function createLoggerVariant(variantOptions) {
    return function(message, options) {
      // Merge variant defaults with any options provided in the call
      const mergedOptions = { ...variantOptions, ...options };
      baseLogger(message, mergedOptions);
    };
  }

  // Main log function - uses a default style (can be customized directly)
  var logger = createLoggerVariant({
    fontColor: "#FFFFFF", // Default white
    backColor: "#00000000", // Default transparent background
    fontFamily: "monospace",
    fontSize: "14px",
    icon: "• " // Warning icon emoji
  });

  // --- Define Variants with Preset Styles and Shortcuts (unchanged) ---

  // Info variant (blue color, info icon)
  logger.info = createLoggerVariant({
    fontColor: "#2196F3", // Blue
    icon: "𝒊 " // Info icon emoji
  });
  logger.i = logger.info; // Shortcut: log.i()

  // Warn variant (amber color, warning icon)
  logger.warn = createLoggerVariant({
    fontColor: "#FFC107", // Amber
    icon: "! " // Warning icon emoji
  });
  logger.w = logger.warn; // Shortcut: log.w()

  // Error variant (red color, error icon)
  logger.error = createLoggerVariant({
    fontColor: "#F44336", // Red
    icon: "× " // Cross mark icon emoji
  });
  logger.e = logger.error; // Shortcut: log.e()

  // Success variant (green color, checkmark icon)
  logger.success = createLoggerVariant({
    fontColor: "#4CAF50", // Green
    icon: "✔ " // Check mark icon emoji
  });
  logger.s = logger.success; // Shortcut: log.s()

  // Debug variant (gray color)
  logger.debug = createLoggerVariant({
    fontColor: "#9E9E9E", // Gray
    icon: "𖢥 " // Check mark icon emoji
  });
  logger.d = logger.debug; // Shortcut: log.d()

  // Terminal variant (green text on black background, terminal look)
  logger.terminal = createLoggerVariant({
    fontColor: "#00FF00", // Green
    backColor: "#000000", // Black
    fontFamily: "Courier New, monospace",
    fontSize: "15px",
    fontWeight: "bold", // Bold font for terminal look
    icon: "❯ " // Check mark icon emoji
  });
  logger.t = logger.terminal; // Shortcut: log.t()

  // Big text variant (larger font size)
  logger.big = createLoggerVariant({
    fontSize: "20px",
    fontWeight: "bold" // Bold for bigger text
  });
  logger.b = logger.big; // Shortcut: log.b()

  // Highlight variant (yellow background)
  logger.highlight = createLoggerVariant({
    backColor: "#FFFF00", // Yellow
    fontColor: "#000000", // Black text on highlight
    fontWeight: "bold"    // Bold for highlight
  });
  logger.h = logger.highlight; // Shortcut: log.h()

  // Fancy variant (shadow, different font)
  logger.fancy = createLoggerVariant({
    fontColor: "#007BFF", // Blue
    fontFamily: "Arial, sans-serif",
    fontSize: "18px",
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)" // Fancy look
  });
  logger.f = logger.fancy; // Shortcut: log.f()

  // Custom color variant example (you can add more as needed)
  logger.purple = createLoggerVariant({
    fontColor: "purple"
  });
  logger.p = logger.purple; // Shortcut: log.p()

  // --- ASCII Art Variant (unchanged) ---
  logger.asciiArt = function(text, options) {
    options = options || {};
    const fontColor   = options.fontColor   || "#FFFFFF";
    const backColor   = options.backColor   || "transparent";
    const fontFamily  = options.fontFamily  || "monospace";
    const fontSize    = options.fontSize    || "14px";

    // Simple ASCII art conversion (basic example - can be replaced with a more advanced library if needed)
    const asciiArt = text.split('').map(char => char + ' ').join(''); // Basic space-separated chars

    baseLogger(asciiArt, { fontColor, backColor, fontFamily, fontSize, fontWeight: "bold" }); // Bold ASCII art
  };
  logger.a = logger.asciiArt; // Shortcut: log.a()


  return logger; // Return the main logger function with all variants attached
})();
