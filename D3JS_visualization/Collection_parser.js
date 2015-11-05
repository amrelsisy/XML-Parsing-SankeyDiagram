var fs = require("fs");
var filename = "Collections.xml";
var destination_path = 'energy_testing.json';
var xmlreader = require('xmlreader');
var data;
var element_sources =[];
var count_sources = 0;
var names_array = [];
var name_array_size = 0;

fs.readFile(filename, 'utf-8', function(err, data)
{
	xmlreader.read(data, function(err, res){
		names_array = get_all_elements(res); 
		//console.log(names_array);
		names_array_size = names_array.length;
		for(var i = 0; i < names_array_size; i++) //testing array contents
		{	
			element_sources[i] = [];
			var splitter = names_array[i].split('.');
			names_array[i] = splitter[1];//store the sources names
			
			if(res['XHQ:SolutionConfig']['XHQ:Collection'].at(i).attributes().connectionGroup == "XHQCacheGroup")
			{
				for(var j = 0; j < res['XHQ:SolutionConfig']['XHQ:Collection'].at(i)['XHQ:ConnectProp'].count(); j++)
				{
					count_sources = 0;
					if(res['XHQ:SolutionConfig']['XHQ:Collection'].at(i)['XHQ:ConnectProp'].at(j).attributes().name == "SQL_STATEMENT")
					{
						var dependencies = res['XHQ:SolutionConfig']['XHQ:Collection'].at(i)['XHQ:ConnectProp'].at(j).attributes().value;
						var find_sources = [];
						find_sources = dependencies.split('');
						var consume = false;
						var temp = "";
						
						for(var k = 0; k < find_sources.length; k++)
						{
							
							if(find_sources[k] == '{')
							{
								consume = true;
								k++;
							}
							if(find_sources[k] == '}')
							{
								consume = false;
								var store = true;
								for(var p = 0; p < count_sources; p++)
								{
									if(element_sources[i][p] == temp)
										store = false;
								}
								if(store)
									element_sources[i][count_sources++] = temp;
								
								temp = "";
							}
							if(consume == true && find_sources[k] != ' ')
							{
								temp = temp + find_sources[k];
							}
						}
					}
				}
				
			}
			
		}
		var source_numbers = [];
		for(var i = 0; i < names_array_size; i++)
		{
			source_numbers[i] = [];
			//console.log(i);
			//console.log(names_array[i]);
			if(element_sources[i][0] != undefined)
			{
				var q = 0;
				for(var j = 0; j < element_sources[i].length; j++)
				{
					var matched = false;
					var first_lower = "";
					var second_lower = "";
					//console.log(element_sources[i][j]);
					for(var k = 0; k < names_array.length; k++)
					{
						first_lower = names_array[k].toLowerCase().trim();
						second_lower = element_sources[i][j].toLowerCase().trim();
						if(first_lower == second_lower)
						{
							matched = true;
							//console.log(k);
							source_numbers[i][q++] = k;
						}
					}
					if(matched == false)
					{
						names_array[names_array.length] = second_lower + '?';
						source_numbers[i][q++] = names_array.length-1;
					}
				}
			}
			else
			{
				source_numbers[i][0] = 0;
			}
			
			//console.log("");
		}
		
		names_array_size = names_array.length;
		var json={};
		json.nodes = getNodes(names_array, names_array.length);
		json.links = getLinks(source_numbers);
		fs.writeFile(destination_path, JSON.stringify(json), 'utf-8');
		//console.log(json);
	});
});
function getNodes(nodes_array, size)
{
	var nodes = [];
	for(var i = 0; i < size; i++)
	{
		var source_name = {};
		source_name.name = nodes_array[i];
		nodes.push(source_name);
	}
	return nodes;
}

function getLinks(source_numbers)
{
	var links = [];
	//console.log(source_numbers);
	for(var j = 0; j < source_numbers.length; j++)
	{
		var new_source = false;
		for(var k = 0; k < source_numbers[j].length; k++)
		{
			if(source_numbers[j][k] != 0)
			{
				var link = {};
				link.source = source_numbers[j][k];
				link.target = j;
				link.value = 80;
				links.push(link);
			}
			
		}
	}
	
	return links;
}

function get_all_elements(res)
{
	var name_array = [];
	var colls = res['XHQ:SolutionConfig']['XHQ:Collection'];
	for(var i = 0; i < colls.count(); i++)
	{
		name_array[i] = res['XHQ:SolutionConfig']['XHQ:Collection'].at(i).attributes()['xhqPath'];
	}
	
	return name_array;	
}


