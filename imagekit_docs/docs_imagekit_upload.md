Upload file V1
post
https://upload.imagekit.io
/api/v1/files/upload
ImageKit.io allows you to upload files directly from both the server and client sides. For server-side uploads, private API key authentication is used. For client-side uploads, generate a one-time token, signature, and expiration from your secure backend using private API. Learn more about how to implement client-side file upload.

The V2 API enhances security by verifying the entire payload using JWT.

File size limit
On the free plan, the maximum upload file sizes are 20MB for images, audio, and raw files and 100MB for videos. On the paid plan, these limits increase to 40MB for images, audio, and raw files and 2GB for videos. These limits can be further increased with higher-tier plans.

Version limit
A file can have a maximum of 100 versions.

Demo applications

A full-fledged upload widget using Uppy, supporting file selections from local storage, URL, Dropbox, Google Drive, Instagram, and more.
Quick start guides for various frameworks and technologies.
Request
ImageKit API uses API keys to authenticate requests. You can view and manage your API keys in the dashboard.

Private keys have the prefix private_ and the public keys have the prefix public_. Alternatively, you can use restricted API keys for granular permissions.

Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password.

Send your HTTP requests with the Authorization header that contains the word Basic word followed by a space and a base64-encoded string username:password.

For example, if your private key is private_rGAPQJbhBx, encode private_rGAPQJbhBx: using base64. The encoded value will be cHJpdmF0ZV9yR0FQUUpiaEJ4Og==. Then send Authorization: Basic cHJpdmF0ZV9yR0FQUUpiaEJ4Og==.

All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

Body

multipart/form-data

multipart/form-data
file
string
required
This field accepts three kinds of values:

binary - You can send the content of the file as binary. This is used when a file is being uploaded from the browser.
base64 - Base64 encoded string of file content.
url - URL of the file from where to download the content before uploading.
Note: When passing a URL in the file parameter, please ensure that our servers can access the URL. In case ImageKit is unable to download the file from the specified URL, a 400 error response is returned. This will also result in a 400 error if the file download request is aborted if response headers are not received in 8 seconds.

Example:
https://www.example.com/rest-of-the-image-path.jpg
fileName
string
required
The name with which the file has to be uploaded. The file name can contain:

Alphanumeric Characters: a-z, A-Z, 0-9.
Special Characters: ., -
Any other character including space will be replaced by _

publicKey
string
Your ImageKit.io public key. This field is only required for authentication when uploading a file from the client side.

signature
string
HMAC-SHA1 digest of the token+expire using your ImageKit.io private API key as a key. Learn how to create a signature on the page below. This should be in lowercase.

Signature must be calculated on the server-side. This field is only required for authentication when uploading a file from the client side.

expire
string
The time until your signature is valid. It must be a Unix time in less than 1 hour into the future. It should be in seconds. This field is only required for authentication when uploading a file from the client side.

token
string
A unique value that the ImageKit.io server will use to recognize and prevent subsequent retries for the same request. We suggest using V4 UUIDs, or another random string with enough entropy to avoid collisions. This field is only required for authentication when uploading a file from the client side.

Note: Sending a value that has been used in the past will result in a validation error. Even if your previous request resulted in an error, you should always send a new value for this field.

useUniqueFileName
string
Whether to use a unique filename for this file or not.

If true, ImageKit.io will add a unique suffix to the filename parameter to get a unique filename.

If false, then the image is uploaded with the provided filename parameter, and any existing file with the same name is replaced.

Allowed values:
true
false
Default:
true
tags
string
Set the tags while uploading the file.

Comma-separated value of tags in the format tag1,tag2,tag3. The maximum length of all characters should not exceed 500. % is not allowed.

If this field is not specified and the file is overwritten then the tags will be removed.

Example:
t-shirt,round-neck,men
folder
string
The folder path in which the image has to be uploaded. If the folder(s) didn't exist before, a new folder(s) is created.

The folder name can contain:

Alphanumeric Characters: a-z , A-Z , 0-9
Special Characters: / , _ , -
Using multiple / creates a nested folder.

Default:
/
isPrivateFile
string
Whether to mark the file as private or not.

If true, the file is marked as private and is accessible only using named transformation or signed URL.

Allowed values:
true
false
Default:
false
isPublished
string
Whether to upload file as published or not.

If false, the file is marked as unpublished, which restricts access to the file only via the media library. Files in draft or unpublished state can only be publicly accessed after being published.

The option to upload in draft state is only available in custom enterprise pricing plans.

Allowed values:
true
false
Default:
true
customCoordinates
string
Define an important area in the image. This is only relevant for image type files.

To be passed as a string with the x and y coordinates of the top-left corner, and width and height of the area of interest in the format x,y,width,height. For example - 10,10,100,100
Can be used with fo-customtransformation.
If this field is not specified and the file is overwritten, then customCoordinates will be removed.
responseFields
string
Comma-separated values of the fields that you want the API to return in the response.

For example, set the value of this field to tags,customCoordinates,isPrivateFile to get the value of tags, customCoordinates, and isPrivateFile in the response.

Accepts combination of tags, customCoordinates, isPrivateFile, embeddedMetadata, isPublished, customMetadata, and metadata.

extensions
string
Stringified JSON object with an array of extensions to be applied to the image. Refer to extensions schema in update file API request body.

Example:
[{"name":"remove-bg","options":{"add_shadow":true,"bg_colour":"green"}},{"name":"google-auto-tagging","maxTags":5,"minConfidence":95}]
webhookUrl
string
The final status of extensions after they have completed execution will be delivered to this endpoint as a POST request. Learn more about the webhook payload structure.

overwriteFile
string
If false and useUniqueFileName is also false, and a file already exists at the exact location, upload API will return an error immediately.

Default:
true
overwriteAITags
string
If set to true and a file already exists at the exact location, its AITags will be removed. Set overwriteAITags to false to preserve AITags.

Allowed values:
true
false
Default:
true
overwriteTags
string
If the request does not have tags, and a file already exists at the exact location, existing tags will be removed.

Allowed values:
true
false
Default:
true
overwriteCustomMetadata
string
If the request does not have customMetadata, and a file already exists at the exact location, existing customMetadata will be removed.

Allowed values:
true
false
Default:
true
customMetadata
string
Stringified JSON key-value data to be associated with the asset.

