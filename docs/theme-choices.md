
# Dark Theme Explorations

Here are 30 different cutting-edge dark theme explorations for the project, based on modern UI/UX design research. Each theme provides a unique aesthetic and uses the OKLCH color space for vibrant, consistent colors, following the full structure of the project's CSS variables.

---

### 1. Arcane Terminal (Improved)

**Description:** This theme channels the classic aesthetic of retro-futuristic computer terminals and the broader cyberpunk genre. It's built on a foundational green-on-black palette, but modernized to be easier on the eyes and more suitable for a professional interface. The background is a deep, near-black with a subtle green tint, preventing the harshness of pure black. The foreground text uses a bright, clear green that ensures readability without being overly saturated. Primary actions and highlights use the most vibrant shade of green, drawing user attention, while secondary elements and borders use dimmer, more muted greens to create a clear visual hierarchy and a sense of depth.

```css
.dark {
  --background: oklch(10% 0.01 150);
  --foreground: oklch(85% 0.18 145);
  --card: oklch(15% 0.02 150);
  --card-foreground: oklch(85% 0.18 145);
  --popover: oklch(12% 0.015 150);
  --popover-foreground: oklch(85% 0.18 145);
  --primary: oklch(90% 0.2 145);
  --primary-foreground: oklch(10% 0.01 150);
  --secondary: oklch(60% 0.1 150);
  --secondary-foreground: oklch(95% 0.18 145);
  --muted: oklch(40% 0.05 150);
  --muted-foreground: oklch(65% 0.1 150);
  --accent: oklch(95% 0.15 140);
  --accent-foreground: oklch(10% 0.01 150);
  --destructive: oklch(60% 0.2 20);
  --destructive-foreground: oklch(95% 0.05 20);
  --border: oklch(30% 0.05 150);
  --input: oklch(25% 0.04 150);
  --ring: oklch(90% 0.2 145);
}
```

---

### 2. Kyoto Night (Improved)

**Description:** Inspired by the sophisticated and serene atmosphere of a Japanese city at night, this theme is built on a palette of deep indigo and rich purple hues. It evokes a sense of elegance, minimalism, and calm professionalism. The background is a dark, muted indigo, reminiscent of a twilight sky. The foreground is a soft, pale lavender, providing a gentle contrast that is easy to read. The primary color is a vibrant, saturated purple for key interactive elements, while a single, sharp yellow accent provides a striking point of contrast for critical highlights or notifications, cutting through the cool palette like a distant streetlight.

```css
.dark {
  --background: oklch(15% 0.05 275);
  --foreground: oklch(90% 0.02 270);
  --card: oklch(20% 0.05 275);
  --card-foreground: oklch(90% 0.02 270);
  --popover: oklch(18% 0.05 275);
  --popover-foreground: oklch(90% 0.02 270);
  --primary: oklch(75% 0.15 280);
  --primary-foreground: oklch(98% 0.01 280);
  --secondary: oklch(40% 0.08 275);
  --secondary-foreground: oklch(90% 0.02 270);
  --muted: oklch(60% 0.04 270);
  --muted-foreground: oklch(75% 0.03 270);
  --accent: oklch(90% 0.15 90);
  --accent-foreground: oklch(15% 0.05 90);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(25% 0.05 275);
  --input: oklch(22% 0.05 275);
  --ring: oklch(90% 0.15 90);
}
```

---

### 3. Quantum (Improved)

**Description:** This theme is designed to feel clean, futuristic, and scientific. It uses a palette of pure, cold-toned grays, creating a sterile and precise environment. The only color comes from an electric, vibrant cyan used for primary actions and accents, which evokes a sense of high technology, data visualization, and energy. This minimalist approach removes all distractions, focusing the user entirely on the content and interactive elements. It is ideal for data-heavy applications, dashboards, or any interface where clarity and precision are paramount.

```css
.dark {
  --background: oklch(12% 0.01 230);
  --foreground: oklch(95% 0.005 230);
  --card: oklch(18% 0.015 230);
  --card-foreground: oklch(95% 0.005 230);
  --popover: oklch(15% 0.01 230);
  --popover-foreground: oklch(95% 0.005 230);
  --primary: oklch(80% 0.2 220);
  --primary-foreground: oklch(10% 0.02 220);
  --secondary: oklch(50% 0.1 230);
  --secondary-foreground: oklch(98% 0.01 230);
  --muted: oklch(65% 0.02 230);
  --muted-foreground: oklch(80% 0.01 230);
  --accent: oklch(85% 0.15 180);
  --accent-foreground: oklch(10% 0.02 180);
  --destructive: oklch(60% 0.25 20);
  --destructive-foreground: oklch(95% 0.05 20);
  --border: oklch(30% 0.03 230);
  --input: oklch(25% 0.02 230);
  --ring: oklch(80% 0.2 220);
}
```

---

### 4. Solarpunk (Improved)

**Description:** A theme that embodies optimistic, nature-meets-technology aesthetics. It rejects the cold, sterile feel of many dark modes in favor of warmth and organic tones. The background is a deep forest green, paired with a creamy, warm off-white for text. Accents and primary actions are a sun-kissed gold and a warm orange, creating a feeling of sustainable innovation, positive energy, and harmony between the natural and the digital world. It's a perfect choice for projects focused on environmental tech, sustainability, or simply a more hopeful vision of the future.

