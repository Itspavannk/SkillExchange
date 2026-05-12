import { useEffect, useState } from "react";

export default function useResponsive() {

  const [width, setWidth] =
    useState(window.innerWidth);

  useEffect(() => {

    const onResize = () =>
      setWidth(window.innerWidth);

    window.addEventListener(
      "resize",
      onResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        onResize
      );

  }, []);

  return {
    width,
isMobile: width < 1024,
isTablet: width >= 1024 && width < 1440,
    isDesktop: width >= 1440,
  };
}