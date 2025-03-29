# Web Development Project 4 - _Book Cover Explorer_

Submitted by: **Quynh Giang Ho**

This web app: **An application that allows you to explore book titles and covers across all genres. With information on the author, premise, and publisher, this is the tool to help you find your next book to read. Try it now!**

Time spent: **6** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Application features a button that creates a new API fetch request on click and displays at least three attributes and an image obtained from the returned JSON data**
  - The type of attribute displayed for each image should be consistent across API calls (i.e. if you are using a cat API, and display the color, breed, and age in response to an initial API call, subsequent button clicks should also result in the color, breed, and age being displayed)
- [x] **Only one item/data from API call response is viewable at a time and at least one image is displayed per API call**
  - A single result of an API call is displayed at a time
  - Displayed attributes should match the displayed image (i.e., if showing a picture of a Siamese cat and the attribute breed, the displayed breed should be 'Siamese' not 'Ragdoll' or another breed that doesn't match)
  - There is at least one image per API call
- [x] **API call response results should appear random to the user**
  - Clicking on the API call button should generate a seemingly random new result each time
  - Note: Repeat results are permitted but the API used should have a reasonably large amount of data and repeats should not be frequent
- [x] **Clicking on a displayed value for one attribute adds it to a displayed _ban_ list**
  - At least one attribute for each API result should be clickable
  - Clicking on a clickable attribute not on the ban list, should imnmediately add it to the ban list
  - Clicking on an attribute in the ban list should immediately remove it from the ban list
- [x] **Attributes on the ban list prevent further images/API results with that attribute from being displayed**
  - Clicking on the API call button should not result in any image/attributes with attribute values in the ban list being displayed (ex. Using a cat API, if the ban list includes the value 'Siberian' for the breed attribute, clicking on the Discover button should never result in a Siberian cat being displayed)
  - Note: More attribute values on the ban list may result in a higher frequency of repeat results
  - [x] _To ensure an accurate grade, your recording **must** show that when clicked, an attribute in the ban list is immediately removed from the list of banned attributes_

The following **optional** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list
- [x] Users can see a stored history of their previously displayed results from this session
- [x] A dedicated section of the application displays all the previous images/attributes seen before
- [x] Each time the API call button is clicked, the history updates with the newest API result

The following **additional** features are implemented:

- [x] Making the website fully responsive
- [x] Adding complex animations
- [x] Show/Hide history (viewed) list

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src="./src/assets/BookCoverExplore.gif" title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->

GIF created with [Chrome Capture - screenshot & GIF](https://chromewebstore.google.com/detail/chrome-capture-screenshot/ggaabchcecdbomdcnbahdfddfikjmphe)

<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

During the app's development, I encountered these very fun challenges:

- The banning attribute feature makes it a bit tricky to fetch satisfactory books that would overcome all restrictions. To do this, I set a maxAttempts value that would allow my program to re-request information from the API, and only output that no book was found after maxAttempts is achieved. This helped find satisfactory books much more often.
- Trying to find the right API to use (I have used 2 APIs before this one, and got seemingly blocked by both due to repeated requests. To fix the problem, I set a Timeout between each request, and reduce the number of re-request attempts).
- Integrating complex and fun animations (which I did not do too much in my past 3 submissions).

## License

    Copyright 2025 Quynh Giang Ho (Shepe1304)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
