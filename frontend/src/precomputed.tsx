import hash from "object-hash";

const values: Record<string, any> = {
  "5e0ce9955eada25649c24b234ad1969332e24eca": {
    type: "group",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    items: [
      {
        type: "rect",
        x: 0,
        y: 11.343642441124013,
        width: 18,
        height: 18,
        fill: "hsl(0, 50%, 50%)"
      },
      {
        type: "rect",
        x: 20,
        y: 18.47433736937233,
        width: 18,
        height: 18,
        fill: "hsl(30, 50%, 50%)"
      },
      {
        type: "rect",
        x: 40,
        y: 17.63774618976614,
        width: 18,
        height: 18,
        fill: "hsl(60, 50%, 50%)"
      },
      {
        type: "rect",
        x: 60,
        y: 12.550690257394217,
        width: 18,
        height: 18,
        fill: "hsl(90, 50%, 50%)"
      },
      {
        type: "rect",
        x: 80,
        y: 14.95435087091941,
        width: 18,
        height: 18,
        fill: "hsl(120, 50%, 50%)"
      }
    ]
  }
};

export const lookupPrecomputed = (
  input: string,
  seed: number
): string | undefined => {
  const hashValue = hash.sha1(input + seed);
  return values[hashValue];
};
