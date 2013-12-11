<?php 
			 
			 $wallmeta = get_post_meta($post->ID, 'iter', true); //retrieve the iter (serialized)
			 echo "<table id='brickdata' class='table'>";
			 
			 foreach (unserialize($wallmeta) as $sort){//unserialize it and walk through the array one level down
			 
			 	//echo "<tr><td id='sort' colspan='4'>".$sort[sortData]."</td></tr>";
			 	
			 }
			 
			 foreach (unserialize($wallmeta) as $w){//unserialize it and walk through the array one level down
				
				if ($w[type] == "flickr"){
					
					echo "<tr>";
				
					echo "<td id='index'>".$w[index]."</td>";
					echo "<td id='type'>".$w[type]."</td>";
					echo "<td id='topic'>".$w[topic]."</td>";
					echo "<td id='mediumurl'>".$w[mediumurl]."</td>";
					echo "<td id='bigurl'>".$w[bigurl]."</td>";
					echo "<td id=''></td>";
					echo "<td id=''></td>";
					echo "<td id=''></td>";
					
		   			echo "</tr>";
				}
				else if ($w[type] == "youtube"){
					
					echo "<tr>";
				
					echo "<td id='index'>".$w[index]."</td>";
					echo "<td id='type'>".$w[type]."</td>";
					echo "<td id='title'>".$w[title]."</td>";
					echo "<td id='videoid'>".$w[videoid]."</td>";
					echo "<td id='query'>".$w[query]."</td>";
					echo "<td id=''></td>";
					echo "<td id=''></td>";
					
		   			echo "</tr>";
				}
				else if ($w[type] == "gmaps"){
					
					echo "<tr>";
				
					echo "<td id='index'>".$w[index]."</td>";
					echo "<td id='type'>".$w[type]."</td>";
					echo "<td id='z'>".$w[z]."</td>";
					echo "<td id='y'>".$w[y]."</td>";
					echo "<td id='maptype'>".$w[maptype]."</td>";
					echo "<td id='zoom'>".$w[zoom]."</td>";
					echo "<td id='heading'>".$w[heading]."</td>";
					echo "<td id='pitch'>".$w[pitch]."</td>";
					
		   			echo "</tr>";
				}
				else {
					
					echo "<tr>";
				
					echo "<td id='index'>".$w[index]."</td>";
					echo "<td id='type'>".$w[type]."</td>";
					echo "<td id='topic'>".$w[topic]."</td>";
					echo "<td id='lang'>".$w[lang]."</td>";
					echo "<td id='pictures'>".$w[pics]."</td>";
					echo "<td id=''></td>";
					echo "<td id=''></td>";
					echo "<td id=''></td>";
					
		   			echo "</tr>";
					
				}
			}
		    echo "</table>";
?>