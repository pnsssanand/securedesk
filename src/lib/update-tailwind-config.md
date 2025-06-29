// In your tailwind.config.js, add these color variables to your theme:

colors: {
  // ...other colors
  success: {
    DEFAULT: "hsl(var(--success))",
    foreground: "hsl(var(--success-foreground))",
  },
  warning: {
    DEFAULT: "hsl(var(--warning))",
    foreground: "hsl(var(--warning-foreground))",
  },
  info: {
    DEFAULT: "hsl(var(--info))",
    foreground: "hsl(var(--info-foreground))",
  },
}

// And in your globals.css, add these CSS variables:
:root {
  // ...other variables
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  
  --warning: 38 92% 50%;
  --warning-foreground: 355.7 100% 97.3%;
  
  --info: 221.2 83.2% 53.3%;
  --info-foreground: 210 40% 98%;
}

.dark {
  // ...other dark mode variables
  --success: 142.1 70.6% 45.3%;
  --success-foreground: 144.9 80.4% 10%;
  
  --warning: 48 96% 53%;
  --warning-foreground: 38 92% 20%;
  
  --info: 217.2 91.2% 59.8%;
  --info-foreground: 222.2 47.4% 11.2%;
}
