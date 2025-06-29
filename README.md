# RespuestApp

This project uses **Vite** with **React** and **Tailwind CSS**.

## Tailwind setup

Tailwind is integrated using the `@tailwindcss/vite` plugin and PostCSS.

The CSS entry file `frontend/src/index.css` imports all Tailwind layers:

```css
@import 'tailwindcss';
```

These styles are then built through Vite and PostCSS.

The configuration files used by Vite and Tailwind are:

- `frontend/vite.config.js` – Vite configuration which loads React and the Tailwind plugin.
  ```js
  plugins: [react(), tailwindcss()]
  ```
- `frontend/postcss.config.js` – defines the PostCSS plugins so Tailwind can process the CSS.
- `frontend/tailwind.config.js` – Tailwind settings and content paths.

Run the development server from the `frontend` directory:

```bash
npm run dev
```

Vite will build the Tailwind styles automatically.