```css
.dark {
  --background: oklch(15% 0.05 150);
  --foreground: oklch(92% 0.03 110);
  --card: oklch(20% 0.05 145);
  --card-foreground: oklch(92% 0.03 110);
  --popover: oklch(18% 0.05 145);
  --popover-foreground: oklch(92% 0.03 110);
  --primary: oklch(85% 0.15 100);
  --primary-foreground: oklch(20% 0.05 100);
  --secondary: oklch(45% 0.08 130);
  --secondary-foreground: oklch(95% 0.04 110);
  --muted: oklch(65% 0.05 120);
  --muted-foreground: oklch(80% 0.04 115);
  --accent: oklch(75% 0.18 80);
  --accent-foreground: oklch(15% 0.05 80);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(25% 0.05 140);
  --input: oklch(22% 0.05 140);
  --ring: oklch(85% 0.15 100);
}
```

---

### 5. Midnight Drive (Improved)

**Description:** A sleek, high-energy theme inspired by automotive design and late-night drives. The background is a dark, asphalt-like charcoal, creating a sense of focus and speed. All contrast is provided by a sharp, piercing red, reminiscent of taillights or a sports car's dashboard. This theme is aggressive, modern, and confident. It's an excellent fit for projects that want to convey a sense of power, performance, and forward momentum. The minimal palette keeps the interface feeling clean and uncluttered, despite the intensity of the accent color.

```css
.dark {
  --background: oklch(10% 0.01 250);
  --foreground: oklch(95% 0 0);
  --card: oklch(15% 0.01 250);
  --card-foreground: oklch(95% 0 0);
  --popover: oklch(12% 0.01 250);
  --popover-foreground: oklch(95% 0 0);
  --primary: oklch(70% 0.25 20);
  --primary-foreground: oklch(98% 0.02 20);
  --secondary: oklch(40% 0.02 250);
  --secondary-foreground: oklch(95% 0 0);
  --muted: oklch(60% 0.01 250);
  --muted-foreground: oklch(75% 0.005 250);
  --accent: oklch(65% 0.28 30);
  --accent-foreground: oklch(98% 0.02 30);
  --destructive: oklch(70% 0.25 20);
  --destructive-foreground: oklch(98% 0.02 20);
  --border: oklch(25% 0.02 250);
  --input: oklch(20% 0.015 250);
  --ring: oklch(70% 0.25 20);
}
```

---

### 6. Neo-Brutalist (Improved)

**Description:** This theme embraces the raw, unapologetic principles of brutalist design, updated for a modern digital context. It features a stark, pure black background and high-contrast white text. The only color is a single, electric accent (like magenta or lime), used sparingly for maximum impact. This style avoids gradients, soft shadows, and rounded corners in favor of sharp lines, solid blocks of color, and a strong focus on typographic hierarchy. It's a statement theme that feels confident, honest, and structurally sound.

```css
.dark {
  --background: oklch(5% 0 0);
  --foreground: oklch(98% 0 0);
  --card: oklch(10% 0 0);
  --card-foreground: oklch(98% 0 0);
  --popover: oklch(8% 0 0);
  --popover-foreground: oklch(98% 0 0);
  --primary: oklch(75% 0.3 320);
  --primary-foreground: oklch(100% 0 0);
  --secondary: oklch(80% 0 0);
  --secondary-foreground: oklch(5% 0 0);
  --muted: oklch(50% 0 0);
  --muted-foreground: oklch(70% 0 0);
  --accent: oklch(90% 0.25 120);
  --accent-foreground: oklch(10% 0.05 120);
  --destructive: oklch(65% 0.25 25);
  --destructive-foreground: oklch(100% 0 0);
  --border: oklch(40% 0 0);
  --input: oklch(15% 0 0);
  --ring: oklch(75% 0.3 320);
}
```

---

### 7. Halcyon (Improved)

**Description:** A theme designed for calm, focus, and clarity. It avoids pure black and high-energy colors, instead using a soft, dark slate-blue as its base. The palette is composed of muted, desaturated blues and teals, creating a serene and airy environment that is easy on the eyes for long periods. It's perfect for productivity apps, documentation sites, or any interface where the goal is to reduce digital noise and promote concentration. The low-saturation colors give it a sophisticated and understated feel.

```css
.dark {
  --background: oklch(20% 0.02 230);
  --foreground: oklch(90% 0.01 220);
  --card: oklch(25% 0.025 230);
  --card-foreground: oklch(90% 0.01 220);
  --popover: oklch(22% 0.02 230);
  --popover-foreground: oklch(90% 0.01 220);
  --primary: oklch(75% 0.12 210);
  --primary-foreground: oklch(100% 0.01 210);
  --secondary: oklch(50% 0.08 220);
  --secondary-foreground: oklch(95% 0.01 220);
  --muted: oklch(60% 0.04 220);
  --muted-foreground: oklch(75% 0.03 220);
  --accent: oklch(80% 0.1 180);
  --accent-foreground: oklch(15% 0.02 180);
  --destructive: oklch(60% 0.2 20);
  --destructive-foreground: oklch(95% 0.05 20);
  --border: oklch(30% 0.03 225);
  --input: oklch(28% 0.025 225);
  --ring: oklch(75% 0.12 210);
}
```

