# J Nishanth Bhat | Developer Portfolio

An existing personal portfolio updated with React while preserving its dark blue and cyan identity, personal profile, featured projects, number guessing game, and local task manager.

## Run locally

1. Install [Node.js](https://nodejs.org/).
2. From this repository, run `npm install`.
3. Start the development server with `npm run dev` and open the local URL Vite prints.
4. Create a production build with `npm run build`.

## Week 05 React concepts

- **JSX:** `src/App.jsx` and the reusable files in `src/components/` describe the page UI with JSX.
- **Props:** `App` passes titles, section labels, data arrays, and contact links to `About`, `Skills`, `Projects`, and `Contact`.
- **Arrays and `.map()`:** `src/data.js` keeps skill groups, projects, and social links as arrays. Components map those arrays into cards, filters, tags, and links.
- **`useState`:** Theme, skill and project filters, guessing game state, and task manager state are interactive React state. The selected theme and tasks persist in browser local storage.
- **Responsive design:** `style.css` includes tablet and mobile breakpoints; the original portfolio layout and styles remain the foundation.

## Project structure

```text
src/
  components/  About, Skills, Projects, and Contact sections
  App.jsx      Portfolio shell and interactive game/task features
  data.js      Skills, projects, and social link content
  main.jsx     React entry point
index.html     Vite document shell
style.css      Portfolio styling and responsive layouts
profile.jpeg   Existing profile image
```
