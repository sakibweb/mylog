// Usage examples:
log("Default log message - Dark Gray BG, White Text, Monospace");

log.info("Info message - Blue, Info Icon");
log.i("Info message - Shortcut");

log.warn("Warning message - Amber, Warning Icon");
log.w("Warning message - Shortcut");

log.error("Error message - Red, Error Icon");
log.e("Error message - Shortcut");

log.success("Success message - Green, Checkmark Icon");
log.s("Success message - Shortcut");

log.debug("Debug message - Gray");
log.d("Debug message - Shortcut");

log.terminal("Terminal message - Green on Black");
log.t("Terminal message - Shortcut");

log.big("Big message - Larger Text");
log.b("Big message - Shortcut");

log.highlight("Highlight message - Yellow Background");
log.h("Highlight message - Shortcut");

log.fancy("Fancy message - Blue, Arial, Shadow");
log.f("Fancy message - Shortcut");

log.purple("Purple message - Purple Text");
log.p("Purple message - Shortcut");

log.asciiArt("ASCII ART TEXT", { fontColor: "lime" }); // ASCII Art example
log.a("ASCII ART TEXT Shortcut", { fontColor: "cyan", backColor: "black" }); // ASCII Art shortcut

// Example with custom options overriding defaults:
log.warn("Custom Warning", { fontColor: "red", backColor: "yellow", fontSize: "18px" });
log.terminal("Custom Terminal", { fontSize: "18px", fontWeight: "normal" }); // Override fontWeight to normal

// --- Multi-color message examples ---
log([
  { text: "This is ", fontColor: "white" },
  { text: "multi-color ", fontColor: "yellow", fontWeight: "bold" },
  { text: "text!", fontColor: "cyan", backColor: "black" }
]);

log.info([
  { text: "Info: ", style: { fontWeight: "bold" } }, // Bold "Info:" part
  { text: "This is an info message with ", style: {} }, // Default info style
  { text: "highlighted part", style: { backColor: "yellow", fontColor: "black" } } // Highlighted part
]);

log.terminal([
  { text: "Terminal: ", style: { fontWeight: "bold", fontColor: "lime" } }, // Bold "Terminal:" part, lime green
  { text: "Command executed ", style: { fontColor: "white" } }, // White text for command
  { "[OK]": { fontColor: "green", fontWeight: "bold" } } // Green [OK] status
]);

// --- Auto-type detection examples ---
log({ key: "value", number: 123, bool: true });
log([1, 2, 3, "string", { nested: "object" }]);
log(12345);
log(true);
log(null);
log(undefined);
log(function myFunction() { console.log("Hello"); });

// --- Problematic Usage Example (Object in Multi-color) ---
const clientData = { name: "Example Client", id: 123 };
log([
  { text: "Client Data Stored ", style: { fontColor: "yellow", fontWeight: "bold" } },
  clientData // Pass the object directly as a segment (will now be formatted correctly)
]);