---

### 8. Dune (Improved)

**Description:** Inspired by the vast, twilight landscapes of a desert planet, this theme offers a unique and organic alternative to typical dark modes. It uses a warm, earthy brown-black as its base, with text colors reminiscent of pale sand. The primary and accent colors are a rich ochre and a fiery sunset orange, creating a mysterious and evocative atmosphere. This palette is perfect for projects that want to stand out with a more natural and cinematic feel, moving away from the cold blues and greens of conventional tech aesthetics.

```css
.dark {
  --background: oklch(15% 0.02 60);
  --foreground: oklch(90% 0.03 80);
  --card: oklch(20% 0.03 65);
  --card-foreground: oklch(90% 0.03 80);
  --popover: oklch(18% 0.03 65);
  --popover-foreground: oklch(90% 0.03 80);
  --primary: oklch(75% 0.18 70);
  --primary-foreground: oklch(15% 0.02 70);
  --secondary: oklch(40% 0.08 75);
  --secondary-foreground: oklch(95% 0.04 80);
  --muted: oklch(60% 0.05 70);
  --muted-foreground: oklch(75% 0.04 75);
  --accent: oklch(70% 0.25 40);
  --accent-foreground: oklch(10% 0.05 40);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(25% 0.04 65);
  --input: oklch(22% 0.04 65);
  --ring: oklch(70% 0.25 40);
}
```

---

### 9. Monolith (Improved)

**Description:** A powerful and minimalist monochromatic theme that strips the interface down to its essential elements. It uses only shades of neutral grey, from a deep, pure black background to a bright, pure white foreground. Without color, the entire design relies on the strength of its typography, spacing, and structure to create hierarchy and guide the user. This theme is confident, timeless, and incredibly versatile. It is the ultimate expression of minimalism, making the content itself the primary focus of the design.

```css
.dark {
  --background: oklch(8% 0 0);
  --foreground: oklch(98% 0 0);
  --card: oklch(14% 0 0);
  --card-foreground: oklch(98% 0 0);
  --popover: oklch(10% 0 0);
  --popover-foreground: oklch(98% 0 0);
  --primary: oklch(90% 0 0);
  --primary-foreground: oklch(8% 0 0);
  --secondary: oklch(65% 0 0);
  --secondary-foreground: oklch(8% 0 0);
  --muted: oklch(50% 0 0);
  --muted-foreground: oklch(70% 0 0);
  --accent: oklch(100% 0 0);
  --accent-foreground: oklch(8% 0 0);
  --destructive: oklch(70% 0.25 20);
  --destructive-foreground: oklch(98% 0 0);
  --border: oklch(35% 0 0);
  --input: oklch(20% 0 0);
  --ring: oklch(80% 0 0);
}
```

---

### 10. Interstellar (Improved)

**Description:** A vibrant, cosmic theme inspired by the dazzling colors of nebulae and distant galaxies. The background is a deep, space-like purple-black, creating a canvas for a multi-colored palette of accents. The primary color is a vibrant magenta, while the secondary is a bright cyan, with a hot pink for other highlights. This theme is energetic, imaginative, and full of life, perfect for projects that want to feel vast, creative, and awe-inspiring. It's a departure from single-accent themes, offering a richer, more dynamic visual experience.

```css
.dark {
  --background: oklch(10% 0.02 280);
  --foreground: oklch(95% 0.01 280);
  --card: oklch(15% 0.03 280);
  --card-foreground: oklch(95% 0.01 280);
  --popover: oklch(12% 0.03 280);
  --popover-foreground: oklch(95% 0.01 280);
  --primary: oklch(75% 0.25 290);
  --primary-foreground: oklch(100% 0.05 290);
  --secondary: oklch(70% 0.2 240);
  --secondary-foreground: oklch(10% 0.05 240);
  --muted: oklch(60% 0.05 280);
  --muted-foreground: oklch(75% 0.03 280);
  --accent: oklch(85% 0.22 320);
  --accent-foreground: oklch(15% 0.05 320);
  --destructive: oklch(65% 0.25 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(25% 0.05 280);
  --input: oklch(20% 0.04 280);
  --ring: oklch(85% 0.22 320);
}
```

---

### 11. Redwood (Improved)

**Description:** A theme that balances the natural and the technical. It's inspired by the deep, rich colors of a redwood forest, using a dark, desaturated red-brown as its base. The foreground and accents are a soft, warm beige and a muted orange, creating a feeling of stability, reliability, and timelessness. This palette is professional and unique, avoiding the common blues and greens of the tech world while still feeling grounded and trustworthy. It's ideal for enterprise applications or any project that wants to convey a sense of enduring quality.

```css
.dark {
  --background: oklch(18% 0.04 30);
  --foreground: oklch(90% 0.02 70);
  --card: oklch(22% 0.04 30);
  --card-foreground: oklch(90% 0.02 70);
  --popover: oklch(20% 0.04 30);
  --popover-foreground: oklch(90% 0.02 70);
  --primary: oklch(70% 0.15 40);
  --primary-foreground: oklch(98% 0.02 40);
  --secondary: oklch(45% 0.1 45);
  --secondary-foreground: oklch(90% 0.02 70);
  --muted: oklch(60% 0.05 50);
  --muted-foreground: oklch(75% 0.04 60);
  --accent: oklch(75% 0.18 60);
  --accent-foreground: oklch(15% 0.03 60);
  --destructive: oklch(60% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(30% 0.05 35);
  --input: oklch(25% 0.05 35);
  --ring: oklch(70% 0.15 40);
}
```