Example:
{"brand":"Nike","color":"red"}
transformation
string
Stringified JSON object with properties for pre and post transformations:

pre - Accepts a "string" containing a valid transformation used for requesting a pre-transformation for an image or a video file.

post - Accepts an array of objects with properties:

type: One of transformation, gif-to-video, thumbnail, or abs (Adaptive bitrate streaming).
value: A "string" corresponding to the required transformation. Required if type is transformation or abs. Optional if type is gif-to-video or thumbnail.
protocol: Either hls or dash, applicable only if type is abs.
Read more about Adaptive bitrate streaming (ABS).

Example:
{"pre": "width:300,height:300,quality:80", "post": [{"type": "thumbnail", "value": "width:100,height:100"}]}
checks
string
Server-side checks to run on the asset. Read more about Upload API checks.

Example:
"request.folder" : "marketing/"
description
string
Optional text to describe the contents of the file.

Example:
Running shoes
API key
:
username
file*
:
Pick a file
File uploadURL upload

File upload
fileName*
:
string
publicKey
:
string

Omit publicKey
signature
:
string

Omit signature
expire
:
string

Omit expire
token
:
string

Omit token
useUniqueFileName
:
Not Settruefalse

select an option

Omit useUniqueFileName
tags
:
string

Omit tags
folder
:
defaults to: /

Omit folder
isPrivateFile
:
Not Settruefalse

select an option

Omit isPrivateFile
isPublished
:
Not Settruefalse

select an option

Omit isPublished
customCoordinates
:
string

Omit customCoordinates
responseFields
:
string

Omit responseFields
extensions
:
string

Omit extensions
webhookUrl
:
string

Omit webhookUrl
overwriteFile
:
defaults to: true

Omit overwriteFile
overwriteAITags
:
Not Settruefalse

select an option

Omit overwriteAITags
overwriteTags
:
Not Settruefalse

select an option

Omit overwriteTags
overwriteCustomMetadata
:
Not Settruefalse

select an option

Omit overwriteCustomMetadata
customMetadata
:
string

Omit customMetadata
transformation
:
string

Omit transformation
checks
:
string

Omit checks
description
:
string

Omit description
Send API Request
Request sample
Note
Here, you can explore machine-generated code examples. For practical applications, refer to the examples section below, which includes detailed code snippets from the ImageKit SDKs.

curl --request POST \
  --url https://upload.imagekit.io/api/v1/files/upload \
  --header 'Accept: application/json' \
  --header 'Authorization: Basic 123' \
  --header 'Content-Type: multipart/form-data' \
  --form file= \
  --form fileName= \
  --form publicKey= \
  --form signature= \
  --form expire= \
  --form token= \
  --form useUniqueFileName= \
  --form tags= \
  --form folder= \
  --form isPrivateFile= \
  --form isPublished= \
  --form customCoordinates= \
  --form responseFields= \
  --form extensions= \
  --form webhookUrl= \
  --form overwriteFile= \
  --form overwriteAITags= \
  --form overwriteTags= \
  --form overwriteCustomMetadata= \
  --form customMetadata= \
  --form transformation= \
  --form checks= \
  --form description=
Responses
200
202
400
401
403
File uploaded successfully.

Body

application/json

application/json
responses
/
200
fileId
string
Unique fileId. Store this fileld in your database, as this will be used to perform update action on this file.

name
string
Name of the asset.

filePath
string
The relative path of the file in the media library e.g. /marketing-assets/new-banner.jpg.

url
string
A publicly accessible URL of the file.

thumbnailUrl
string
In the case of an image, a small thumbnail URL.

height
number
Height of the image in pixels (Only for images)

width
number
Width of the image in pixels (Only for Images)

size
number
Size of the image file in Bytes.

bitRate
integer
The bit rate of the video in kbps (only for video).

duration
integer
The duration of the video in seconds (only for video).

audioCodec
string
The audio codec used in the video (only for video).

videoCodec
string
The video codec used in the video (only for video).

tags
array[string] or null
The array of tags associated with the asset. If no tags are set, it will be null. Send tags in responseFields in API request to get the value of this field.

AITags
array[object] or null
An array of tags assigned to the uploaded file by auto tagging.

name
string
Name of the tag.

confidence
number
Confidence score of the tag.

source
string
Array of AITags associated with the image. If no AITags are set, it will be null. These tags can be added using the google-auto-tagging or aws-auto-tagging extensions.

versionInfo
object
An object containing the file or file version's id (versionId) and name.

id
string
Unique identifier of the file version.

name
string
Name of the file version.

isPrivateFile
boolean
Is the file marked as private. It can be either true or false. Send isPrivateFile in responseFields in API request to get the value of this field.

isPublished
boolean
Is the file published or in draft state. It can be either true or false. Send isPublished in responseFields in API request to get the value of this field.

customCoordinates
string or null
Value of custom coordinates associated with the image in the format x,y,width,height. If customCoordinates are not defined, then it is null. Send customCoordinates in responseFields in API request to get the value of this field.

fileType
string
Type of the uploaded file. Possible values are image, non-image.

customMetadata
object
A key-value data associated with the asset. Use responseField in API request to get customMetadata in the upload API response. Before setting any custom metadata on an asset, you have to create the field using custom metadata fields API. Send customMetadata in responseFields in API request to get the value of this field.

extensionStatus
object
Extension names with their processing status at the time of completion of the request. It could have one of the following status values:Show all...

google-auto-tagging
string
Allowed values:
success
pending
failed
aws-auto-tagging
string
Allowed values:
success
pending
failed
remove-bg
string
Allowed values:
success
pending
failed
ai-auto-description
string
Allowed values:
success
pending
failed
metadata
object
Legacy metadata. Send metadata in responseFields in API request to get metadata in the upload API response.

height
integer
The height of the image or video in pixels.

width
integer
The width of the image or video in pixels.

size
integer
The file size in bytes.

format
string
The format of the file (e.g., 'jpg', 'mp4').

hasColorProfile
boolean
Indicates if the image has a color profile.

quality
integer
The quality indicator of the image.

density
integer
The density of the image in DPI.

hasTransparency
boolean
Indicates if the image contains transparent areas.

pHash
string
Perceptual hash of the image.

bitRate
integer
The bit rate of the video in kbps (only for video).

duration
integer
The duration of the video in seconds (only for video).

