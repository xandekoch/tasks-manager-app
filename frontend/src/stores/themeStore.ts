import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeStore {
    isDark: boolean
    toggleTheme: () => void
}

export const useThemeStore = create(
    persist<ThemeStore>(
        (set, _get) => ({
            isDark: true,
            toggleTheme: () => {
                set((state) => {
                    const newIsDark = !state.isDark
                    document.documentElement.classList.toggle("dark", newIsDark)
                    return { isDark: newIsDark }
                })
            },
        }),
        {
            name: "theme-storage",
        }
    )
)

export const initializeTheme = () => {
    const themeStorage = localStorage.getItem("theme-storage")
    const isDark = themeStorage
      ? JSON.parse(themeStorage).state.isDark
      : false
  
    document.documentElement.classList.toggle("dark", isDark)
  }
  
