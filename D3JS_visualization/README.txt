READ ME

CD into D3JS_visualization directory

XML file name is called "Collections.xml"

First compile Collection_parser.js, by typing "node Collection_parser.js" in the
terminal.

After compiling and running the above file, a new json file called "energy_testing.json"
will be created in a folder called "D3JS_visualization", which is on the desktop.

Then cd into the D3JS_visualization directory, and type "node app.js", this will 
allow you to visit "localhost:8888/sankey.html?energy_testing.json" to view a sankey diagram
of the xml file.

Change height value in "sankey.html" to make nodes bigger