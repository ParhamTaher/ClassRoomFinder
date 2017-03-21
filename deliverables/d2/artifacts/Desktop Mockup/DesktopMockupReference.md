## 1. Home screen - Nearby Tab

Features:
	Shows a list of buildings close to the user's location, in addition to 
	a map centered at this location. The map will highlight U of T buildings
	that are in the database, which can be clicked to navigate to that 
	building's page.

	
## 2. Home screen - Favorites Tab

Features:
	Changing tabs affects the list that is populated on the left hand side
	of the web app. Favorites would show buildings that you have been to
	frequently, check frequently, or add manually.
	
## 3. Home screen - All Buildings Tab

Features: 
	Lists all buildings alphabetically, with an added search bar. Can search
	by building name or building code.
	
## 4. Building home page (Bahen Centre in this example)

Features:
	Clicking on a building will open up a view on the right hand side of
	the web app, which displays:
		- building name
		- picture of building
		- types of usable rooms in building
			- number of that type of room currently unoccopied 
			- a button to view all rooms of that type in building
		- recent activity
			- most recent official events taking place in building 
			- a button to view all events scheduled for that day
		- recent comments
			- most recent user comments posted to building home page
			- button to view all user comments posted to building home page

## 5. Comments section

Features:
	All buildings and all rooms associated with a building will have a 
	comment section. Anyone using DiscoverUofT can post an anonymous
	comment to notify others in the area of a noteworthy event, or
	just chat with others in the area. A random temporary id will be
	assigned to each commenter when they comment, in the form of 
	Anonymous<random number>.
	
## 6. Rooms in building of type <...> (Computer labs in this example)

Features:
	Displays all rooms of a certain type in the currently selected building.
	Sorted under 3 tabs:
		- Available
		- Available in 1 hour or less
		- Occupied
	Clicking on a room will bring you to the home page for that room.
	
## 8. Room home page (BA3195 in this example)

Features:
	Displays information about the room.
	- Upcoming official booking
		- displays the next time this room will be taken by an official
		  event (lecture, tutorial, etc.)
		- if currently taken, this will show the next time the room will
		  be free
		- a button to view official schedule for that room
	- Upcoming user booking
		- displays the next unofficial user created event
	- Recent comments 
			- most recent user comments posted to room home page
			- button to view all user comments posted to room home page

## 7. Official schedule for room

Features:
	Displays the official schedule for room, such as lectures, tutorials,
	and U of T organized events.
	
## 9. User events (bookings) for room

Features:
	Users can organize unofficial meetups and gatherings to take place
	in the currently selected room. Each event consists of:
		- Time frame for when the event takes place
		- A partial description to display in the user bookings list
		- A button to view a more detailed description of what the 
		  event entails.
	As can be seen in the mockup, multiple events can take place at 
	the same time. These events are not official, and likely won't take
	up the whole room. 
	

###### Notes about user events:
	Since these are not official, or sanctioned by U of T administration,
	the scale of these events should not exceed that of a meetup for a 
	large group project. Rooms that have quiet policies will not have
	user events enabled.