audioCodec
string
The audio codec used in the video (only for video).

videoCodec
string
The video codec used in the video (only for video).

exif
object
embeddedMetadata
object
Consolidated embedded metadata associated with the file. It includes exif, iptc, and xmp data. Send embeddedMetadata in responseFields in API request to get embeddedMetadata in the upload API response.

Orientation
string
Example:
Horizontal (normal)
ExifVersion
string
Example:
0232
ImageDescription
string
Example:
The description aka caption (ref2019.1)
XResolution
number
Example:
72
YResolution
number
Example:
72
ResolutionUnit
string
Example:
inches
Artist
string
Example:
Creator1 (ref2019.1)
Copyright
string
Example:
Copyright (Notice) 2019.1 IPTC - www.iptc.org (ref2019.1)
DateTimeOriginal
string
<date-time>
Example:
2019-10-16T19:01:03.000Z
OffsetTimeOriginal
string
Example:
+00:00
ComponentsConfiguration
string
Example:
Y,Cb,Cr,-
FlashpixVersion
string
Example:
0100
ColorSpace
string
Example:
Uncalibrated
ObjectAttributeReference
string
Example:
A Genre (ref2019.1)
ObjectName
string
Example:
The Title (ref2019.1)
SubjectReference
array[string]
Example:
["IPTC:1ref2019.1","IPTC:2ref2019.1","IPTC:3ref2019.1"]
Keywords
array[string]
Example:
["Keyword1ref2019.1","Keyword2ref2019.1","Keyword3ref2019.1"]
SpecialInstructions
string
Example:
An Instruction (ref2019.1)
TimeCreated
string
Example:
19:01:03+00:00
Byline
string
Example:
Creator1 (ref2019.1)
BylineTitle
string
Example:
Creator's Job Title (ref2019.1)
Sublocation
string
Example:
Sublocation (Core) (ref2019.1)
ProvinceState
string
Example:
Province/State(Core)(ref2019.1)
CountryPrimaryLocationCode
string
Example:
R19
CountryPrimaryLocationName
string
Example:
Country (Core) (ref2019.1)
OriginalTransmissionReference
string
Example:
Job Id (ref2019.1)
CopyrightNotice
string
Example:
Copyright (Notice) 2019.1 IPTC - www.iptc.org (ref2019.1)
CaptionAbstract
string
Example:
The description aka caption (ref2019.1)
WriterEditor
string
Example:
Description Writer (ref2019.1)
ApplicationRecordVersion
integer
Example:
4
CountryCode
string
Example:
R19
CreatorCity
string
Example:
Creator's CI: City (ref2019.1)
CreatorCountry
string
Example:
Creator's CI: Country (ref2019.1)
CreatorAddress
string
Example:
Creator's CI: Address, line 1 (ref2019.1)
CreatorPostalCode
string
Example:
Creator's CI: Postcode (ref2019.1)
CreatorRegion
string
Example:
Creator's CI: State/Province (ref2019.1)
CreatorWorkEmail
string
Example:
Creator's CI: Email@1, Email@2 (ref2019.1)
CreatorWorkTelephone
string
Example:
Creator's CI: Phone # 1, Phone # 2 (ref2019.1)
CreatorWorkURL
string
Example:
http://www.Creators.CI/WebAddress/ref2019.1
IntellectualGenre
string
Example:
A Genre (ref2019.1)
Location
string
Example:
Sublocation (Core) (ref2019.1)
Scene
array[string]
Example:
["IPTC-Scene-Code1 (ref2019.1)","IPTC-Scene-Code2 (ref2019.1)"]
SubjectCode
array[string]
Example:
["IPTC:1ref2019.1","IPTC:2ref2019.1","IPTC:3ref2019.1"]
AboutCvTermCvId
string
Example:
http://example.com/cv/about/ref2019.1
AboutCvTermId
string
Example:
http://example.com/cv/about/ref2019.1/code987
AboutCvTermName
string
Example:
CV-Term Name 1 (ref2019.1)
AboutCvTermRefinedAbout
string
Example:
http://example.com/cv/refinements2/ref2019.1/codeX145
AdditionalModelInformation
string
Example:
Additional Model Info (ref2019.1)
ArtworkCircaDateCreated
string
Example:
AO Circa Date: between 1550 and 1600 (ref2019.1)
ArtworkContentDescription
string
Example:
AO Content Description 1 (ref2019.1)
ArtworkContributionDescription
string
Example:
AO Contribution Description 1 (ref2019.1)
ArtworkCopyrightNotice
string
Example:
AO Copyright Notice 1 (ref2019.1)
ArtworkCreator
array[string]
Example:
["AO Creator Name 1a (ref2019.1)","AO Creator Name 1b (ref2019.1)"]
ArtworkCreatorID
array[string]
Example:
["AO Creator Id 1a (ref2019.1)","AO Creator Id 1b (ref2019.1)"]
ArtworkCopyrightOwnerID
string
Example:
AO Current Copyright Owner ID 1 (ref2019.1)
ArtworkCopyrightOwnerName
string
Example:
AO Current Copyright Owner Name 1 (ref2019.1)
ArtworkLicensorID
string
Example:
AO Current Licensor ID 1 (ref2019.1)
ArtworkLicensorName
string
Example:
AO Current Licensor Name 1 (ref2019.1)
ArtworkDateCreated
string
<date-time>
Example:
1919-10-16T19:01:00.000Z
ArtworkPhysicalDescription
string
Example:
AO Physical Description 1 (ref2019.1)
ArtworkSource
string
Example:
AO Source 1 (ref2019.1)
ArtworkSourceInventoryNo
string
Example:
AO Source Inventory No 1 (ref2019.1)
ArtworkSourceInvURL
string
Example:
AO Source Inventory URL (ref2019.1)
ArtworkStylePeriod
array[string]
Example:
["AO Style Baroque (ref2019.1)","AO Style Italian Baroque (ref2019.1)"]
ArtworkTitle
string
Example:
AO Title 1 (ref2019.1)
DigitalImageGUID
string
Example:
http://example.com/imageGUIDs/TestGUID12345/ref2019.1
DigitalSourceType
string
Example:
http://cv.iptc.org/newscodes/digitalsourcetype/softwareImage
EmbeddedEncodedRightsExpr
string
Example:
The Encoded Rights Expression (ref2019.1)
EmbeddedEncodedRightsExprType
string
Example:
IANA Media Type of ERE (ref2019.1)
EmbeddedEncodedRightsExprLangID
string
Example:
http://example.org/RELids/id4711/ref2019.1
Event
string
Example:
An Event (ref2019.1)
GenreCvId
string
Example:
http://example.com/cv/genre/ref2019.1
GenreCvTermId
string
Example:
http://example.com/cv/genre/ref2019.1/code1369
GenreCvTermName
string
Example:
Genre CV-Term Name 1 (ref2019.1)
GenreCvTermRefinedAbout
string
Example:
http://example.com/cv/genrerefinements2/ref2019.1/codeY864
ImageRegionName
array[string]
Example:
["Listener 1","Listener 2","Speaker 1"]
ImageRegionOrganisationInImageName
array[string]
Example:
["Organisation name no 1 in region persltr2 (ref2019.1)","Organisation name no 1 in region persltr2 (ref2019.1)","Organisation name no 1 in region persltr3 (ref2019.1)"]
ImageRegionPersonInImage
array[string]
Example:
["Person name no 1 in region persltr2 (ref2019.1)","Person name no 1 in region persltr3 (ref2019.1)","Person name no 1 in region persltr1 (ref2019.1)"]
ImageRegionBoundaryH
array[number]
Example:
[0.385]
ImageRegionBoundaryShape
array[string]
Example:
["rectangle","circle","polygon"]
ImageRegionBoundaryUnit
array[string]
Example:
["relative","relative","relative"]
ImageRegionBoundaryW
array[number]
Example:
[0.127]
ImageRegionBoundaryX
array[number]
Example:
[0.31,0.59]
ImageRegionBoundaryY
array[number]
Example:
[0.18,0.426]
ImageRegionCtypeName
array[string]
Example:
["Region Boundary Content Type Name (ref2019.1)","Region Boundary Content Type Name (ref2019.1)","Region Boundary Content Type Name (ref2019.1)"]
ImageRegionCtypeIdentifier
array[string]
Example:
["https://example.org/rctype/type2019.1a","https://example.org/rctype/type2019.1b","https://example.org/rctype/type2019.1a","https://example.org/rctype/type2019.1b","https://example.org/rctype/type2019.1a","https://example.org/rctype/type2019.1b"]
ImageRegionID
array[string]
Example:
["persltr2","persltr3","persltr1"]
ImageRegionRoleName
array[string]
Example:
["Region Boundary Content Role Name (ref2019.1)","Region Boundary Content Role Name (ref2019.1)","Region Boundary Content Role Name (ref2019.1)"]
ImageRegionRoleIdentifier
array[string]
Example:
["https://example.org/rrole/role2019.1a","https://example.org/rrole/role2019.1b","https://example.org/rrole/role2019.1a","https://example.org/rrole/role2019.1b","https://example.org/rrole/role2019.1a","https://example.org/rrole/role2019.1b"]
ImageRegionBoundaryRx
array[number]
Example:
[0.068]
ImageRegionBoundaryVerticesX
array[number]
Example:
[0.05,0.148,0.375]
ImageRegionBoundaryVerticesY
array[number]
Example:
[0.713,0.041,0.863]
LinkedEncodedRightsExpr
string
Example:
http://example.org/linkedrightsexpression/id986/ref2019.1
LinkedEncodedRightsExprType
string
Example:
IANA Media Type of ERE (ref2019.1)
LinkedEncodedRightsExprLangID
string
Example:
http://example.org/RELids/id4712/ref2019.1
LocationCreatedCity
string
Example:
City (Location created1) (ref2019.1)
LocationCreatedCountryCode
string
Example:
R17
LocationCreatedCountryName
string
Example:
CountryName (Location created1) (ref2019.1)
LocationCreatedLocationId
string
Example:
Location Id (Location created1) (ref2019.1)
LocationCreatedLocationName
string
Example:
Location Name (Location created1) (ref2019.1)
LocationCreatedProvinceState
string
Example:
Province/State (Location created1) (ref2019.1)
LocationCreatedSublocation
string
Example:
Sublocation (Location created1) (ref2019.1)
LocationCreatedWorldRegion
string
Example:
Worldregion (Location created1) (ref2019.1)
LocationCreatedGPSAltitude
string
Example:
480 m
LocationCreatedGPSLatitude
string
Example:
48,16.5N
LocationCreatedGPSLongitude
string
Example:
16,20.28E
LocationShownCity
array[string]
Example:
["City (Location shown1) (ref2019.1)","City (Location shown2) (ref2019.1)"]
LocationShownCountryCode
array[string]
Example:
["R17","R17"]
LocationShownCountryName
array[string]
Example:
["CountryName (Location shown1) (ref2019.1)","CountryName (Location shown2) (ref2019.1)"]
LocationShownLocationId
array[string]
Example:
["Location Id 1a(Location shown1) (ref2019.1)","Location Id 1b(Location shown1) (ref2019.1)","Location Id 2a(Location shown2) (ref2019.1)","Location Id 2b(Location shown2) (ref2019.1)"]
LocationShownLocationName
array[string]
Example:
["Location Name (Location shown1) (ref2019.1)","Location Name (Location shown2) (ref2019.1)"]
LocationShownProvinceState
array[string]
Example:
["Province/State (Location shown1) (ref2019.1)","Province/State (Location shown2) (ref2019.1)"]
LocationShownSublocation
array[string]
Example:
["Sublocation (Location shown1) (ref2019.1)","Sublocation (Location shown2) (ref2019.1)"]
LocationShownWorldRegion
array[string]
Example:
["Worldregion (Location shown1) (ref2019.1)","Worldregion (Location shown2) (ref2019.1)"]
LocationShownGPSAltitude
array[string]
Example:
["140 m","120 m"]
LocationShownGPSLatitude
array[string]
Example:
["48,8.82N","47,57.12N"]
LocationShownGPSLongitude
array[string]
Example:
["17,5.88E","16,49.8E"]
MaxAvailHeight
number
Example:
20
MaxAvailWidth
number
Example:
19
ModelAge
array[number]
Example:
[25,27,30]
OrganisationInImageCode
array[string]
Example:
["Organisation Code 1 (ref2019.1)","Organisation Code 2 (ref2019.1)","Organisation Code 3 (ref2019.1)"]
OrganisationInImageName
array[string]
Example:
["Organisation Name 1 (ref2019.1)","Organisation Name 2 (ref2019.1)","Organisation Name 3 (ref2019.1)"]
PersonInImage
array[string]
Example:
["Person Shown 1 (ref2019.1)","Person Shown 2 (ref2019.1)"]
PersonInImageCvTermCvId
array[string]
Example:
["http://example.com/cv/test99/ref2019.1"]
PersonInImageCvTermId
array[string]
Example:
["http://example.com/cv/test99/code987/ref2019.1"]
PersonInImageCvTermName
array[string]
Example:
["Person Characteristic Name 1 (ref2019.1)"]
PersonInImageCvTermRefinedAbout
array[string]
Example:
["http://example.com/cv/refinements987/codeY765/ref2019.1"]
PersonInImageDescription
array[string]
Example:
["Person Description 1 (ref2019.1)"]
PersonInImageId
array[string]
Example:
["http://wikidata.org/item/Q123456789/ref2019.1","http://freebase.com/m/987654321/ref2019.1"]
PersonInImageName
array[string]
Example:
["Person Name 1 (ref2019.1)"]
ProductInImageDescription
array[string]
Example:
["Product Description 1 (ref2019.1)"]
ProductInImageGTIN
array[number]
Example:
[123456782019.1]
ProductInImageName
array[string]
Example:
["Product Name 1 (ref2019.1)"]
RegistryEntryRole
array[string]
Example:
["Registry Entry Role ID 1 (ref2019.1)","Registry Entry Role ID 2 (ref2019.1)"]
RegistryItemID
array[string]
Example:
["Registry Image ID 1 (ref2019.1)","Registry Image ID 2 (ref2019.1)"]
RegistryOrganisationID
array[string]
Example:
["Registry Organisation ID 1 (ref2019.1)","Registry Organisation ID 2 (ref2019.1)"]
Creator
string
Example:
Creator1 (ref2019.1)
Description
string
Example:
The description aka caption (ref2019.1)
Rights
string
Example:
Copyright (Notice) 2019.1 IPTC - www.iptc.org (ref2019.1)
Subject
array[string]
Example:
["Keyword1ref2019.1","Keyword2ref2019.1","Keyword3ref2019.1"]
Title
string
Example:
The Title (ref2019.1)
AuthorsPosition
string
Example:
Creator's Job Title (ref2019.1)
CaptionWriter
string
Example:
Description Writer (ref2019.1)
City
string
Example:
City (Core) (ref2019.1)
Country
string
Example:
Country (Core) (ref2019.1)
Credit
string
Example:
Credit Line (ref2019.1)
DateCreated
string
<date-time>
Example:
2019-10-16T00:00:00.000Z
Headline
string
Example:
The Headline (ref2019.1)
Instructions
string
Example:
An Instruction (ref2019.1)
Source
string
Example:
Source (ref2019.1)
State
string
Example:
Province/State(Core)(ref2019.1)
TransmissionReference
string
Example:
Job Id (ref2019.1)
CopyrightOwnerID
array[string]
Example:
["Copyright Owner Id 1 (ref2019.1)","Copyright Owner Id 2 (ref2019.1)"]
CopyrightOwnerName
array[string]
Example:
["Copyright Owner Name 1 (ref2019.1)","Copyright Owner Name 2 (ref2019.1)"]
ImageCreatorID
string
Example:
Image Creator Id 1 (ref2019.1)
ImageCreatorName
string
Example:
Image Creator Name 1 (ref2019.1)
ImageCreatorImageID
string
Example:
Image Creator Image ID (ref2019.1)
ImageSupplierID
string
Example:
Image Supplier Id (ref2019.1)
ImageSupplierName
string
Example:
Image Supplier Name (ref2019.1)
ImageSupplierImageID
string
Example:
Image Supplier Image ID (ref2019.1)
LicensorCity
array[string]
Example:
["Licensor City 1 (ref2019.1)","Licensor City 2 (ref2019.1)"]
LicensorCountry
array[string]
Example:
["Licensor Country 1 (ref2019.1)","Licensor Country 2 (ref2019.1)"]
LicensorEmail
array[string]
Example:
["Licensor Email 1 (ref2019.1)","Licensor Email 2 (ref2019.1)"]
LicensorExtendedAddress
array[string]
Example:
["Licensor Ext Addr 1 (ref2019.1)","Licensor Ext Addr 2 (ref2019.1)"]
LicensorID
array[string]
Example:
["Licensor ID 1 (ref2019.1)","Licensor ID 2 (ref2019.1)"]
LicensorName
array[string]
Example:
["Licensor Name 1 (ref2019.1)","Licensor Name 2 (ref2019.1)"]
LicensorPostalCode
array[string]
Example:
["Licensor Postcode 1 (ref2019.1)","Licensor Postcode 2 (ref2019.1)"]
LicensorRegion
array[string]
Example:
["Licensor Region 1 (ref2019.1)","Licensor Region 2 (ref2019.1)"]
LicensorStreetAddress
array[string]
Example:
["Licensor Street Addr 1 (ref2019.1)","Licensor Street Addr 2 (ref2019.1)"]
LicensorTelephone1
array[string]
Example:
["Licensor Phone1 1 (ref2019.1)","Licensor Phone1 2 (ref2019.1)"]
LicensorTelephone2
array[string]
Example:
["Licensor Phone2 1 (ref2019.1)","Licensor Phone2 2 (ref2019.1)"]
LicensorURL
array[string]
Example:
["Licensor URL 1 (ref2019.1)","Licensor URL 2 (ref2019.1)"]
ModelReleaseID
array[string]
Example:
["Model Release ID 1 (ref2019.1)","Model Release ID 2 (ref2019.1)"]
PropertyReleaseID
array[string]
Example:
["Property Release ID 1 (ref2019.1)","Property Release ID 2 (ref2019.1)"]
Rating
integer
Example:
1
UsageTerms
string
Example:
Rights Usage Terms (ref2019.1)
WebStatement
string
Example:
http://www.WebStatementOfRights.org/2019.1
DateTimeCreated
string
<date-time>
Example:
2019-10-16T00:00:00.000Z
Caption
string
Example:
The description aka caption (ref2019.1)
Writer
string
Example:
Description Writer (ref2019.1)
description
string
Optional text to describe the contents of the file. Can be set by the user or the ai-auto-description extension.

