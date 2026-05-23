---
title: "Debug or not, there is no middle ground"
description: "Introduction"
date: "2023-03-11T23:17:34.003Z"
slug: "debug-or-not-there-is-no-middle-ground"
cover: "/images/posts/debug-or-not-there-is-no-middle-ground/f6e1c8d5-4d27-4223-945f-102475efcf07-507db8e76a.jpeg"
tags:
  - "software-development"
  - "2articles1week"
  - "debuggingfeb"
draft: false
hashnodeId: "clf4l77hv000109jq8dm86o4n"
---

## Introduction

"What is debugging?" is a typical question to start an article on the topic, but this is not that article. Instead what I want you to do here is, take a look at the cover image, and process it. Now, try to answer, why the person in the image is doing whatever he is doing. There can be multiple correct answers to this question, but if you answered along the lines of "to keep the crops healthy for a better yield" then you're not far from the zen of software development.

Debugging is not a chore, even though it feels like one at times, but is an important pillar on which any healthy and yielding software is built. You cannot love programming and not love (okay, "love" may be a strong word here, any value on the positive axis should do) debugging at the same time. This is akin to "Heisenberg's Certainty Principle" (is there one?) for Software development. The sooner you start loving the debugging process, the closer you're to achieving zen.

## Why, and what, to debug?

Before we get to the "how", we need to understand the "why", and the "what". I'm sure by now you've some inklings on why we need to debug. Because we want our software to be healthy and useful for the end user. And we achieve that by making it error-free while giving the best experience.

The "what" is the next step of the "why". Whatever hinders our ability to give the best experience to the end user needs to be debugged and corrected. Some of these hindrances can be because of faulty code, some because of the UI/UX, some others may be because of the network, and so on.

The "what" may have left you confused. There is no clear answer in the previous paragraph. And you're right because it depends on the situation you're in. In my previous life, I used to work on Video Telephony (think Zoom calls for phones, but long back and with different standards and protocols). Now there was a phone already in the market which used to work fine with other similar phones. Then there was this phone in the testing phase which we were working on. And when you make a video call between these two, no video used to come on either of the devices. Of course, the video call between the two of our devices was fine as well. Now, whose fault is it? The only truth here is that the call should work, and we should debug every entity in between and including the two devices but starting with ours.

## How to debug?

There are many techniques and approaches to debugging. What you need to understand is that the what, and the how, go hand in hand. Depending on the issue you're facing, one way of debugging might be better suited for the job at hand. And sometimes you may need to apply more than one technique to find out the root cause. I'm not going to go into the definitions and detailed explanations of these techniques, you can read about them with a simple Google Search (or maybe ask ChatGPT?).

The starting point of debugging is not using a debugger or adding some debug messages. Rather it is having at least a basic understanding of how something works. If you have that understanding, you can use any appropriate technique to debug. Let's go back to the video call example. On a high level, the way it works is:

1. The calling device sends signals/messages to the server that it wants to do a video call with the other device
    
2. The server informs the other device about the incoming call
    
3. The two devices do further signalling to arrive at a common medium of communication (the audio & the video codecs)
    
4. Finally, the media flows between the devices (with or without the server in the loop)
    

Now we can start eliminating the suspects based on the information we've at hand. Since the call gets established we can rule out the signalling issues. Next, we check whether the other device's transmitted video packets reach our device and whether our video packets leave the device or not. After verifying all these using network packet sniffers, the conclusion was that there is something wrong with the video packets themselves.

So after talking to my senior, I dumped these incoming/outgoing packets into separate files (like the debug messages), and tried playing these with a video player. Finally, the issue was traced to the other device not sending (and expecting) initial video config header bytes (if I remember correctly, mere 12-16 bytes). And this I could figure out only because I had the required knowledge of the config header standard. The final fix was us adding a check; if the call is with that device, don't send or expect the config bytes and hardcode it. Even though we were doing everything correctly we had to add the fix, because the other device was already live in the market and could not be changed.

So the point I'm trying to make here is that unless you have the needed knowledge it can be very challenging to fix an issue. That doesn't mean that you cannot gain this knowledge in parallel while fixing the issue, in most cases that is how you do it. So try to gain knowledge about how exactly your software works. This may require you to venture beyond your assigned work, but that is how you improve.

Also, many times it is beneficial to discuss the issue with your peers and seniors, as they may provide a clue based on their experiences. And the other point is, sometimes you need to add the fix at your end even if everything is correct there :-). So don't resent it.

## What to take home from debugging?

The first thing you should do after any debugging session is, reflect on it. Think about why the issue happened, and how it was fixed. Now that you have that extra knowledge what you could have done better if you had this knowledge before the issue? In my case, I could have checked for the config header bytes in the packet sniffer logs instead of dumping them into files and then finding out.

The second thing is, actually apply whatever you learnt in your previous experiences. Later on, with a different device and codec a similar issue occurred where the initial video was blurry. From the packets' analysis itself, I could figure out that the issue was with the config header.

Every debugging session should make you a smarter and better developer.

## Don't rule out anything

During one of my recent debugging sessions, I relearned the fact that one should not rule out anything while fixing an issue.

### The recent issue

The issue was the "copy to clipboard" not working on the DuckDuckGo Android browser. The issue was reported by one of the players of my puzzle game [GoldRoad](https://playgoldroad.com). I use the Web Share API for sharing the user's daily stats, and as a fallback for sharing Clipboard API is used for copying the result to the clipboard.

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

If you look at the compatibility chart for the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) you'll see that it has wide availability.

![Clipboard compatibility](/images/posts/debug-or-not-there-is-no-middle-ground/a54fbf29-f60c-4958-8aac-10f3d7bbf348-a2904b7ac0.png)

Also, the `"clipboard-write"` permission of the [**Permissions API**](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) is granted automatically to pages when they are in the active tab. So that should allow me to use the `writeText` method of the Clipboard API on any browser.

![writeText compatibility](/images/posts/debug-or-not-there-is-no-middle-ground/28396ea9-008b-4f7f-93a7-d8f0902754cc-de47cd825d.png)

But it didn't work despite such reassurances. Now how do you debug the issue considering it needs to be done on Android (the DuckDuckGo Mac client works fine)? Since console logs were of no use, I used the normal p / div tags to print the debugging messages in the browser window itself.

The debugging revealed the following

1. `"Navigator.clipboard.writeText"` throws `NotAllowedError` with a message saying `Write permission denied`
    
2. Since write permission was denied, so maybe somehow we could query and ask for the needed permission using the [**Permissions API**](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)? Alas! `"Navigator.permissions"` is not available on DuckDuckGo
    

### The Fix

The workaround was to use the `document.execCommand`. After some searching on Google, [found this link](https://web.dev/async-clipboard/#:~:text=be%20triggered%20using-,document.execCommand(%27copy%27),-and%20document.execCommand) with a code snippet

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

But this also didn't work in my case. Further trials and errors showed that we can't do `input.style.display = 'none';` Because if the element is not visible then it won't work for DuckDuckGo. So the final working code is as below

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

Learnings?

1. Don't rule out anything, even if everything says that it will work
    
2. Code copied from the internet may not work in its entirety and all situations
    

## Conclusion

To summarize, debugging plays a crucial role in software development and requires a good grasp of the software's know-how. There are diverse methods and strategies for debugging, and we must remain open-minded while resolving any issue. Each debugging session presents an opportunity for us to enhance our skills and knowledge, so we should welcome it with open arms.

If you liked reading the article, do drop a 👋 in the comments section.

Keep adding the bits, only they make a BYTE. :-)