---

### 12. Ghost (Improved)

**Description:** An ultra-minimalist, almost ethereal theme. The background is a very light, cool-toned grey, just a few shades away from pure white, but used as a dark mode base. Text is a dark charcoal, providing high contrast. The magic of this theme is its accent: a faint, almost invisible color that only appears on hover or for active states, like a ghost in the machine. This creates a surprisingly clean and focused experience, where interactive elements reveal themselves upon user engagement.

```css
.dark {
  --background: oklch(25% 0.005 240);
  --foreground: oklch(90% 0.005 240);
  --card: oklch(30% 0.005 240);
  --card-foreground: oklch(90% 0.005 240);
  --popover: oklch(28% 0.005 240);
  --popover-foreground: oklch(90% 0.005 240);
  --primary: oklch(80% 0.05 250);
  --primary-foreground: oklch(15% 0.01 250);
  --secondary: oklch(50% 0.01 240);
  --secondary-foreground: oklch(95% 0.005 240);
  --muted: oklch(70% 0.005 240);
  --muted-foreground: oklch(50% 0.005 240);
  --accent: oklch(85% 0.1 200);
  --accent-foreground: oklch(15% 0.02 200);
  --destructive: oklch(65% 0.2 20);
  --destructive-foreground: oklch(95% 0.05 20);
  --border: oklch(40% 0.005 240);
  --input: oklch(35% 0.005 240);
  --ring: oklch(80% 0.05 250);
}
```

---

### 13. Aquatic (Improved)

**Description:** A theme that draws inspiration from the deep ocean. The background is a dark, muted teal, and the palette consists of various shades of blue, green, and cyan. It feels fluid, calm, and deep. The accent color is a bright, bioluminescent green, mimicking creatures of the abyss. This theme is perfect for projects related to data, finance, or any domain where a sense of depth and flow is desired. It's a more colorful and organic take on a typical blue-based tech theme.

```css
.dark {
  --background: oklch(18% 0.04 190);
  --foreground: oklch(90% 0.02 180);
  --card: oklch(22% 0.04 190);
  --card-foreground: oklch(90% 0.02 180);
  --popover: oklch(20% 0.04 190);
  --popover-foreground: oklch(90% 0.02 180);
  --primary: oklch(75% 0.15 200);
  --primary-foreground: oklch(15% 0.03 200);
  --secondary: oklch(50% 0.1 185);
  --secondary-foreground: oklch(95% 0.02 180);
  --muted: oklch(65% 0.05 185);
  --muted-foreground: oklch(80% 0.03 185);
  --accent: oklch(88% 0.2 150);
  --accent-foreground: oklch(15% 0.04 150);
  --destructive: oklch(60% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(30% 0.05 190);
  --input: oklch(25% 0.05 190);
  --ring: oklch(88% 0.2 150);
}
```

---

### 14. Inferno (Improved)

**Description:** A bold, high-energy theme that uses a palette of black, charcoal, and fiery orange. It's designed to be intense and attention-grabbing. The background is a deep charcoal, with a bright, almost glowing orange used for primary actions, highlights, and focus rings. This theme conveys speed, power, and intensity. It's not for the faint of heart, but it makes a powerful statement and is perfect for gaming, streaming, or any brand that wants to project pure energy.

```css
.dark {
  --background: oklch(10% 0.01 40);
  --foreground: oklch(95% 0.01 60);
  --card: oklch(15% 0.02 40);
  --card-foreground: oklch(95% 0.01 60);
  --popover: oklch(12% 0.02 40);
  --popover-foreground: oklch(95% 0.01 60);
  --primary: oklch(75% 0.25 50);
  --primary-foreground: oklch(100% 0.05 50);
  --secondary: oklch(40% 0.15 45);
  --secondary-foreground: oklch(95% 0.02 60);
  --muted: oklch(60% 0.1 55);
  --muted-foreground: oklch(80% 0.05 55);
  --accent: oklch(80% 0.28 40);
  --accent-foreground: oklch(10% 0.05 40);
  --destructive: oklch(70% 0.25 25);
  --destructive-foreground: oklch(98% 0.05 25);
  --border: oklch(25% 0.05 40);
  --input: oklch(20% 0.04 40);
  --ring: oklch(80% 0.28 40);
}
```

---

### 15. Manuscript (Improved)

**Description:** A theme designed for reading and writing. It uses a warm, soft, sepia-toned dark background instead of a cool black or blue. The text is a gentle cream color, and the primary accent is a classic, deep red, reminiscent of an editor's pen. This theme is designed to reduce eye strain and create a comfortable, academic, and focused environment. It's perfect for documentation sites, blogs, or any long-form content platform. The warmth of the palette is inviting and feels less sterile than typical dark modes.