Response example
{
  "fileId": "6673f88237b244ef54d60180",
  "name": "test-image.jpg",
  "size": 117079,
  "versionInfo": {
    "id": "6673f88237b244ef54d60180",
    "name": "Version 1"
  },
  "filePath": "/test-image.jpg",
  "url": "https://ik.imagekit.io/demo/test-image.jpg",
  "fileType": "image",
  "height": 500,
  "width": 1000,
  "orientation": 1,
  "thumbnailUrl": "https://ik.imagekit.io/demo/tr:n-ik_ml_thumbnail/test-image.jpg"
}
Examples
Here are some example requests and responses to understand the API usage.

Uploading file from file system

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg;type=image/jpg' \
-F 'fileName=my_file_name.jpg'
Uploading base64 encoded file with some tags

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=iVBORw0KGgoAAAAN' \
-F 'fileName=my_file_name.jpg' \
-F 'tags=tag1,tag2'
Uploading file via URL

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=https://imagekit.io/image.jpg' \
-F 'fileName=my_file_name.jpg'
Setting custom metadata during upload

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=https://ik.imagekit.io/ikmedia/red_dress_woman.jpeg' \
-F 'fileName=women_in_red.jpg' \
-F 'customMetadata={"brand":"Nike", "color":"red"}'
Applying extensions while uploading

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg' \
-F 'fileName=my_file_name.jpg' \
-F 'extensions=[{"name":"remove-bg","options":{"add_shadow":true,"bg_colour":"green"}},{"name":"google-auto-tagging","maxTags":5,"minConfidence":95}]'
Applying pre & post transformations while uploading

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg' \
-F 'fileName=my_file_name.jpg' \
-F 'transformation={"pre":"rt-90", "post": [{"type": "transformation", "value": "bg-red"}]}
How to implement client-side file upload?
Here are the steps:

