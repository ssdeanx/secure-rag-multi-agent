
# Dark Theme explorations

Here are 10 different cutting-edge dark theme explorations for the project, based on modern UI/UX design research. Each theme provides a unique aesthetic and uses the OKLCH color space for vibrant, consistent colors.

---

### 1. Arcane Terminal

**Description:** Inspired by retro computer terminals and cyberpunk aesthetics. This theme uses a classic green-on-black palette, but is modernized with a deeper, off-black background and a more energetic, less-straining green for text and accents.

```css
:root {
  --background: oklch(10% 0.01 150);   /* Near-black with a hint of green */
  --foreground: oklch(85% 0.18 145);   /* Bright, clear green */
  --primary: oklch(90% 0.2 145);     /* The most vibrant green for primary actions */
  --secondary: oklch(60% 0.1 150);   /* A dimmer, secondary green */
  --accent: oklch(95% 0.15 140);     /* A slightly yellower green for highlights */
  --muted: oklch(40% 0.05 150);     /* Muted green for secondary text */
  --border: oklch(30% 0.05 150);     /* Dark green-tinged border */
}
```

---

### 2. Kyoto Night

**Description:** A sophisticated and calming theme inspired by the deep indigo and purple hues of a Japanese city at night. It's elegant, minimalist, and professional, with a single, sharp yellow accent for contrast.

```css
:root {
  --background: oklch(15% 0.05 275);  /* Deep, dark indigo */
  --foreground: oklch(90% 0.02 270);  /* Soft, pale lavender */
  --primary: oklch(75% 0.15 280);   /* Rich, vibrant purple */
  --secondary: oklch(40% 0.08 275);  /* Muted slate-purple */
  --accent: oklch(90% 0.15 90);     /* Sharp, cyber yellow */
  --muted: oklch(60% 0.04 270);     /* Grey-ish lavender for muted text */
  --border: oklch(25% 0.05 275);    /* Dark indigo border */
}
```

---

### 3. Quantum

**Description:** A clean, futuristic, and scientific theme. It uses a base of pure, cold grays and an electric cyan accent, evoking a sense of precision, data, and high technology.

```css
:root {
  --background: oklch(12% 0.01 230);  /* Very dark, cool grey */
  --foreground: oklch(95% 0.005 230); /* Almost white, with a cool tint */
  --primary: oklch(80% 0.2 220);     /* Bright, electric cyan */
  --secondary: oklch(50% 0.1 230);   /* Mid-tone cool grey */
  --accent: oklch(85% 0.15 180);    /* A slightly greener teal for accents */
  --muted: oklch(65% 0.02 230);     /* Light grey for muted text */
  --border: oklch(30% 0.03 230);    /* Dark grey border */
}
```

---

### 4. Solarpunk

**Description:** An optimistic, nature-meets-technology theme. It pairs a deep forest green background with warm, golden accents, creating a feeling of sustainable innovation and organic growth.

```css
:root {
  --background: oklch(15% 0.05 150);  /* Deep forest green */
  --foreground: oklch(92% 0.03 110);  /* Warm, creamy off-white */
  --primary: oklch(85% 0.15 100);   /* Bright, sun-kissed gold */
  --secondary: oklch(45% 0.08 130);  /* Muted olive green */
  --accent: oklch(75% 0.18 80);     /* Warm orange accent */
  --muted: oklch(65% 0.05 120);     /* Lighter, earthy green */
  --border: oklch(25% 0.05 140);    /* Dark olive border */
}
```

---

### 5. Midnight Drive

**Description:** A sleek, automotive-inspired theme combining a dark, asphalt-like background with the sharp, piercing red of taillights. It feels fast, modern, and focused.

```css
:root {
  --background: oklch(10% 0.01 250);  /* Charcoal black */
  --foreground: oklch(95% 0 0);        /* Pure white */
  --primary: oklch(70% 0.25 20);     /* Intense, fiery red */
  --secondary: oklch(40% 0.02 250);  /* Medium-dark grey */
  --accent: oklch(65% 0.28 30);     /* A slightly more orange-red for highlights */
  --muted: oklch(60% 0.01 250);     /* Lighter grey for secondary text */
  --border: oklch(25% 0.02 250);    /* Dark grey border */
}
```

