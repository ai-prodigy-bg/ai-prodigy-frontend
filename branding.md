# Prodigy Labs Branding Guide

## Colors

### Primary Colors
| Color | Hex Code | OKLCH Value | Usage Context |
|-------|----------|-------------|---------------|
| Primary Purple | #8B5CF6 (approx.) | `oklch(0.65 0.25 285)` | Primary buttons, accent elements, focus rings, sidebar highlights |
| Background Dark | #1A1A1A (approx.) | `oklch(0.11 0.02 264)` | Main background, sidebar background |
| Foreground Light | #FAFAFA | `oklch(0.98 0 0)` | Primary text, button text on dark backgrounds |

### Secondary Colors
| Color | Hex Code | OKLCH Value | Usage Context |
|-------|----------|-------------|---------------|
| Card Background | #262626 (approx.) | `oklch(0.15 0.02 264)` | Card backgrounds, popover backgrounds |
| Secondary Dark | #404040 (approx.) | `oklch(0.25 0.02 264)` | Secondary elements, muted sections |
| Muted Foreground | #B3B3B3 (approx.) | `oklch(0.7 0 0)` | Muted text, form descriptions |

### Accent Colors
| Color | Hex Code | OKLCH Value | Usage Context |
|-------|----------|-------------|---------------|
| Border | #4D4D4D (approx.) | `oklch(0.3 0.02 264)` | Element borders, input borders |
| Input Background | #333333 (approx.) | `oklch(0.2 0.02 264)` | Form input backgrounds |
| Destructive Red | #E11D48 (approx.) | `oklch(0.55 0.25 25)` | Error states, destructive actions |

### Chart Colors
| Color | Hex Code | OKLCH Value | Usage Context |
|-------|----------|-------------|---------------|
| Chart Purple | #8B5CF6 (approx.) | `oklch(0.65 0.25 285)` | Primary chart elements |
| Chart Teal | #14B8A6 (approx.) | `oklch(0.6 0.2 160)` | Secondary chart elements |
| Chart Pink | #EC4899 (approx.) | `oklch(0.7 0.25 340)` | Tertiary chart elements |
| Chart Yellow | #F59E0B (approx.) | `oklch(0.75 0.2 80)` | Quaternary chart elements |
| Chart Blue | #3B82F6 (approx.) | `oklch(0.6 0.25 240)` | Quinary chart elements |

## Typography

### Font Families
| Font | Variable Name | Usage Context | Weights Available |
|------|--------------|---------------|-------------------|
| **Space Grotesk** | `--font-space-grotesk` | Headings, display text | 400, 500, 600, 700 |
| **DM Sans** | `--font-dm-sans` | Body text, forms, UI elements | 400, 500, 600 |
| **Geist Mono** | `--font-geist-mono` | Code, monospace text | Default |

### Font Usage
- **Primary Font (Body)**: DM Sans - Used for all body text, form labels, buttons, and general UI elements
- **Heading Font**: Space Grotesk - Used for headings, hero text, and display typography
- **Monospace Font**: Geist Mono - Used for code blocks and technical content

## Design System Notes

### Border Radius
- **Standard Radius**: `0.75rem` (12px) - Used throughout the interface for a modern, rounded look
- **Variations**: 
  - Small: `calc(var(--radius) - 4px)` (8px)
  - Medium: `calc(var(--radius) - 2px)` (10px)
  - Large: `var(--radius)` (12px)
  - Extra Large: `calc(var(--radius) + 4px)` (16px)

### Special Effects
- **Glow Animation**: Purple glow effect using the primary purple color for interactive elements
- **Magnetic Cursor**: Custom cursor with purple gradient and magnetic attraction to interactive elements
- **Smooth Animations**: Spring-based animations for enhanced user experience

### Theme
- **Default Theme**: Dark theme with purple accents
- **Color System**: OKLCH color space for better color consistency and accessibility
- **Design Philosophy**: Modern, bold, tech-forward aesthetic with premium feel