The client-side application initiates a request to the backend to obtain authentication parameters. This request should be made to a secure API endpoint accessible only to authenticated users, safeguarding your ImageKit Media library from unauthorized access.
The required parameters are generated on the backend using the private API key. This is explained below with examples in different programming languages.
The client-side application then includes these security parameters in the payload of the upload API request.
Never publish your private key on client-side
The Private API key should be kept confidential and only stored on your servers.

Using ImageKit client-side and server-side SDKs, you can quickly implement upload functionality.

On the backend, you can use the utility functions provided in all server-side SDKs to implement the secure API.
On client-side applications, use ImageKit client-side SDKs to get started quickly. See examples.
Backend signature generation

Pseudo code
Copy
var token = req.query.token || uuid.v4();
var expire = req.query.expire || parseInt(Date.now()/1000)+2400;
var privateAPIKey = "your_private_key";
var signature = crypto.createHmac('sha1', privateAPIKey).update(token+expire).digest('hex');
res.set({
    "Access-Control-Allow-Origin" : "*"
})
res.status(200);
res.send({
    token : token,
    expire : expire,
    signature : signature
})
Client-side file upload examples
The example below demonstrates only basic usage. Refer to these examples to learn about different use cases. The only difference between client-side and server-side uploads is how API authentication works.

