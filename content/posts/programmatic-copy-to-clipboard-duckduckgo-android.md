---
title: "Handling programmatic \"Copy to Clipboard\" on DuckDuckGo Android browser"
description: "A workaround to the NotAllowedError you get when trying to use the write / writeText methods of the clipboard API"
date: "2023-01-04T14:42:44.420Z"
slug: "programmatic-copy-to-clipboard-duckduckgo-android"
cover: "/images/posts/programmatic-copy-to-clipboard-duckduckgo-android/96955551ec39f5fa3904edb052a0e688-aef10b1585.jpeg"
tags:
  - "javascript"
  - "web-development"
  - "duckduckgo"
  - "clipboard"
draft: false
hashnodeId: "clchrqwxw000h08jubj8rbaz4"
---

## The background

This is going to be a short article. Recently I launched an in-browser daily puzzle game ([GoldRoad](https://goldroad.web.app)). Later on, I added the ability to share your stats for the day on social media using the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API). This is how it looks on my Android phone

|  |  |
| --- | --- |

But sharing menu may not be available everywhere, considering this is a web app which can be opened on laptops as well. So I also added a fallback to copy the stats to the device's clipboard, feeling proud & clever at the same time having thought of fallbacks and all.

::media-embed
---
url: https://media.giphy.com/media/K3vVkohWnJVO8rZ5Su/giphy.gif
---
:: 

And then one of my friends who plays the game religiously informs me that this share button doesn't do anything for him. Knowing him, I asked which browser are you using, and he says DuckDuckGo on Android. And believe me, all my smugness is gone now :-)

## The original code

```javascript
const shareStats = async () => {
  const text = 'The text to share';

  if (window.navigator.share) {
    try {
      await window.navigator.share({
        text,
      });
    } catch (error) {}
  } else {
    await window.navigator.clipboard.writeText(text);
  }
};
```

I had used the \`writeText\` method of the Clipboard API thinking it has wide availability (as can be seen [here](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) and in the below image) so it should work in almost any browser, and also because "The `"clipboard-write"` permission of the [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) is granted automatically to pages when they are in the active tab". There was [one more caveat](https://web.dev/async-clipboard/#:~:text=the%20Clipboard%20API%20is%20only%20supported%20for%20pages%20served%20over%20HTTPS) I found, "the Clipboard API is only supported for pages served over HTTPS" (which is true anyway in my case).

![clipboard api support on major browsers](/images/posts/programmatic-copy-to-clipboard-duckduckgo-android/c3ab6836-ba2d-4eb6-8b4b-d407befc18c0-249c314cf7.png)

![writeText support on major browsers](/images/posts/programmatic-copy-to-clipboard-duckduckgo-android/8ac8f490-a99b-495f-a947-e3e98cb94188-da5cbeffcb.png)

## The issues with DuckDuckGo (DDG)

After doing some debugging my investigations revealed the following

1. `Navigator.share` is not available on DDG
    
2. `Navigator.clipboard.writeText` throws `NotAllowedError` with a message saying `Write permission denied`
    
3. Since write permission was denied, so maybe somehow we could query and ask for the needed permission using the [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)? Alas! `Navigator.permissions` is not available on DDG
    
4. Tried adding the clipboardWrite permission to the [`manifest.json`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions) file (though that is applicable for a web extension only), of course, it didn't work
    

## Workaround with `execCommand`

Since all my trials with valid methods failed to yield results, I had to fall back to the [document.execCommand](https://web.dev/async-clipboard/#:~:text=be%20triggered%20using-,document.execCommand(%27copy%27),-and%20document.execCommand). As shown in the linked article, you could use the below code to copy text to the device clipboard.

```javascript
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  input.style.display = 'none';
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Failed to copy text.');
  }
  input.remove();
});
```

But there is a twist here as well, if you set the `input` element's `display` to `none` as shown above, then execCommand returns true but doesn't copy anything to the clipboard in the case of DDG (haven't tried it with other browsers, as for everyone else Clipboard API is working fine, at least for the latest versions where I tested)

## Final Code

So without further ado, here is my final code which is working fine on DDG (sometimes I do see the phone's keyboard popping up for a split second, but that is fine I think).

```javascript
const shareStats = async () => {
  const text = `The text to share\nWith multiple lines`;

  if (window.navigator.share) {
    try {
      await window.navigator.share({
        text,
      });
    } catch (error) {}

    return;
  }

  await copyToClipboard(text);
};

const copyToClipboard = async (text) => {
  if (window.navigator.clipboard) {
    try {
      await window.navigator.clipboard.writeText(text);
      return;
    } catch (error) {}
  }

  const textarea = document.createElement('textarea');
  textarea.style.position = 'fixed';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.padding = 0;
  textarea.style.border = 'none';
  textarea.style.outline = 'none';
  textarea.style.boxShadow = 'none';
  textarea.style.background = 'transparent';

  document.body.appendChild(textarea);
  
  textarea.textContent = text;
  textarea.focus();
  textarea.select();

  const result = document.execCommand('copy');
  textarea.remove();
  if (!result) {
    // Show some error message to the user
  } else {
    // Show a success message to the user mentioning the text is copied to their clipboard
  }
};
```

The only thing to note above is the use of a `textarea` instead of an `input`, because if our text is multiline then the `input` will eat away all our newlines. Also, since we're not hiding the `textarea`, we are adding some styles to make it inconsequential.

## Conclusion

`execCommand` seems to be working at this point, but it has been made obsolete and may go away in future versions of all browsers. Just to be on the safer side, it is **better to surround the execCommand call with a try-catch block**. Hopefully in the future DDG will allow us to copy text using the Clipboard API itself.

Do let me know in the comments section if you spot an error, or if the explanation is wrong anywhere.

Thanks for reading :-)
