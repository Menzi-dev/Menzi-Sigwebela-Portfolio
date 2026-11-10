# Updating project slides

The previews advance automatically about every 4.5 seconds while visible. Hover does not stop them. Visitors can pause or move to the previous/next screen. Reduced-motion preferences disable automatic movement; manual controls remain available.

Both preview slideshows and full-size galleries use `project-slides.js`.

## CampusConnect pictures

The current selection contains four original screenshots from the repository?s `docs/images/`: rider booking, scheduled rides, driver earnings, and the admin dashboard. Sign-in and university settings are omitted to keep the gallery focused on core workflows.

1. Save the new pictures in `assets/campus/` (create that folder when needed).
2. Replace the `campus.images` entries in `project-slides.js`, keeping the same format:

```js
images: [
  ['assets/campus/home.png', 'Home screen'],
  ['assets/campus/rides.png', 'Available rides'],
  ['assets/campus/profile.png', 'Student profile']
]
```

3. Update `campus.note` to describe the new pictures accurately. The current images are selected repository app screenshots.
4. Refresh the page. The slideshow count, navigation, and gallery update automatically. Supply at least two image entries for autoplay.

The project ordering is set in index.html: CampusConnect, Safari Wheels, Urban Style Restaurant, Client Portfolio. Deploy project-slides.js alongside script.js and the assets folder.