Make sure you have implemented the secure API in the backend that can return the signature, one-time token, and expire parameters.

The best way is to follow quick start guides for your programming language.


JavaScipt SDK


jQuery (without SDK)


React SDK


Vue.js SDK

<form action="#" onsubmit="upload()">
  <input type = "file" id="file1" />
  <input type = "submit" />
</form>
<script type="text/javascript" src="../dist/imagekit.js"></script>

<script>
  /*  
    SDK initialization
  */
  const imagekit = new ImageKit({
    publicKey: "your_public_api_key",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
  });

  // Upload function internally uses the ImageKit.io javascript SDK
  async function upload(data) {
    const file = document.getElementById("file1");
    const authenticationEndpoint = "https://www.yourserver.com/auth";
    const authResponse = await fetch(authenticationEndpoint, {
      method: "GET",
      // You can also pass headers and validate the request source in the backend, or you can use headers for any other use case.
      headers: {
	'Content-Type': 'application/json',
        'Authorization': 'Bearer your-access-token',
        'CustomHeader': 'CustomValue'
      },
    });

    if (!authResponse.ok) {
      throw new Error("Failed to fetch auth details");
    }

    const authData = await authResponse.json();

    imagekit.upload({
      file: file.files[0],
      fileName: "abc.jpg",
      tags: ["tag1"],
      token: authData.token,
      signature: authData.signature,
      expire: authData.expire,
    }, function(err, result) {
      console.log(imagekit.url({
        src: result.url,
        transformation : [{ height: 300, width: 400}]
      }));
    })
  }
</script>
Upload API Checks
The checks parameter can be used to run server-side checks before files are uploaded to Media Library.

For requests involving pre-transformations on video files, checks will run asynchronously after the file has been transformed & before its uploaded to your Media Library.

You'll get an upload.pre-transform.error webhook event in case the check fails or an error occurs.

Note: Checks don't run on the post-transformations generated for an asset.

Basic examples

Basic usage


Using AND/OR operator


Grouping multiple queries

You can add a check that'll limit uploads to the marketing folder and its sub-folders.

"request.folder" : "marketing/"
Remember to enclose the field you're running checks on in quotes like "request.folder" in the above example.

Check based on custom metadata
To run checks on custom metadata fields, prefix the field name with request.customMetadata..

For eg: If you want to run a check on a custom metadata field named quantity, specify the field as request.customMetadata.quantity.

Supported Fields
Field	Supported Operators	Examples
request.fileName	=, NOT =, :, IN, NOT IN	Accepts a string value in quotes.
"request.fileName" : "screenshot" will prevent any files from names starting with the string screenshot from being uploaded.
"request.fileName" NOT = "mountain.jpg" will prevent any files with the name mountain.jpg from being uploaded (provided useUniqueFileName parameter is false).
request.useUniqueFileName	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.useUniqueFileName" = true will only allow requests that have useUniqueFileName set to true.
request.tags	IN, NOT IN	Accepts an array of string values.
"request.tags" IN ["summer-collection", "sale"] will only allow files that have either summer-collection or sale inside the tags array.
"request.tags" NOT IN ["big-banner"] will only allow files that do not have big-banner inside the tags array.
request.folder	=, NOT =, :, IN, NOT IN	Accepts a string value in quotes.
"request.folder = "engineering" will limit file uploads to the engineering folder.
"request.folder : "offsites/" will limit file uploads to the folder offsites and its sub-folders.
"request.folder" IN ["apparels", "cars"] will limit file uploads to the apparels or cars folder.
request.isPrivateFile	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.isPrivateFile" = true will only allow requests that have isPrivateFile set to true.
request.isPublished	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.isPublished" = false will only allow requests that have isPublished set to false.
request.customCoordinates	=, NOT =, :, IN, NOT IN	Accepts a string value in quotes.

