---
title: Transform and adapt media assets
description: Learn how URL-based transformations work in ImageKit and how to adapt media assets to your requirements.
---

ImageKit offers 50+ real-time URL-based transformations, empowering you to adapt your media assets to your needs. These transformations enable you to resize, crop, rotate, and optimize images and videos on the fly. You can even add text and image overlays to create personalized and captivating media experiences.

With ImageKit, engineering teams can modify assets on the fly without generating and storing multiple versions of the same asset. This allows you to avoid the complexity of multiple asynchronous tools and provider-specific processing implementations. ImageKit's developer-friendly, real-time media processing API simplifies your workflow, allowing you to quickly create high-quality, media-rich experiences.

## Basic example and URL structure

You can apply transformations by adding specific parameters to the asset's URL. When a request is made to the transformed URL, ImageKit processes the request and returns the transformed asset.

Here's the basic structure of a URL-based transformation:

```
        URL endpoint        transformation    asset path 
┌──────────────────────────┐┌────────────┐┌────────────────┐
https://ik.imagekit.io/demo/tr:w-300,h-300/example-asset.jpg
```

For example, let's say you have an image asset at the following URL:

```
https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_3.jpg
```

To resize this image to 300x300 pixels, you can append the `tr:w-300,h-300` transformation parameter to the asset URL:

```
                               transformation
                               ┌────────────┐
https://ik.imagekit.io/ikmedia/tr:w-300,h-300/docs_images/examples/example_food_3.jpg
```

The same transformation can be passed as query parameters as well:

```
                                                                       transformation
                                                                       ┌────────────┐
https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_3.jpg?tr=w-300,h-300
```

Here's how the original and resized images look side by side:

{% linetabs %}
{% linetab title="Original 600x600 image" %}

[https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_3.jpg](https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_3.jpg)

![](https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_3.jpg)

{% /linetab %}
{% linetab title="Resized 300x300 image" %}

