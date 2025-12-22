function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  const luminance = calculateLuminance(rgb);

  // If luminance is greater than 0.5, return black text, else return white
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function calculateLuminance({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): number {
  // Normalize the RGB values to the range 0-1
  const normalize = (value: number): number => {
    value = value / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const rL = normalize(r);
  const gL = normalize(g);
  const bL = normalize(b);

  // Calculate luminance using the standard formula
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

// Example usage:
const hexColor: string = "#3498db"; // A shade of blue
const contrastColor: string = getContrastColor(hexColor);
console.log(
  `For background color ${hexColor}, the best text color is: ${contrastColor}`,
);