```css
.dark {
  --background: oklch(22% 0.03 70);
  --foreground: oklch(88% 0.02 80);
  --card: oklch(26% 0.03 70);
  --card-foreground: oklch(88% 0.02 80);
  --popover: oklch(24% 0.03 70);
  --popover-foreground: oklch(88% 0.02 80);
  --primary: oklch(60% 0.18 30);
  --primary-foreground: oklch(95% 0.03 30);
  --secondary: oklch(45% 0.1 50);
  --secondary-foreground: oklch(90% 0.02 80);
  --muted: oklch(65% 0.05 70);
  --muted-foreground: oklch(80% 0.03 75);
  --accent: oklch(70% 0.15 50);
  --accent-foreground: oklch(15% 0.03 50);
  --destructive: oklch(60% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(35% 0.04 70);
  --input: oklch(30% 0.04 70);
  --ring: oklch(60% 0.18 30);
}
```

---

### 16. Umbra

**Description:** A deep, shadowy theme inspired by the design principles of the Linear app. It uses a near-black, desaturated cool tone for the background, creating a focused, distraction-free canvas. The primary accent is a strong, decisive indigo, used sparingly for interactive elements to guide the user without overwhelming them. The entire palette is built on a foundation of high contrast and clarity, making it ideal for complex, data-rich interfaces where focus is paramount. It is a professional, clean, and highly functional theme.

```css
.dark {
  --background: oklch(12% 0.015 255);
  --foreground: oklch(96% 0.01 255);
  --card: oklch(18% 0.02 255);
  --card-foreground: oklch(96% 0.01 255);
  --popover: oklch(15% 0.015 255);
  --popover-foreground: oklch(96% 0.01 255);
  --primary: oklch(65% 0.15 265);
  --primary-foreground: oklch(100% 0.02 265);
  --secondary: oklch(40% 0.05 260);
  --secondary-foreground: oklch(96% 0.01 255);
  --muted: oklch(65% 0.03 255);
  --muted-foreground: oklch(80% 0.02 255);
  --accent: oklch(70% 0.12 250);
  --accent-foreground: oklch(15% 0.03 250);
  --destructive: oklch(60% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(28% 0.02 255);
  --input: oklch(22% 0.02 255);
  --ring: oklch(65% 0.15 265);
}
```

---

### 17. Agent

**Description:** A theme that feels intelligent, active, and slightly artificial. It uses a dark, muted teal background, with brighter, more saturated teals and cyans for primary and secondary actions. The accent color is a sharp, unexpected violet, giving the theme a unique and memorable personality. It's designed to feel like you're interacting with an AI agent – clean, efficient, but with a spark of something different. This is perfect for AI-powered applications, chatbots, or any product that wants to feel both smart and distinctive.

```css
.dark {
  --background: oklch(18% 0.03 210);
  --foreground: oklch(92% 0.01 200);
  --card: oklch(23% 0.03 210);
  --card-foreground: oklch(92% 0.01 200);
  --popover: oklch(20% 0.03 210);
  --popover-foreground: oklch(92% 0.01 200);
  --primary: oklch(80% 0.15 205);
  --primary-foreground: oklch(15% 0.03 205);
  --secondary: oklch(60% 0.1 200);
  --secondary-foreground: oklch(95% 0.01 200);
  --muted: oklch(65% 0.04 205);
  --muted-foreground: oklch(80% 0.02 205);
  --accent: oklch(75% 0.2 290);
  --accent-foreground: oklch(15% 0.05 290);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(30% 0.04 210);
  --input: oklch(25% 0.04 210);
  --ring: oklch(75% 0.2 290);
}
```

---

### 18. Overcast

**Description:** A very soft, low-contrast theme for users who prefer minimal eye strain. It's inspired by the feeling of an overcast, cloudy day. The background is a gentle, mid-tone gray, not a deep black, which can reduce glare. The text is a darker charcoal, providing sufficient but not jarring contrast. The accent colors are all desaturated and cool, like a muted blue and a soft sea-green. This theme is all about comfort and readability for extended use, prioritizing a calm and unobtrusive user experience over flashy, high-energy visuals.

```css
.dark {
  --background: oklch(30% 0.01 240);
  --foreground: oklch(85% 0.005 240);
  --card: oklch(35% 0.01 240);
  --card-foreground: oklch(85% 0.005 240);
  --popover: oklch(32% 0.01 240);
  --popover-foreground: oklch(85% 0.005 240);
  --primary: oklch(70% 0.08 230);
  --primary-foreground: oklch(20% 0.01 230);
  --secondary: oklch(55% 0.05 220);
  --secondary-foreground: oklch(90% 0.005 220);
  --muted: oklch(70% 0.01 240);
  --muted-foreground: oklch(50% 0.01 240);
  --accent: oklch(75% 0.07 180);
  --accent-foreground: oklch(20% 0.02 180);
  --destructive: oklch(60% 0.18 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(45% 0.01 240);
  --input: oklch(40% 0.01 240);
  --ring: oklch(70% 0.08 230);
}
```

---

### 19. Clay

**Description:** A theme that brings a sense of physical texture and warmth to the digital interface. Inspired by modern pottery and terracotta, it uses a dark, earthy-brown background. The foreground and accents are a mix of warm, muted oranges, beiges, and a deep brick red. This palette feels organic, grounded, and human. It's a strong departure from typical tech palettes and is ideal for brands that want to feel artisanal, trustworthy, and connected to the real world.