[https://ik.imagekit.io/ikmedia/tr:w-300,h-300/docs_images/examples/example_food_3.jpg](https://ik.imagekit.io/ikmedia/tr:w-300,h-300/docs_images/examples/example_food_3.jpg)

![](https://ik.imagekit.io/ikmedia/tr:w-300,h-300/docs_images/examples/example_food_3.jpg)

{% /linetab %}

{% /linetabs %}

## Transformations overview

Here is a table of transformations that you can apply to your media assets:

{% table %}

- Transformation {% width="40%" %}
- Images
- Videos

---

- Basic
- Resize, crop, smart crop images. [Learn more](/image-resize-and-crop).
- Resize and crop videos. [Learn more](/video-resize-and-crop).

---

- Common transformations
- All common image transformations like quality, format, rotation, border, etc. \
 [Learn more](/effects-and-enhancements).
- - All common video transformations like background color, border, radius, rotation, etc. [Learn more](/common-video-transformations).
  - [Trim videos](/trim-videos) - control start and end time.
  - [Audio related transformations](/audio-transformations) - mute vidoe, extract audio, etc.

---

- Generate thumbnails
- Generate thumbnails from vector and animated images. \
 [Learn more](/vector-and-animated-images).
- Create video thumbnails. \
 [Learn more](/create-video-thumbnails).

---

- Overlays
- Add image and text overlays on images. \
 [Learn more](/add-overlays-on-images).
- Add image, video, text, and subtitle overlays to videos. \
 [Learn more](/add-overlays-on-videos).

---
- Arithmetic expressions
- Supported in images. \
 [Learn more](/arithmetic-expressions-in-transformations).
- Supported in videos. \
 [Learn more](/arithmetic-expressions-in-transformations).

---

- Conditional transformations
- You can apply transformations conditionally based on certain properties of the input asset. [Learn more](/conditional-transformations).
- Not supported in video.

---

- AI transformations
- Generate images via a text prompt, remove background, change background, crop objects, improve image quality, and more. [Learn more](/ai-transformations).
- Not supported in video.

---

- Adaptive bitrate streaming
- Not applicable.
- Use Adaptive Bitrate Streaming for long videos with ImageKit. \
 [Learn more](/adaptive-bitrate-streaming).
  
{% /table %}

## Troubleshooting invalid transformation

When you apply transformations to your media assets, ImageKit returns `400 Bad Request`. This error occurs when the transformation parameters are incorrect, or the transformation is not supported.

To help you troubleshoot and debug transformation errors, ImageKit returns an `ik-error` header in the response. The `ik-error` header provides detailed information about the error, including the error code and a description.

The error can be very specific or generic, depending on the issue. Here's an example of an `ik-error` header with a generic error message:

![Invalid transformation](https://ik.imagekit.io/ikmedia/docs_images/features/transformation/invalid-transformation.png?tr=w-1200)

{% callout style="info" %}
For not found error, you can consider using [default image](/image-transformation#default-image---di) transformation for better user experience.
{% /callout %}

## Limits

Here are some limits to keep in mind when using transformations. Most of the limits are adjustable based on your pricing plan. Please contact [support](mailto:support@imagekit.io) if you need to adjust these limits.

{% table %}

- Limits {% width="70%" %}
- Free plan {% width="10%" %}
- Paid plan {% width="10%" %}
- Adjustable {% width="10%" %}

---

- Max image file size for processing.
- 20MB
- 40MB
- Yes

---

- Max video file size for processing.
- 100MB
- 2GB
- Yes

---

- Max raw file size for delivery (includes everything that ImageKit can't process).
- 20MB
- 40MB
- Yes
- 
---

- Max image megapixels for processing.
- 25MP
- 100MP
- Yes

---

- Max multi-frame image megapixels for processing.
- 50MP
- 100MP
- Yes

---

- Max image transformation dimensions (dimensions greater than this in the transformation string will get ignored).
- 65535 px
- 65535 px
- No

---

- Max WebP image transformation dimensions (dimensions greater than this will not work for transformation).
- 16383 px
- 16383 px
- No

---

- Input file size for SVG images when not converting to a raster format
- 1MB
- 1MB
- No

---

- Input file size for vector formats such as PDF, EPS etc.
- 5MB
- 5MB
- No
  
{% /table %}

## Supported formats

ImageKit supports a wide range of image, video, and audio formats in input for transformation and optimization. By default, ImageKit chooses an optimal output format based on input and browser compatibility. However, you can always specify the output format based on your requirements. Here are some of the most common formats:

- **Image formats**: JPEG, PNG, WebP, AVIF, GIF, animated WebP, and animated PNG are the image formats that ImageKit can accept in the input, transform, optimize, and deliver in the output. SVG input can be rasterized by specifying dimensions or a raster format in the output. HEIC input will always be converted to JPEG, PNG, and WebP output formats.
- **Video and audio formats**: For input, ImageKit supports MP4, MOV, WebM, MPEG, 3GP, OGG, OGV, and HEVC video formats. The video codec can be H.264, MPEG4, HEVC, AV1, VP8, VP9, and H.263. The audio codec can be AAC, Opus, MP2, and Vorbis. ImageKit will always convert to an MP4 or WebM container with H.264, VP9, or AV1 video codec for output. The audio codec will be AAC or Opus based on compatibility.
- **Other file formats**: If a format is not supported for transformation and optimization, you can still use ImageKit to deliver the file as it is. This allows you to serve PDF, DOC, JS, JSON, CSS, and even HTML files through ImageKit. By default, all text-based files are compressed and served with GZIP or Brotli compression based on the browser support.

{% callout style="info" %}
For video transformation and optimization, ImageKit relies on the presence of a `.mp4` or `.mov` extension in the URL. If your resource doesn't have that extension, you can add `/ik-video.mp4` at the end. ImageKit uses it as a hint to fetch the original asset from your media library or origin and perform video transformation/optimization.

For example, if your original asset URL is \
`https://ik.imagekit.io/demo/img/video-no-extension_X9my06BI-`

You can add `/ik-video.mp4` at the end to perform video transformation and optimization i.e. \
`https://ik.imagekit.io/demo/img/video-no-extension_X9my06BI-/ik-video.mp4`
{% /callout %}

## Chained transformations

Using chained transformations, you can chain the output of one transformation as the input for the next to create the desired output. 

A colon separates each step in the chained transform`:`, and they are applied in the sequence in which they appear. For example, `w-400,h-300:rt-90` first resizes the image to 400x300 pixels and then rotates the image by 90 degrees.

```markup
                                  1st → Resize to 400x300                               
                                  ┌─────────┐
https://ik.imagekit.io/ikmedia/tr:w-400,h-300:rt-90/default-image.jpg
                                              └───┘
                                              2nd → Rotate by 90°
```

Chained transformation is especially useful when creating personalized media experiences using multiple text and image overlays.

For example, an image like this:

![](<https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_1.jpg?tr=w-400,h-400:w-500,h-400,cm-pad_resize,fo-right,bg-000000:l-image,i-docs_images@@examples@@logo-white_SJwqB4Nfe_zsEuI_3S4.png,lx-10,ly-40,h-20,l-end>)

Let's understand the chained transformation applied to this image:

1. **Resize to 400x400**

 This is fairly straightforward `w-400,h-400`

2. **Add a 100px padding to the left**

 100px padding on the left means the resulting image will have a width of 400+100px = 500px. The image should be completely on the right in this image. This is achieved using the pad_resize crop mode (to pad the image in case resize doesn't match the aspect ratio) along with the focus parameter set to the right (to focus the image to the right). We also need to set the background to black (#000000). The transformation thus becomes -

   `w-500,h-400,cm-pad_resize,fo-right,bg-000000`

3. **Overlay ImageKit.io's logo**
  
 ImageKit's logo is accessible at path `logo-white_SJwqB4Nfe.png`, and then we can position and resize the overlay using overlay lx, ly, and overlay height transforms, respectively. The transformation thus becomes

 `l-image,i-docs_images@@examples@@logo-white_SJwqB4Nfe_zsEuI_3S4.png,lx-10,ly-40,h-20,l-end`

We combine these three steps into a chain, separating each step by a colon `:`. The final chained transformation is:

```
w-400,h-400:w-500,h-400,cm-pad_resize,fo-right,bg-000000:l-image,i-docs_images@@examples@@logo-white_SJwqB4Nfe_zsEuI_3S4.png,lx-10,ly-40,h-20,l-end
```

[Open the final URL](https://ik.imagekit.io/ikmedia/docs_images/examples/example_food_1.jpg?tr=w-400,h-400:w-500,h-400,cm-pad_resize,fo-right,bg-000000:l-image,i-docs_images@@examples@@logo-white_SJwqB4Nfe_zsEuI_3S4.png,lx-10,ly-40,h-20,l-end)

## Named transformations

Named transformations within ImageKit.io are aliases or names you can give for a complex URL transformation string.  Named transformations make it easy to remember and use complex transformation strings in your code. Overall, it makes your code more readable and clean. Named transformation works across images and videos.

For example, let's say our original URL is \
[https://ik.imagekit.io/ikmedia/tr:`w-300,h-200,bl-10`/default-image.jpg](https://ik.imagekit.io/ikmedia/tr:w-300,h-200,bl-10/default-image.jpg)

We can replace the transformation string `tr:w-300,h-200,bl-10` with an easy-to-remember named transformation `blur_thumbnail`.

URL with Named Transformation becomes \
[https://ik.imagekit.io/ikmedia/tr:`n-blur_thumbnail`/default-image.jpg](https://ik.imagekit.io/ikmedia/tr:n-blur_thumbnail/default-image.jpg)

{% callout style="info" %}
You can restrict the use of unnamed transformations and only allow named transformations. This way, you can control the transformations applied to your assets. [Learn more](media-delivery-basic-security) about basic security features in ImageKit.io.
{% /callout %}

You can [create and manage named transformations](https://imagekit.io/dashboard/settings/named-transforms) within the ImageKit.io dashboard.

![Create new named transformation](https://ik.imagekit.io/ikmedia/docs_images/old-docs-images/create-named-transformation.png)

## Overlay using Layers
A layer is a special transformation in which you can specify an asset to be used as an overlay, along with its positioning and transformations. It supports nesting, allows you to modify the overlay itself, and expresses its position relative to the parent.

### Syntax of layers

A layer starts with `l-<type>` and ends with `l-end`. All the positional and transformation parameters of that layer are between `l-<type>` and `l-end` and only apply to that layer and not the parent base asset.

`type` can be `image`, `video`, or `text`.

For example, in the following URL, we are adding a logo image `logo.png` on top of a base image, i.e. `sample-image.jpg`. However, we applied width (`w-10`) and rotation (`rt-90`) transformations on this overlay logo image before placing it on the base image. Transformations `w-300,h-300` are applied to `sample-image.jpg`.

Here, the parent base image has one layer inside it. A layer can also nest another layer.

```markup
         URL endpoint           Base image                                Layer
┌──────────────────────────┐┌──────────────┐                ┌─────────────────────────────────┐
https://ik.imagekit.io/demo/sample-image.jpg?tr=w-300,h-300,l-image,i-logo.png,w-10,rt-90,l-end
                                                └────┬────┘                    └────┬────┘
                                                     │                              │
                                                     │             These transformations are applied to logo.png
                                                     │
                              These transformations are applied to sample-image.jpg
```

### Input of layer
The input of the layer can be specified using `i` or `ie` (base64 encoded) parameter. In case both `i` and `ie` are present, `i` is ignored. The base64 string should be made URL-safe to ensure that all padding characters (=) are included correctly. In Javascript, a function like `encodeURIComponent()` can be used for this.

### Position of layer

The position of the layer can be controlled using the following parameters. The position of the layer is always relative to the immediate parent. For instance, the parent is the base image in the above example, and the logo image is the nested layer. 

| Parameter | Description                                                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lx        | `x` of the top-left corner in the base asset where the layer's top-left corner would be placed. It can also accept arithmetic expressions such as `bw_mul_0.4`, or `bw_sub_cw`. Learn more about arithmetic expressions [here](/arithmetic-expressions-in-transformations). |
| ly        | `y` of the top-left corner in the base asset where the layer's top-left corner would be placed. It can also accept arithmetic expressions such as `bh_mul_0.4`, or `bh_sub_ch`. Learn more about arithmetic expressions [here](/arithmetic-expressions-in-transformations). |
| lfo       | Position of the layer in relative terms e.g., `center`, `top`, `left`, `bottom`, `right`, `top_left`, `top_right`, `bottom_left`, and `bottom_right`. The default value is `center`.                                                                                        |
| lso       | Start time of the base video in seconds when the layer should appear. It accepts a positive number upto two decimal e.g. 20 or 20.50. Only applicable if parent layer or base is video. It can also accept arithmetic expressions such as `bdu_mul_0.4`, or `bdu_sub_idu`. Learn more about arithmetic expressions [here](/arithmetic-expressions-in-transformations).                                                                                     |
| ldu       | Duration in seconds during which layer should appear on the base video. It accepts a positive number upto two decimal e.g. 20 or 20.50. Only applicable if parent layer or base is video. It can also accept arithmetic expressions such as `bdu_mul_0.4`, or `bdu_sub_idu`. Learn more about arithmetic expressions [here](/arithmetic-expressions-in-transformations).                                                                                   |
| leo       | End time of the base video when this layer should disappear. In case both `leo` and `ldu` are present, `ldu` is ignored. It accepts a positive number upto two decimal e.g. 20 or 20.50. Only applicable if parent layer or base is video. It can also accept arithmetic expressions such as `bdu_mul_0.4`, or `bdu_sub_idu`. Learn more about arithmetic expressions [here](/arithmetic-expressions-in-transformations).                                 |

**Note:** If one or both of `lx` and `ly` parameters are specified along with `lfo`, then `lfo` parameter is ignored.

### Nesting of layers

A layer can have nested layers up to 3 levels. 

For example, in the below URL, `i-inner.png` is rendered on the top-left corner of `i-outer.png` using the `lfo-top_left` parameter.

```markup
                         Parent layer
┌──────────────────────────────────────────────────────────────┐
l-image,i-outer.png,l-image,i-inner.png,lfo-top_left,l-end,l-end
                    └──────────────────┬──────────────────┘
                                       │
                                  Nested layer
```

Learn more with examples.

* Add image overlay on [images](/add-overlays-on-images#add-images-over-image) and [videos](/add-overlays-on-videos#add-images-over-video).
* Add text overlay on [images](/add-overlays-on-images#add-text-over-image) and [videos](/add-overlays-on-videos#add-text-over-video).
* Add [video overlay](/add-overlays-on-videos#add-video-over-video) on videos.
* Add solid color blocks over [images](/add-overlays-on-images#add-solid-color-blocks-over-image) and [videos](/add-overlays-on-videos#add-solid-color-blocks-over-video).
* [Add subtitles](/add-overlays-on-videos#add-subtitles-over-a-video) on videos.