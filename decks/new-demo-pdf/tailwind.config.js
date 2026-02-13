/** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            background: 'hsl(222.2 84% 4.9%)',
            foreground: 'hsl(210 40% 98%)',
            card: 'hsl(222.2 84% 4.9%)',
            'card-foreground': 'hsl(210 40% 98%)',
            primary: 'hsl(210 40% 98%)',
            'primary-foreground': 'hsl(222.2 84% 4.9%)',
            border: 'hsl(217.2 32.6% 17.5%)',
            input: 'hsl(217.2 32.6% 17.5%)',
          },
        },
      },
      plugins: [],
    }