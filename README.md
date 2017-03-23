# Rocket.Chat.Dark
A dark Discord-inspired theme for Rocket.Chat

## Install

### Manual install
1. Copy the contents of `dist/dark.css` or `dist/dark.min.css`
2. Go to Administration > Layout in Rocket.Chat
3. Paste the copied contents into "Custom CSS"

### Automatic install
1. `npm install`
2. `npm run deploy`

### Custom additions
Custom styling that can't or shouldn't be in source control goes in `src/custom.styl`.
**`src/custom.styl` should have `@import "dark"` as the first line.**

If you use this, you'll need to run the build or development steps below and copy
`dist/custom.css` to Rocket.Chat instead of `dist/dark.css`. If you use deploy instead,
it will automatically choose the custom file if it exists.

For example, I use this to color the names of specific users. My
`src/custom.styl` looks something like this:

```css
@import "dark"

[data-username="user1"] .user
	color some-color

[data-username="user2"] .user
	color some-other-color
```

### App color settings
All colors should be set to the defaults. I haven't tested with anything but
the defaults (except for the background color; see the next heading).

### Background color of the mobile bar
To color the background of the top bar in mobile, you should set the "Primary
Background Color" under Administration > Layout > Colors. To set it as the primary
background color this theme uses (recommended), set it to `#36393e`.

## Building
1. `npm install`
2. `npm run build`

## Development
1. `npm install`
2. `npm run watch`
3. Edit source in `src`