"request.customCoordinates" = "10,10,500,300" will not allow files that don't have the custom coordinate value set to 10,10,500,300.
request.webhookUrl	=, NOT =, :, IN, NOT IN	Accepts a string value in quotes.

"request.webhookUrl" : "https://" will prevent URLs without HTTPS from being used.
request.overwriteFile	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.overwriteFile" = false will only allow requests that have overwriteFile set to false.
request.overwriteAITags	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.overwriteAITags" = false will only allow requests that have overwriteAITags set to false.
request.overwriteTags	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.overwriteTags" = false will only allow requests that have overwriteTags set to false.
request.overwriteCustomMetadata	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.overwriteCustomMetadata" = false will only allow requests that have overwriteCustomMetadata set to false.
file.size	=, >, >=, <, <=	Accepts a numeric value e.g. 500, 200 or string e.g. 1mb, 10kb.
"file.size" < 1024 will prevent any file with size greater than 1024 bytes from being uploaded.
"file.size" <= "50mb" will prevent any file with size greater than or equal to 50MB from being uploaded.
file.mime	=, NOT =, :, IN, NOT IN	Accepts a string value e.g. image/webp, video/mp4.
"file.mime" : image will limit file uploads to assets with mime-type starting from image.
"file.mime" IN ["image/jpg", "image/png"] will only allow files with the listed mime-type.
mediaMetadata.width	=, >, >=, <, <=	Accepts a numeric value.

"mediaMetadata.width" < 550 will prevent media files with width lesser than 550px from being uploaded.
mediaMetadata.height	=, >, >=, <, <=	Accepts a numeric value.

"mediaMetadata.height" < 550 will prevent media files with height lesser than 550px from being uploaded.
mediaMetadata.duration	=, >, >=, <, <=	Accepts a numeric value (in seconds). Only applicable for video-type assets.

"mediaMetadata.duration" > 5 will only allow files with duration larger than 5 seconds.
mediaMetadata.videoCodec	=, NOT =, :, IN, NOT IN	Accepts a string value e.g. h264, vp8. Only applicable for video-type assets.
"mediaMetadata.videoCodec" = "h264" will only allow files with the video codec h264.
"mediaMetadata.videoCodec" IN ["mpeg", "mpegvideo"] will only allow files with the video codec mpeg or mpegvideo.
mediaMetadata.audioCodec	=, NOT =, :, IN, NOT IN	Accepts a string value e.g. aac, mp3 . Only applicable for video-type assets.

"mediaMetadata.audioCodec" = "aac" will only allow files with the audio codec aac.
mediaMetadata.bitRate	=, >, >=, <, <=	Accepts a numeric value. Only applicable for video-type assets.

"mediaMetadata.bitRate" < 10000 will only allow files with bitrate lesser than 10000.
Custom metadata Text type field	=, NOT =, IN, NOT IN, :	Accepts a string value in quotes.
"request.customMetadata.kind" IN ["hatchback", "sedan"] will only allow files with kind equal to hatchback or sedan.
"request.customMetadata.color" = "red" will only allow files with color equal to red.
Custom metadata Textarea type field	=, NOT =, IN, NOT IN, :	Accepts a string value in quotes.
"request.customMetadata.description" : "Ontario" will only allow files with description value starting from Ontario.
Custom metadata Date type field	=, NOT =, IN, NOT IN, >, >=, <, <=	Accepts a string value in ISO 8601 format.
"request.customMetadata.purchaseDate" > "2024-01-01" will only allow files with a purchaseDate value later than January 1, 2024, at 00:00 hours in UTC.
"request.customMetadata.purchaseDate" > "2024-01-01T12:12:12" will only allow files with a purchaseDate value later than January 1, 2024, 12:12:12 hours in UTC.
Custom metadata Number type field	=, NOT =, IN, NOT IN, >, >=, <, <=	Accepts a numeric value.

"request.customMetadata.quantitySold" > 200 will only allow files with quantitySold value greater than 200.
Custom metadata Boolean type field	=, NOT =	Accepts a boolean value i.e., true or false without quotes.

"request.customMetadata.active" = true will only allow files with the active value equal to true.
Custom metadata SingleSelect type	=, NOT =, IN, NOT IN, :, >, >=, <, <=	Accepts boolean, numeric, or string values.
"request.customMetadata.tShirtSize" = "XL" will only allow files with the tShirtSize field set to XL.
"request.customMetadata.rating" IN [3, 4, 5] will only allow files with the rating field set to one of the listed values.
Custom metadata MultiSelect type	IN, NOT IN	Accepts an array of boolean, numeric, or string values.
"request.customMetadata.tuple" IN ["luxury", 500, true] will limit uploads to files that have either luxury, 500, or true as one of the values in its tuple field.
"request.customMetadata.descriptors" NOT IN ["big-banner"] won't allow uploading any file with big-banner as one of the values in its descriptors field.
Examples
Here are some example requests to understand the API usage.

Limiting file size

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg' \
-F 'fileName=my_file_name.jpg' \
-F "checks='file.size' < '1MB'"
Limiting mime-type

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg' \
-F 'fileName=my_file_name.jpg' \
-F "checks='file.mime' IN ['image/jpeg', 'image/png', 'image/svg+xml']"
Limiting media dimensions

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg' \
-F 'fileName=my_file_name.jpg' \
-F "checks='mediaMetadata.height' <= 300 AND 'mediaMetadata.width' <= 500"

import React from 'react';
import { IKContext, IKUpload } from 'imagekitio-react'