```css
.dark {
  --background: oklch(25% 0.04 50);
  --foreground: oklch(85% 0.03 70);
  --card: oklch(30% 0.04 50);
  --card-foreground: oklch(85% 0.03 70);
  --popover: oklch(28% 0.04 50);
  --popover-foreground: oklch(85% 0.03 70);
  --primary: oklch(65% 0.15 40);
  --primary-foreground: oklch(95% 0.03 40);
  --secondary: oklch(50% 0.1 35);
  --secondary-foreground: oklch(90% 0.02 70);
  --muted: oklch(70% 0.05 60);
  --muted-foreground: oklch(50% 0.04 60);
  --accent: oklch(70% 0.2 30);
  --accent-foreground: oklch(15% 0.04 30);
  --destructive: oklch(60% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(40% 0.05 50);
  --input: oklch(35% 0.05 50);
  --ring: oklch(65% 0.15 40);
}
```

---

### 20. Saturn

**Description:** A sophisticated and muted theme inspired by the gas giant. The background is a soft, desaturated yellow-beige, reminiscent of Saturn's clouds. The palette is primarily composed of these warm, gentle neutrals, creating a calm and focused environment. The accent color is a deep, rich blue, like the planet's polar vortex, providing a point of cool contrast. This theme is unique and professional, offering a dark mode that isn't based on black, blue, or grey, making it stand out while remaining understated.

```css
.dark {
  --background: oklch(25% 0.03 90);
  --foreground: oklch(85% 0.01 90);
  --card: oklch(30% 0.03 90);
  --card-foreground: oklch(85% 0.01 90);
  --popover: oklch(28% 0.03 90);
  --popover-foreground: oklch(85% 0.01 90);
  --primary: oklch(60% 0.15 250);
  --primary-foreground: oklch(95% 0.02 250);
  --secondary: oklch(50% 0.05 85);
  --secondary-foreground: oklch(90% 0.01 90);
  --muted: oklch(70% 0.02 90);
  --muted-foreground: oklch(50% 0.02 90);
  --accent: oklch(65% 0.18 240);
  --accent-foreground: oklch(15% 0.04 240);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(40% 0.03 90);
  --input: oklch(35% 0.03 90);
  --ring: oklch(60% 0.15 250);
}
```

---

### 21. Rose Gold

**Description:** An elegant and luxurious theme that uses a dark, warm background paired with soft, metallic pink and rose-gold accents. This palette feels premium, modern, and stylish. It moves away from the typical masculine-coded tech themes to offer something more sophisticated and inviting. It's perfect for lifestyle tech, creator platforms, or any brand that wants to project a sense of quality and refined taste. The warmth of the palette is comforting, while the metallic sheen of the accents keeps it feeling high-tech.

```css
.dark {
  --background: oklch(20% 0.03 20);
  --foreground: oklch(90% 0.02 40);
  --card: oklch(25% 0.03 20);
  --card-foreground: oklch(90% 0.02 40);
  --popover: oklch(22% 0.03 20);
  --popover-foreground: oklch(90% 0.02 40);
  --primary: oklch(75% 0.1 25);
  --primary-foreground: oklch(15% 0.02 25);
  --secondary: oklch(50% 0.08 20);
  --secondary-foreground: oklch(95% 0.02 40);
  --muted: oklch(65% 0.05 30);
  --muted-foreground: oklch(80% 0.03 35);
  --accent: oklch(80% 0.12 15);
  --accent-foreground: oklch(15% 0.02 15);
  --destructive: oklch(60% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(35% 0.04 20);
  --input: oklch(30% 0.04 20);
  --ring: oklch(80% 0.12 15);
}
```

---

### 22. Absinthe

**Description:** A unique and slightly surreal theme inspired by the color of absinthe. The palette is built around a complex, yellow-green, with a dark, muted version for the background. It feels creative, mysterious, and intellectual. This is a highly distinctive theme that immediately sets a project apart from the competition. It's perfect for creative agencies, design tools, or any brand that prides itself on being different and having a unique point of view.

```css
.dark {
  --background: oklch(20% 0.05 130);
  --foreground: oklch(90% 0.08 120);
  --card: oklch(25% 0.05 130);
  --card-foreground: oklch(90% 0.08 120);
  --popover: oklch(22% 0.05 130);
  --popover-foreground: oklch(90% 0.08 120);
  --primary: oklch(85% 0.18 125);
  --primary-foreground: oklch(15% 0.04 125);
  --secondary: oklch(50% 0.12 130);
  --secondary-foreground: oklch(95% 0.08 120);
  --muted: oklch(65% 0.08 125);
  --muted-foreground: oklch(80% 0.06 125);
  --accent: oklch(90% 0.2 115);
  --accent-foreground: oklch(15% 0.05 115);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(35% 0.06 130);
  --input: oklch(30% 0.06 130);
  --ring: oklch(85% 0.18 125);
}
```

---

### 23. Signal

**Description:** A theme built for clarity and immediate understanding, inspired by traffic signals. It uses a neutral, dark gray background, but the primary, secondary, and accent colors are the familiar red, yellow, and green of signals. This creates a powerful and intuitive visual language for status indicators, actions, and notifications. It's an excellent choice for dashboards, status pages, or any application where the state of information needs to be communicated instantly and unambiguously.

