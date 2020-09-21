# galexrt.github.io

My personal page.

## Development

### Convert mp4 to webm files

```console
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus output.webm
```
(Taken from https://stackoverflow.com/a/47512301)
