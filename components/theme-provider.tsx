import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

export default function ThemeProvider({
    children, ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}