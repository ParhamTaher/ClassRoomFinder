# Demo Video Script:

## Introduction (40-45s):

We've all been in situations where we had difficulty finding spaces for personal or group work and, as of right now, our university doesn't offer a comprehensive and centralized solution to address this problem. Currently, we can reserve special study rooms in advance in buildings like Robarts and Bahen, individually look up lecture timings for each room, or check rooms one-by-one to find an available one.

Our app steps in to provide University of Toronto students and faculty with a quick and easy way to find free spaces (lecture halls, classrooms, etc.) that they can use to study, play, work, or find others who are doing similar activities.

In the last video, we explored a few user stories and the basic functionality of our application through our mockups. In this video, we'll be exploring the same features through our actual application instead while highlighting how we plan to improve and extend each feature's functionality in the future.

## Demonstration (~90s):

### Tabs:

On the homepage, you'll start off on the 'nearby' tab where you'll be able to see nearby buildings. Whenever you switch to another tab, the building list and map will load with the new information.

### Building List:

Currently, the building list displays each building's name and address. You can click on a building's card to reveal a panel with more options, allowing to browse available rooms, labs, and lecture halls. In the future, we plan to show each building's distance from the user on its respective card in the list as well as improve animations when transitioning between pages.

### Map:

Beside the list, you'll see a map generated with the help of Google's Map API which, at this moment, is only used as a visual aid. Each building in the list has a corresponding marker on the map displaying its location. Hovering over a marker will display the name of the building. In the future, we hope to greatly improve the map's functionality with several features. First, we'd like to allow users to bring up the 'more options' panel seen in the list by selecting a marker on the map instead. Additionally, after selecting a marker, we'd like to display a path to the building as well as its distance. Lastly, if possible, we'd like to scrap the generic theme on each marker and restyle them so that they display building codes instead (e.g. showing BA for Bahen or MP for McLennan Physical Labs).

### Rooms:

Now, let's pick a building and browse available rooms. Here, you'll see a list of rooms categorized and ordered by their availability. You can select a room to see when its official bookings, such as lectures and tutorials, as well as user bookings. Each room also provides a public comments section allowing users to share updates regarding each room or the building in general.

## Conclusion (~43s):

In order to reach the point where we can finally declare our application a minimum-viable-product, there's still a few features left to implement. As discussed previously, we plan to improve our map's usefulness and functionality by allowing users to select a building directly from the map, providing directions to each building, and creating intuitive map markers using building codes. Although we're currently providing data ourselves, we've started integrating Cobalt's API with our app, allowing us to get real information about buildings, rooms, labs, and lecture/tutorial timings. Regarding rooms, we need to write the front-end code for booking rooms and improve the look-and-feel of the rooms UI as well. Lastly, we need to continue and complete our integration of our front-end and back-end code.

Thanks for watching. We hope you enjoyed the demo.
