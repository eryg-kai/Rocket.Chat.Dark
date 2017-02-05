# Rocket.Chat.Dark
A dark Discord-inspired theme for Rocket.Chat

## Install
1. Copy the contents of `dist/dark.css` or `dist/dark.min.css`
2. Go to Administration > Layout in Rocket.Chat
3. Paste the copied contents into "Custom CSS"

### Custom additions
Custom styling that can't or shouldn't be in source control goes in
`src/custom.styl`. If you use this, you'll need to run the build or development
steps below and copy `dist/custom.css` to Rocket.Chat instead of
`dist/dark.css`. `src/custom.styl` should have `@import "dark"` as the first
line.

## Building
1. `npm install`
2. `npm run build`

## Development
1. `npm install`
2. `npm run gulp watch`
3. Edit source in `src`
