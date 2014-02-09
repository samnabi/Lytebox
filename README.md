# Lyterbox

Lyterbox is a tiny lightbox script that handles images and iframes. It removes some features from the original Lytebox, like themeing and slideshows, in order to reduce file size.

Lyterbox was forked from [Terrill Nederveld's Lytebox (v4.0a)](https://github.com/tnederveld/Lytebox), which was forked from [Markus Hay's original Lytebox (v3.22)](http://lytebox.com/), which was based on [Lokesh Dhakar's Lightbox (v2.02)](http://huddletogether.com/projects/lightbox2).

## Features

- Images (single or gallery)
- HTML content (single or gallery)
- Arrow key navigation
- Click background to close

## How to use

	<script src="lyterbox.js" type="text/javascript"></script>
	<link href="lyterbox.css" media="screen" rel="stylesheet" type="text/css" />

	<!-- Single image -->
	<a href="full-image.jpg" rel="lytebox"><img src="thumbnail.jpg" /></a>

	<!-- Grouped images -->
	<a href="full-image.jpg" rel="lytebox[groupname]"><img src="thumbnail.jpg" /></a>
	<a href="full-image.jpg" rel="lytebox[groupname]"><img src="thumbnail.jpg" /></a>

## To do

- Fix arrow display (remove prev on first, next on last; remove both on single img)

## License

Lyterbox is released under the [Creative Commons Attribution 3.0 Unported](http://creativecommons.org/licenses/by/3.0/) License. Have fun, kids.