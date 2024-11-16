import localFont from "next/font/local";

export const magilio = localFont({
  variable: "--magilio",
  src: [
    {
      path: "./MagilioRegular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

// bold medium regular variable
export const pally = localFont({
  variable: "--font-pally",
  src: [
    {
      path: "./pally/Pally-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./pally/Pally-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./pally/Pally-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./pally/Pally-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});