---

### 6. Neo-Brutalist

**Description:** A raw, minimalist, and bold theme. It uses a stark, almost pure black background and an unapologetic, vibrant accent color. Typography and structure are key. Corners are sharp, and shadows are minimal.

```css
:root {
  --background: oklch(5% 0 0);         /* Almost pure black */
  --foreground: oklch(98% 0 0);       /* Almost pure white */
  --primary: oklch(75% 0.3 300);      /* Electric Magenta */
  --secondary: oklch(70% 0.005 250);  /* A very light, neutral grey */
  --accent: oklch(90% 0.15 90);      /* Sharp Yellow */
  --muted: oklch(50% 0.005 250);    /* Mid-grey */
  --border: oklch(40% 0.005 250);    /* A hard, visible grey border */
}
```

---

### 7. Halcyon

**Description:** A calm, focused, and airy dark theme. It uses a soft, off-black background and muted, low-saturation blues and teals to create a relaxed environment for concentration.

```css
:root {
  --background: oklch(20% 0.02 230);  /* Soft, dark slate blue */
  --foreground: oklch(90% 0.01 220);  /* Muted, soft cyan-white */
  --primary: oklch(75% 0.12 210);   /* Desaturated, calm blue */
  --secondary: oklch(50% 0.08 220);  /* Muted teal-grey */
  --accent: oklch(80% 0.1 180);     /* Soft seafoam green */
  --muted: oklch(60% 0.04 220);     /* Lighter slate blue */
  --border: oklch(30% 0.03 225);    /* Muted blue border */
}
```

---

### 8. Dune

**Description:** Inspired by desert landscapes at twilight. This theme uses warm, earthy off-black and sand-colored tones, creating a unique, organic, and mysterious atmosphere.

```css
:root {
  --background: oklch(15% 0.02 60);   /* Deep, warm brown-black */
  --foreground: oklch(90% 0.03 80);   /* Pale sand color */
  --primary: oklch(75% 0.18 70);    /* Rich, warm ochre */
  --secondary: oklch(40% 0.08 75);   /* Muted, earthy brown */
  --accent: oklch(70% 0.25 40);     /* Fiery sunset orange */
  --muted: oklch(60% 0.05 70);      /* Lighter sand color */
  --border: oklch(25% 0.04 65);     /* Dark brown border */
}
```

---

### 9. Monolith

**Description:** A powerful, minimalist, and monochromatic theme. It relies entirely on shades of neutral grey, from near-black to near-white. The focus is purely on typography, spacing, and structure.

```css
:root {
  --background: oklch(8% 0 0);        /* Pure, deep black */
  --foreground: oklch(98% 0 0);       /* Pure, bright white */
  --primary: oklch(90% 0 0);        /* White for primary elements */
  --secondary: oklch(65% 0 0);      /* Mid-grey */
  --accent: oklch(100% 0 0);       /* Pure white as the accent */
  --muted: oklch(50% 0 0);        /* Darker grey for muted text */
  --border: oklch(35% 0 0);         /* A clearly visible grey border */
}
```

---

### 10. Interstellar

**Description:** A cosmic theme inspired by nebulae and galaxies. It uses a deep space background with vibrant, multi-colored accents that feel energetic and vast.

```css
:root {
  --background: oklch(10% 0.02 280);  /* Deep space purple-black */
  --foreground: oklch(95% 0.01 280);  /* Pale starlight lavender */
  --primary: oklch(75% 0.25 290);   /* Vibrant magenta nebula */
  --secondary: oklch(70% 0.2 240);   /* Bright cyan star */
  --accent: oklch(85% 0.22 320);    /* Hot pink accent */
  --muted: oklch(60% 0.05 280);     /* Muted galaxy dust purple */
  --border: oklch(25% 0.05 280);    /* Dark purple border */
}
```