```css
.dark {
  --background: oklch(15% 0.01 240);
  --foreground: oklch(95% 0.005 240);
  --card: oklch(20% 0.01 240);
  --card-foreground: oklch(95% 0.005 240);
  --popover: oklch(18% 0.01 240);
  --popover-foreground: oklch(95% 0.005 240);
  --primary: oklch(80% 0.2 150);
  --primary-foreground: oklch(15% 0.04 150);
  --secondary: oklch(90% 0.2 90);
  --secondary-foreground: oklch(15% 0.05 90);
  --muted: oklch(60% 0.01 240);
  --muted-foreground: oklch(75% 0.005 240);
  --accent: oklch(70% 0.25 25);
  --accent-foreground: oklch(98% 0.05 25);
  --destructive: oklch(70% 0.25 25);
  --destructive-foreground: oklch(98% 0.05 25);
  --border: oklch(30% 0.01 240);
  --input: oklch(25% 0.01 240);
  --ring: oklch(80% 0.2 150);
}
```

---

### 24. Haze

**Description:** A soft, atmospheric theme inspired by a misty morning. The background is a dark, foggy purple-gray. The entire palette is desaturated and low-contrast, creating a dreamy and gentle user experience. The accent colors are a muted lavender and a soft pink, like the first light of dawn breaking through the haze. This theme is perfect for wellness apps, journals, or any product that wants to feel calm, introspective, and soothing.

```css
.dark {
  --background: oklch(25% 0.02 280);
  --foreground: oklch(85% 0.01 280);
  --card: oklch(30% 0.02 280);
  --card-foreground: oklch(85% 0.01 280);
  --popover: oklch(28% 0.02 280);
  --popover-foreground: oklch(85% 0.01 280);
  --primary: oklch(70% 0.1 290);
  --primary-foreground: oklch(95% 0.02 290);
  --secondary: oklch(55% 0.08 310);
  --secondary-foreground: oklch(90% 0.01 310);
  --muted: oklch(70% 0.02 280);
  --muted-foreground: oklch(50% 0.01 280);
  --accent: oklch(75% 0.12 340);
  --accent-foreground: oklch(15% 0.03 340);
  --destructive: oklch(60% 0.18 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(40% 0.02 280);
  --input: oklch(35% 0.02 280);
  --ring: oklch(70% 0.1 290);
}
```

---

### 25. Carbon

**Description:** A theme inspired by raw, industrial materials like carbon fiber and brushed steel. The palette is almost entirely monochromatic, but with a subtle cool blue tint to the grays. It feels strong, durable, and engineered. The only accent is a sharp, functional orange, like a warning label on a piece of machinery. This theme is perfect for developer tools, engineering platforms, or any product that wants to project a sense of power, precision, and reliability.

```css
.dark {
  --background: oklch(12% 0.005 240);
  --foreground: oklch(95% 0.005 240);
  --card: oklch(18% 0.005 240);
  --card-foreground: oklch(95% 0.005 240);
  --popover: oklch(15% 0.005 240);
  --popover-foreground: oklch(95% 0.005 240);
  --primary: oklch(70% 0.01 240);
  --primary-foreground: oklch(10% 0.005 240);
  --secondary: oklch(50% 0.005 240);
  --secondary-foreground: oklch(98% 0.005 240);
  --muted: oklch(65% 0.005 240);
  --muted-foreground: oklch(80% 0.005 240);
  --accent: oklch(70% 0.25 50);
  --accent-foreground: oklch(10% 0.05 50);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(30% 0.005 240);
  --input: oklch(25% 0.005 240);
  --ring: oklch(70% 0.25 50);
}
```

---

### 26. Iris

**Description:** A vibrant and creative theme built around a rich, deep purple. The background is a dark aubergine, with various shades of purple and magenta used for primary and secondary elements. The accent is a bright, contrasting lime green, which creates a dynamic and energetic pairing. This theme is bold, artistic, and full of personality, perfect for creative tools, digital agencies, or any brand that wants to be seen as original and imaginative.

```css
.dark {
  --background: oklch(18% 0.05 300);
  --foreground: oklch(90% 0.02 300);
  --card: oklch(23% 0.05 300);
  --card-foreground: oklch(90% 0.02 300);
  --popover: oklch(20% 0.05 300);
  --popover-foreground: oklch(90% 0.02 300);
  --primary: oklch(75% 0.2 310);
  --primary-foreground: oklch(98% 0.04 310);
  --secondary: oklch(55% 0.15 300);
  --secondary-foreground: oklch(95% 0.02 300);
  --muted: oklch(65% 0.08 300);
  --muted-foreground: oklch(80% 0.05 300);
  --accent: oklch(90% 0.25 140);
  --accent-foreground: oklch(15% 0.05 140);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(30% 0.06 300);
  --input: oklch(25% 0.06 300);
  --ring: oklch(90% 0.25 140);
}
```

---

### 27. Moss

**Description:** A calm, natural, and grounding theme. The palette is composed of earthy, desaturated greens and browns, inspired by moss growing on ancient stones. The background is a dark, muted olive, with a soft, warm beige for text. It's a theme that feels quiet, thoughtful, and connected to nature. It's an excellent choice for any application that values mindfulness, sustainability, or a sense of peace and tranquility, providing a digital space that feels like a retreat from the usual high-energy tech world.

