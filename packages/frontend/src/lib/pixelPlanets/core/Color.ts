import { Vector4 } from "three";

export interface ColorPalette {
  color1: Color;
  color2: Color;
  color3?: Color;
  color4?: Color;
}

export class Color {
  public red: number;
  public green: number;
  public blue: number;
  public alpha: number;

  private readonly MaxColorSpace = 255;

  constructor(red: number, green: number, blue: number, alpha: number = 1) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  private toColorSpace(value: number): number {
    return value / this.MaxColorSpace;
  }

  public toVector(): Vector4 {
    return new Vector4(
      this.toColorSpace(this.red),
      this.toColorSpace(this.green),
      this.toColorSpace(this.blue),
      this.alpha
    );
  }
}