function App() {
  const publicKey = "your_public_api_key";
  const urlEndpoint = "https://ik.imagekit.io/your_imagekit_id";
  const authenticator = async () => {
    try {
      // You can also pass headers and validate the request source in the backend, or you can use headers for any other use case.
      const headers = {
        'Authorization': 'Bearer your-access-token',
        'CustomHeader': 'CustomValue'
      };
      const response = await fetch('server_endpoint', {
          headers
      });
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <p>To use this funtionality please remember to setup the server</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator} >
        <IKUpload fileName="abc.jpg" tags={["tag1"]} useUniqueFileName={true} isPrivateFile= {false} />
      </IKContext>   
    </div>
  );
}

export default App;

{
  "fileId": "6673f88237b244ef54d60180",
  "name": "test-image.jpg",
  "size": 117079,
  "versionInfo": {
    "id": "6673f88237b244ef54d60180",
    "name": "Version 1"
  },
  "filePath": "/test-image.jpg",
  "url": "https://ik.imagekit.io/demo/test-image.jpg",
  "fileType": "image",
  "height": 500,
  "width": 1000,
  "orientation": 1,
  "thumbnailUrl": "https://ik.imagekit.io/demo/tr:n-ik_ml_thumbnail/test-image.jpg"
}

{
  "message": "The pre-transformation has been queued successfully."
}

{
  "message": "Your request is missing file parameter.",
  "help": "For support kindly contact us at support@imagekit.io."
}

{
  "message": "Your request does not contain private API key.",
  "help": "For support kindly contact us at support@imagekit.io."
}

{
  "message": "Your account cannot be authenticated.",
  "help": "For support kindly contact us at support@imagekit.io."
}

Python
Copy
import base64
import os
import sys
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key='your_public_key',
    private_key='your_private_key',
    url_endpoint = 'your_url_endpoint'
)

upload = imagekit.upload(
    file=open("image.jpg", "rb"),
    file_name="my_file_name.jpg",
    options=UploadFileRequestOptions(
        tags = ["tag1", "tag2"]
    )
)

print("Upload binary", upload)

# Raw Response
print(upload.response_metadata.raw)

# print that uploaded file's ID
print(upload.file_id)
Uploading base64 encoded file with some tags

Python
Copy
import base64
import os
import sys
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key='your public_key',
    private_key='your private_key',
    url_endpoint = 'your url_endpoint'
)

with open("image.jpg", mode="rb") as img:
    imgstr = base64.b64encode(img.read())

upload = imagekit.upload(
    file=imgstr,
    file_name="my_file_name.jpg",
    options=UploadFileRequestOptions(
            response_fields = ["is_private_file", "custom_metadata", "tags"],
            is_private_file = False,
            tags = ["tag1", "tag2"],
            webhook_url = "url",
            overwrite_file = False,
            overwrite_ai_tags = False,
            overwrite_tags = False,
            overwrite_custom_metadata = True,
            custom_metadata = {"test": 11})
    ),
)

print("Upload base64", upload)

# Raw Response
print(upload.response_metadata.raw)

# print that uploaded file's ID
print(upload.file_id)

# print that uploaded file's version ID
print(upload.version_info.id)
Uploading file via URL

Python
Copy
import base64
import os
import sys
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key='your public_key',
    private_key='your private_key',
    url_endpoint = 'your url_endpoint'
)

with open("image.jpg", mode="rb") as img:
    imgstr = base64.b64encode(img.read())

upload = imagekit.upload(
    file="https://imagekit.io/image.jpg",
    file_name="my_file_name.jpg",
    options=UploadFileRequestOptions(),
)

print("Upload url", upload)

# Raw Response
print(upload.response_metadata.raw)

# print that uploaded file's ID
print(upload.file_id)
Setting custom metadata during upload

Python
Copy
import base64
import os
import sys
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key='your public_key',
    private_key='your private_key',
    url_endpoint = 'your url_endpoint'
)

with open("image.jpg", mode="rb") as img:
    imgstr = base64.b64encode(img.read())

upload = imagekit.upload(
    file="https://ik.imagekit.io/ikmedia/red_dress_woman.jpeg",
    file_name="women_in_red.jpg",
    options=UploadFileRequestOptions(
        custom_metadata = {"brand":"Nike", "color":"red"}
    ),
)

print("Upload url", upload)

# Raw Response
print(upload.response_metadata.raw)

# print that uploaded file's ID
print(upload.file_id)
Applying extensions while uploading

Python
Copy
import base64
import os
import sys
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key='your public_key',
    private_key='your private_key',
    url_endpoint = 'your url_endpoint'
)

with open("image.jpg", mode="rb") as img:
    imgstr = base64.b64encode(img.read())

upload = imagekit.upload(
    file="https://ik.imagekit.io/ikmedia/red_dress_woman.jpeg",
    file_name="women_in_red.jpg",
    options=UploadFileRequestOptions(
        extensions = [{"name": "remove-bg", "options": {"add_shadow": True, "bg_color": "pink"}},
                {"name": "google-auto-tagging", "minConfidence": 80, "maxTags": 10}]
    ),
)

print("Upload url", upload)

# Raw Response
print(upload.response_metadata.raw)

# print that uploaded file's ID
print(upload.file_id)
Applying pre & post transformations while uploading

cURL
Copy
curl -X POST "https://upload.imagekit.io/api/v1/files/upload" \
-u your_private_api_key: \
-F 'file=@/Users/username/Desktop/my_file_name.jpg' \
-F 'fileName=my_file_name.jpg' \
-F 'transformation={"pre":"rt-90", "post": [{"type": "transformation", "value": "bg-red"}]}
How to implement client-side file upload?
Here are the steps:

The client-side application initiates a request to the backend to obtain authentication parameters. This request should be made to a secure API endpoint accessible only to authenticated users, safeguarding your ImageKit Media library from unauthorized access.
The required parameters are generated on the backend using the private API key. This is explained below with examples in different programming languages.
The client-side application then includes these security parameters in the payload of the upload API request.
Never publish your private key on client-side
The Private API key should be kept confidential and only stored on your servers.

Using ImageKit client-side and server-side SDKs, you can quickly implement upload functionality.

On the backend, you can use the utility functions provided in all server-side SDKs to implement the secure API.
On client-side applications, use ImageKit client-side SDKs to get started quickly. See examples.
Backend signature generation

Python
Copy
import base64
import os
import sys
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key='your public_key',
    private_key='your private_key',
    url_endpoint = 'your url_endpoint'
)

auth_params = imagekit.get_authentication_parameters()

print("Auth params-", auth_params)