```css
.dark {
  --background: oklch(22% 0.03 120);
  --foreground: oklch(85% 0.02 100);
  --card: oklch(26% 0.03 120);
  --card-foreground: oklch(85% 0.02 100);
  --popover: oklch(24% 0.03 120);
  --popover-foreground: oklch(85% 0.02 100);
  --primary: oklch(65% 0.1 110);
  --primary-foreground: oklch(15% 0.02 110);
  --secondary: oklch(45% 0.08 100);
  --secondary-foreground: oklch(90% 0.02 100);
  --muted: oklch(70% 0.05 110);
  --muted-foreground: oklch(50% 0.03 110);
  --accent: oklch(75% 0.12 90);
  --accent-foreground: oklch(15% 0.03 90);
  --destructive: oklch(60% 0.2 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(35% 0.04 120);
  --input: oklch(30% 0.04 120);
  --ring: oklch(65% 0.1 110);
}
```

---

### 28. Cyberspace

**Description:** A classic, high-tech theme that leans into the digital nature of the medium. It uses a deep, pure blue background, with text and accents in various shades of electric blue and cyan. This creates a cohesive, immersive feeling, as if the user is inside a digital world. It's a timeless tech aesthetic that communicates intelligence, data, and connectivity. The monochromatic blue palette is clean and focused, making it a great choice for SaaS platforms, APIs, and developer-focused products.

```css
.dark {
  --background: oklch(15% 0.08 250);
  --foreground: oklch(90% 0.03 240);
  --card: oklch(20% 0.08 250);
  --card-foreground: oklch(90% 0.03 240);
  --popover: oklch(18% 0.08 250);
  --popover-foreground: oklch(90% 0.03 240);
  --primary: oklch(75% 0.18 230);
  --primary-foreground: oklch(98% 0.03 230);
  --secondary: oklch(55% 0.12 240);
  --secondary-foreground: oklch(95% 0.03 240);
  --muted: oklch(65% 0.06 245);
  --muted-foreground: oklch(80% 0.04 245);
  --accent: oklch(85% 0.2 220);
  --accent-foreground: oklch(15% 0.05 220);
  --destructive: oklch(65% 0.22 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(30% 0.09 250);
  --input: oklch(25% 0.09 250);
  --ring: oklch(85% 0.2 220);
}
```

---

### 29. Eclipse

**Description:** A dramatic and high-contrast theme inspired by a solar eclipse. The background is a deep, true black, representing the void. The foreground is a brilliant, crisp white. The only accent color is a vibrant, solar-flare yellow-orange, used for primary actions and focus rings, representing the sun's corona. This theme is minimalist but incredibly striking, creating a powerful visual statement. It's perfect for brands that want to feel bold, elemental, and impactful.

```css
.dark {
  --background: oklch(5% 0 0);
  --foreground: oklch(98% 0 0);
  --card: oklch(12% 0 0);
  --card-foreground: oklch(98% 0 0);
  --popover: oklch(10% 0 0);
  --popover-foreground: oklch(98% 0 0);
  --primary: oklch(85% 0.22 80);
  --primary-foreground: oklch(10% 0.05 80);
  --secondary: oklch(60% 0 0);
  --secondary-foreground: oklch(98% 0 0);
  --muted: oklch(75% 0 0);
  --muted-foreground: oklch(50% 0 0);
  --accent: oklch(90% 0.25 70);
  --accent-foreground: oklch(10% 0.05 70);
  --destructive: oklch(65% 0.25 25);
  --destructive-foreground: oklch(98% 0 0);
  --border: oklch(30% 0 0);
  --input: oklch(18% 0 0);
  --ring: oklch(85% 0.22 80);
}
```

---

### 30. Slate

**Description:** A sophisticated, professional, and neutral theme built on a foundation of cool-toned grays. It avoids pure black in favor of a dark slate background, which is less harsh and can feel more premium. The palette is almost entirely monochromatic, designed for clarity and focus. A single, desaturated blue is used as a primary color for a subtle touch of professionalism without being distracting. This theme is a workhorse, perfect for enterprise SaaS, financial applications, and any tool where function and clarity are the highest priorities.

```css
.dark {
  --background: oklch(20% 0.01 240);
  --foreground: oklch(90% 0.005 240);
  --card: oklch(25% 0.01 240);
  --card-foreground: oklch(90% 0.005 240);
  --popover: oklch(22% 0.01 240);
  --popover-foreground: oklch(90% 0.005 240);
  --primary: oklch(70% 0.1 230);
  --primary-foreground: oklch(15% 0.02 230);
  --secondary: oklch(50% 0.05 240);
  --secondary-foreground: oklch(95% 0.005 240);
  --muted: oklch(65% 0.01 240);
  --muted-foreground: oklch(80% 0.005 240);
  --accent: oklch(75% 0.12 220);
  --accent-foreground: oklch(15% 0.02 220);
  --destructive: oklch(65% 0.2 25);
  --destructive-foreground: oklch(95% 0.05 25);
  --border: oklch(35% 0.01 240);
  --input: oklch(30% 0.01 240);
  --ring: oklch(70% 0.1 230);
}
```
