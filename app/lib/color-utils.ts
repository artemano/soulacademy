export function rgbaToHex(rgba: string): string {
  // Extract the RGB values from the RGBA string
  const rgbValues = rgba
    .substring(rgba.indexOf("(") + 1, rgba.lastIndexOf(")"))
    .split(",");

  // Convert the RGB values to hexadecimal
  const r = parseInt(rgbValues[0].trim(), 10).toString(16).padStart(2, "0");
  const g = parseInt(rgbValues[1].trim(), 10).toString(16).padStart(2, "0");
  const b = parseInt(rgbValues[2].trim(), 10).toString(16).padStart(2, "0");

  // Create the hex color code
  const hexColor = `#${r}${g}${b}`;

  return hexColor;
}
export function hexToRGBA(hex: string, alpha: number): string {
  // Remove the '#' character from the beginning of the hex code
  hex = hex.replace("#", "");

  // Convert the hex code to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Create the RGBA color value
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;

  return rgba;
}
