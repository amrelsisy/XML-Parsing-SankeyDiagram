var fs = require("fs");
var filename = "family.xml";
var parser = require('xml2json');
var json = "";
fs.readFile(filename, 'utf-8', function(err, data)
{
	if(err)
	{
		console.log("file is invalid");
	}
	else
	{
		json = parser.toJson(data); //returns a string containing the JSON structure by default 
		//console.log(json);

		fs.writeFile("data_json", json, function(err)
		{
			if(err)
			{
				console.log("error when writing to file");
			}
				
		}); 
	}
});

