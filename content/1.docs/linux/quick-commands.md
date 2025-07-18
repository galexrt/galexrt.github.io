---
title: "Quick Commands"
icon: 'i-ph-fast-forward'
---

## Archives

### Extract all '*.zip' files into a directory named after the zip's filename

```bash
find -name '*.zip' -exec sh -c 'unzip -d "${1%.*}" "$1"' _ {} \;
```

### Extract all '*.rar' files into a directry named after the rar's filename

```bash
find -name '*.rar' -exec sh -c 'mkdir "${1%.*}"; unrar e "$1" "${1%.*}"' _ {} \;
```

### Extract all '*.7z' files into a directry named after the rar's filename

```bash
find -name '*.7z' -exec sh -c 'mkdir "${1%.*}"; 7z x "$1" -o"${1%.*}"' _ {} \;
```

### Extrat all '*.tar' files into a directory named after the tar's filename

```bash
find -name '*.tar' -exec sh -c 'mkdir -p "${1%.*}"; tar -C "${1%.*}" -xvf "$1"' _ {} \;
```

### Extrat all '*.tar.gz' files into a directory named after the tar's filename

```bash
find -name '*.tar.gz' -or -name '*.tgz' -exec sh -c 'mkdir -p "${1%.*}"; tar -C "${1%.*}" -xvzf "$1"' _ {} \;
```

## Music

### Convert all FLAC to MP3 (same directory)

```bash
find -name "*.flac" -print | parallel -j 14 ffmpeg -i {} -acodec libmp3lame -ab 192k {.}.mp3 \;
```

### Convert all OGG to FLAC (same directory)

```bash
find -name "*.ogg" -print | parallel -j 14 ffmpeg -i {} -c:a flac {.}.flac \;
```

## Documents

### Convert PDFs to PNGs (each page is its own image)

```bash
for file in *.pdf; do
    echo "Processing file: $file ..."
    mkdir -p "$(basename "$file" .pdf)"
    pdftoppm -png "$file" "$(basename "$file" .pdf)/page"
done
```

#### Run `tesseract` OCR on all converted Pages

```bash
for file in */*.png; do
    echo "Processing file: $file ..."
    tesseract -l deu+eng "$file" "$(echo "$file" | sed 's/\.png$//g')"
done
```

::callout{icon="i-ph-lightbulb-filament"}
**Hint**:
The `-l deu+eng` are the languages to use.  In this case `deu+eng` means `deu` "Deutsch" (German) and `eng` "English".
::

### Convert all '*.docx' files into PDFs (using LibreOffice's `lowriter`)

```bash
find . -name '*.docx' -print0 |
    while IFS= read -r -d $'\0' line; do
        echo "Processing file: $line ..."
        lowriter --convert-to pdf "$line" --outdir "$(dirname "$line")"
    done
```

## Disks

### Get UUID for partition

```bash
blkid /dev/sdXY -s UUID -o value
```

Where `/dev/sdXY` could be, `/dev/sda2`, `/dev/nvme0n1p1`, and so on.

## Images

### Optimize JPEG Images

::callout{icon="i-ph-lightbulb-filament"}
**Warning**:
The `-m LEVEL` flag reduces the JPEG image quality to that level, in the example below to `95`.
::

```bash
$ jpegoptim -p --strip-com --strip-iptc -m 95 IMAGE.jpeg
# Find and optimize PNGs in parallel
$ find \( -iname '*.jpg' -or -iname '*.jpeg' \) -print0 | xargs -n1 -P6 -0 jpegoptim -p --strip-com --strip-iptc -m 95
```

### Optimize PNG Images

```bash
$ jpegoptim
# Find and optimize PNGs in parallel
$ find -iname '*.png' -print0 | xargs -n1 -P6 -0 optipng -strip all -clobber -fix -o9
```

### Remove EXIF data from Image(s)

```bash
$ exiftool -overwrite_original -all= IMAGE1.jpeg IMAGE2.png ...
# Remove EXIF data from all `*.jpeg` files
$ find \( -iname '*.jpg' -or -iname '*.jpeg' -or -iname '*.png' \) -exec exiftool -overwrite_original -all= {} \;
```
