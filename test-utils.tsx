import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import { ThemeContext } from "./components/ThemeLabel";

// Обгортає кожен тестований компонент у всі потрібні провайдери.
// Пізніше сюди додамо справжні (навігація, тема, API-клієнт).
function AllProviders({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="light">{children}</ThemeContext.Provider>;
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Реекспортуємо все, але замінюємо стандартний render на наш
export * from "@testing-library/react-native";
export { customRender as render };
