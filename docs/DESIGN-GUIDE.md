# ITI Portal Design Guide

## Branding Colors

The ITI portal uses a consistent color scheme based on the ITI brand. The primary color is a deep red (`#901b20`).

### CSS Variables

We've defined CSS variables in `src/index.css` to make it easy to use these colors consistently:

```css
:root {
  --iti-primary: #901b20;     /* Main brand color */
  --iti-primary-dark: #7a1619; /* Darker version for hover states */
  --iti-primary-light: #c41c24; /* Lighter version for accents */
}
```

### Using the Colors

#### 1. Utility Classes

Use these utility classes for quick styling:

- `bg-iti-primary`: Sets background color to ITI red
- `text-iti-primary`: Sets text color to ITI red  
- `border-iti-primary`: Sets border color to ITI red
- `hover:bg-iti-primary-dark`: Changes background to darker ITI red on hover
- `focus:ring-iti-primary`: Sets focus ring color to ITI red

#### 2. CSS Variables

For more complex scenarios, use the CSS variables directly:

```css
.my-component {
  background: var(--iti-primary);
  border-color: var(--iti-primary-dark);
}
```

#### 3. Gradients

For gradient effects, use the gradient utility classes:

```jsx
// Standard ITI gradient
className="bg-iti-gradient"

// Text gradient (transparent text with gradient background)
className="bg-iti-gradient-text"

// Light gradient for subtle backgrounds
className="bg-iti-gradient-light"

// Hover gradient effects
className="hover:bg-iti-gradient hover:bg-iti-gradient-dark"
```

## Examples

### Buttons

```jsx
<button className="bg-iti-primary hover:bg-iti-primary-dark text-white font-semibold py-2 px-4 rounded-md">
  Submit
</button>
```

### Text with gradient

```jsx
<h2 className="text-2xl font-bold bg-iti-gradient-text">
  Section Title
</h2>
```

### Focus styles for form inputs

```jsx
<input 
  className="border border-gray-300 focus:ring-iti-primary focus:border-iti-primary rounded-md" 
  type="text"
/>
```

## Benefits

Using these CSS variables and utility classes ensures:

1. **Consistency** across the application
2. **Easier updates** - change the color in one place
3. **Better collaboration** - team members can easily reference the same colors
