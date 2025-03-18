var log = (function() {
  // Default style variables - defined in the outer scope to be accessible
  var defaultFontColor   = "#FFFFFF";      // Default white text
  var defaultBackColor   = "transparent";
  var defaultFontFamily  = "monospace";
  var defaultFontSize    = "14px";
  var defaultFontWeight  = "normal";
  var defaultTextShadow  = "none";

  // Helper: Get caller location (file name and line number) from error stack.
  function getCallerLocation(full = false) {
    var err = new Error();
    // Ensure error.stack is available
    if (!err.stack) {
      try { throw err; } catch (e) { err = e; }
    }
    var stackLines = err.stack.split("\n");
    // console.log(stackLines); // For debugging stack traces

    if (stackLines.length < 4) return ""; // Stack trace too short

    let callerLine = null;
    const scriptFilename = 'script.js'; // Adjust if your script filename is different

    // Iterate through stack lines to find the caller line (outside script.js)
    for (let i = 1; i < stackLines.length; i++) {
      const line = stackLines[i].trim();
      if (line.includes('at ') || line.includes('@ ')) { // Check for 'at ' or '@ ' to identify relevant lines
        if (!line.includes(scriptFilename)) { // Exclude lines containing script.js (our logger library)
          callerLine = line;
          break; // Found the caller line, exit loop
        }
      }
    }

    if (!callerLine) {
      callerLine = stackLines[stackLines.length - 1].trim(); // Fallback to last line if no clear caller found
    }


    // Robust regex to capture file path and line number from various stack trace formats
    const match = callerLine.match(/(?:at |@ )(.*?)(?::(\d+))?(?::(\d+))?$/);
    if (match) {
      let fullPath = match[1];

      if (!fullPath) return ""; // No path found in regex match

      if (fullPath.startsWith("file://")) {
        fullPath = fullPath.substring("file://".length); // Remove file:// prefix if present
      }

      // Normalize path separators to forward slash for consistent splitting
      fullPath = fullPath.replace(/\\/g, '/');

      let parts = fullPath.split('/');
      let filename = parts.pop(); // Get the last part (filename)

      if (!filename) filename = parts.pop(); // Handle cases where path ends with slash


      let lineNumber = match[2] || 'UnknownLine'; // Get line number, default to 'UnknownLine' if not found

      if (full === true) {
        return fullPath + ":" + lineNumber;
      }
      return filename + ":" + lineNumber; // Return filename:linenumber
    }


    return callerLine || ""; // Return the raw caller line if regex fails or empty string if no callerLine found
  }

  // Helper: Get current time in HH:mm:ss format (12-hour format)
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let displayHours = hours % 12;
    if (displayHours === 0) {
      displayHours = 12;
    }
    hours = String(displayHours).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Base logger function – core functionality, styling, and output.
  function baseLogger(message, options) {
    options = options || {}; // Default options if none provided

    var fontColor   = options.fontColor   || defaultFontColor;
    var backColor   = options.backColor   || defaultBackColor;
    var fontFamily  = options.fontFamily  || defaultFontFamily;
    var fontSize    = options.fontSize    || defaultFontSize;
    var fontWeight  = options.fontWeight  || defaultFontWeight;
    var textShadow  = options.textShadow  || defaultTextShadow;
    var icon        = options.icon        || "";             // Icon/Emoji prefix

    // Get caller location info and store in a variable.
    var callerLocation = getCallerLocation();
    var currentTime = getCurrentTime(); // Get current time

    // Style for the location and time part (transparent background and white text) - Define here to access fontFamily, fontSize
    var locationStyle = "color: white; background-color: transparent; font-family: " + fontFamily + "; font-size: " + fontSize + ";";


    // Check if message is an array (for multi-color segments)
    if (Array.isArray(message)) {
      let combinedMessage = "";
      let combinedStyles = [];

      combinedMessage += `%c[${callerLocation}][${currentTime}]  `; // Enclose in brackets and add space
      combinedStyles.push(locationStyle); // Apply location style

      message.forEach(segment => {
        let segmentText = "";
        let segmentOptions = {};

        if (typeof segment === 'object' && !Array.isArray(segment)) {
          // Simplified syntax: Assume first property is text, rest are styles.
          for (const key in segment) {
            if (segmentText === "") {
              segmentText = segment[key]; // First property is text.
            } else {
              segmentOptions[key] = segment[key]; // Subsequent properties are styles.
            }
          }
        } else {
          segmentText = segment; // If not an object, assume it's just text.
        }

        let formattedSegmentText = String(segmentText); // Default string conversion.
        const segmentDataType = typeof segmentText; // Detect data type of segment text.

        if (segmentDataType === 'object') {
          if (segmentText === null) {
            formattedSegmentText = "null";
          } else if (Array.isArray(segmentText)) {
            formattedSegmentText = JSON.stringify(segmentText, null, 2); // Pretty print arrays.
          } else {
            formattedSegmentText = JSON.stringify(segmentText, null, 2); // Pretty print objects.
          }
        } else if (segmentDataType === 'boolean' ||
                   segmentDataType === 'function') {
          formattedSegmentText = String(segmentText); // Stringify booleans/functions.
        } else if (segmentDataType === 'undefined') {
          formattedSegmentText = "undefined";
        }
        // Numbers and strings are already handled by String(segmentText).

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

        combinedMessage += "%c" + segmentIcon + formattedSegmentText;
        combinedStyles.push(segmentStyle);
      });

      console.log(combinedMessage, ...combinedStyles); // Apply all styles in a single console.log.

    } else { // Handle single-color message (original behavior).
      let outputMessage = String(message); // Ensure message is a string.
      let typeBasedStyle = "";
      const dataType = typeof message;

      if (dataType === 'object') {
        if (message === null) {
          outputMessage = "null";
          typeBasedStyle = "color: #A0A0A0;"; // Gray for null.
          icon = "☠︎︎ "; // Null icon.
        } else if (Array.isArray(message)) {
          outputMessage = JSON.stringify(message, null, 2); // Pretty print arrays.
          typeBasedStyle = "color: #80D010;"; // Light green for arrays.
          icon = "⛁ "; // Array icon.
        } else {
          outputMessage = JSON.stringify(message, null, 2); // Pretty print objects.
          typeBasedStyle = "color: #3DE0D0;"; // Cyan for objects.
          icon = "⛁ "; // Object icon.
        }
      } else if (dataType === 'number') {
        typeBasedStyle = "color: #F08080;"; // Light coral for numbers.
        icon = "⌗ "; // Number icon.
      } else if (dataType === 'boolean') {
        typeBasedStyle = "color: #FFA000;"; // Amber for booleans.
        outputMessage = String(message);
        icon = "⚡︎ "; // Boolean icon.
      } else if (dataType === 'function') {
        typeBasedStyle = "color: #DA70D6;"; // Orchid for functions.
        outputMessage = String(message);
        icon = "ƒ "; // Function icon.
      } else if (dataType === 'undefined') {
        outputMessage = "undefined";
        typeBasedStyle = "color: #A0A0A0;"; // Gray for undefined.
        icon = "☠︎︎ "; // Undefined icon.
      }

      var style = "color: " + (options.fontColor || fontColor) +
                  "; background: " + (options.backColor || backColor) +
                  "; font-family: " + (options.fontFamily || fontFamily) +
                  "; font-size: " + (options.fontSize || fontSize) +
                  "; font-weight: " + (options.fontWeight || fontWeight) +
                  "; text-shadow: " + (options.textShadow || textShadow) +
                  ";" + typeBasedStyle;


      console.log("%c[" + callerLocation + "][%c" + currentTime + "%c]  %c" + icon + outputMessage, locationStyle, "color: white; background-color: transparent; font-weight: bold;", locationStyle, style);
    }
  }

  // Factory function to create specialized logger variants with preset defaults.
  function createLoggerVariant(variantOptions) {
    return function(message, options) {
      // Merge variant defaults with any options provided in the call.
      const mergedOptions = { ...variantOptions, ...options };
      baseLogger(message, mergedOptions);
    };
  }

  // Main log function – uses a default style (can be customized directly).
  var logger = createLoggerVariant({
    fontColor: defaultFontColor, // Default white.
    backColor: defaultBackColor, // Default transparent background.
    fontFamily: defaultFontFamily,
    fontSize: defaultFontSize,
    icon: "• " // Warning icon emoji.
  });

  // --- Define Variants with Preset Styles and Shortcuts ---

  // Info variant (blue color, info icon)
  logger.info = createLoggerVariant({
    fontColor: "#2196F3", // Blue.
    icon: "𝒊 " // Info icon emoji.
  });
  logger.i = logger.info; // Shortcut: log.i().

  // Warn variant (amber color, warning icon)
  logger.warn = createLoggerVariant({
    fontColor: "#FFC107", // Amber.
    icon: "! " // Warning icon emoji.
  });
  logger.w = logger.warn; // Shortcut: log.w().

  // Error variant (red color, error icon)
  logger.error = createLoggerVariant({
    fontColor: "#F44336", // Red.
    icon: "× " // Cross mark icon emoji.
  });
  logger.e = logger.error; // Shortcut: log.e().

  // Success variant (green color, checkmark icon)
  logger.success = createLoggerVariant({
    fontColor: "#4CAF50", // Green.
    icon: "✔ " // Check mark icon emoji.
  });
  logger.s = logger.success; // Shortcut: log.s().

  // Debug variant (gray color)
  logger.debug = createLoggerVariant({
    fontColor: "#9E9E9E", // Gray.
    icon: "𖢥 " // Check mark icon emoji.
  });
  logger.d = logger.debug; // Shortcut: log.d().

  // Terminal variant (green text on black background, terminal look)
  logger.terminal = createLoggerVariant({
    fontColor: "#00FF00", // Green.
    backColor: "#000000", // Black.
    fontFamily: "Courier New, monospace",
    fontSize: "15px",
    fontWeight: "bold", // Bold for terminal look.
    icon: "❯ " // Terminal icon.
  });
  logger.t = logger.terminal; // Shortcut: log.t().

  // Big text variant (larger font size)
  logger.big = createLoggerVariant({
    fontSize: "20px",
    fontWeight: "bold" // Bold for bigger text.
  });
  logger.b = logger.big; // Shortcut: log.b().

  // Highlight variant (yellow background)
  logger.highlight = createLoggerVariant({
    backColor: "#FFFF00", // Yellow.
    fontColor: "#000000", // Black text.
    fontWeight: "bold"    // Bold for highlight.
  });
  logger.h = logger.highlight; // Shortcut: log.h().

  // Fancy variant (shadow, different font)
  logger.fancy = createLoggerVariant({
    fontColor: "#007BFF", // Blue.
    fontFamily: "Arial, sans-serif",
    fontSize: "18px",
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)" // Fancy look.
  });
  logger.f = logger.fancy; // Shortcut: log.f().

  // Custom color variant example.
  logger.purple = createLoggerVariant({
    fontColor: "purple"
  });
  logger.p = logger.purple; // Shortcut: log.p().

  // --- ASCII Art Variant ---
  logger.asciiArt = function(text, options) {
    options = options || {};
    const fontColor   = options.fontColor   || defaultFontColor;
    const backColor   = options.backColor   || defaultBackColor;
    const fontFamily  = options.fontFamily  || defaultFontFamily;
    const fontSize    = options.fontSize    || defaultFontSize;

    // Simple ASCII art conversion (basic example).
    const asciiArt = text.split('').map(char => char + ' ').join(' ');

    baseLogger(asciiArt, { fontColor, backColor, fontFamily, fontSize, fontWeight: "bold" });
  };
  logger.a = logger.asciiArt; // Shortcut: log.a().

  // --- Table Variant ---
  logger.table = function(data, options) {
    options = options || {};
    const tableOptions = { ...options }; // Create a copy to avoid modifying original options

    // Get caller location and time (similar to baseLogger)
    var callerLocation = getCallerLocation();
    var currentTime = getCurrentTime();

    let processedData = data; // Default data is input data

    if (typeof data === 'string') {
      try {
        processedData = JSON.parse(data); // Try to parse JSON string
      } catch (e) {
        baseLogger(["log.table", { fontColor: "yellow" }, " - Warning: Could not parse JSON string. Displaying as string."], { backColor: "black", fontColor: "yellow" });
        processedData = [{ "string_data": data }]; // Display string as a single-row table
      }
    }

    if (!Array.isArray(processedData) && typeof processedData === 'object' && processedData !== null) {
      processedData = [processedData]; // Convert single object to array of objects
    } else if (!Array.isArray(processedData)) {
      baseLogger(["log.table", { fontColor: "yellow" }, " - Warning: Data is not an object or array. Cannot display as table."], { backColor: "black", fontColor: "yellow" });
      return; // Exit if data is not suitable for table
    }


    if (tableOptions.backColor === undefined) {
      tableOptions.backColor = defaultBackColor; // Default table background
    }
    if (tableOptions.fontColor === undefined) {
      tableOptions.fontColor = tableOptions.tableColor || "lightgreen";     // Default table font color lightgreen if tableColor not set, otherwise use defaultFontColor
    }


    const locationStyle = "color: white; background-color: transparent; font-family: " + defaultFontFamily + "; font-size: " + defaultFontSize + ";"; // Use default variables here
    const timeStyle = "color: white; background-color: transparent; font-weight: bold;";

    console.group(`%c[${callerLocation}][%c${currentTime}%c]  %c🗒 Table:`, locationStyle, timeStyle, locationStyle, `font-weight: bold; color: ${tableOptions.fontColor};`); // Group  expanded and changed "table" text

    console.table(processedData); // Use console.table to display the data

    console.groupEnd(); // End the  group
  };
  logger.tb = logger.table; // Shortcut for table

  return logger; // Return the main logger function with all variants attached.
})();
