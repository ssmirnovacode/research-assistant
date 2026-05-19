export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function fixTableRowsMd(raw: string): string {
  return raw
    .split("\n")
    .map((line) => {
      // Fix misaligned table rows where the first cell is empty and content
      // is shifted one column to the right: | | real | more | → | real | more |
      if (/^\|/.test(line)) {
        const cells = line.split("|").map((c) => c.trim());
        const inner = cells.slice(1, -1);
        if (inner.length >= 2 && inner[0] === "" && inner[1] !== "") {
          return "| " + inner.slice(1).join(" | ") + " |";
        }
      }
      return line;
    })
    .join("\n");
}
