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
