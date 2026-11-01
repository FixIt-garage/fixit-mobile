// Шкала відступів (сітка кратна 4)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// Сталі розміри макета (екрани 360×800 у Figma)
export const layout = {
  screenPadding: 20, // від краю екрана до вмісту
  cardPadding: 16, // усередині карток
  floatingInset: 16, // плаваючі шапки й меню від краю
  statusBar: 24, // висота статус-бару
  bottomInset: 24, // нижній відступ меню та кнопок
  firstRowTop: 36, // верх першого рядка екрана
  topBarHeight: 56,
  buttonHeight: 56,
} as const;