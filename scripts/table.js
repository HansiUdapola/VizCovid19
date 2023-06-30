function createTable() {

	d3.select(".table").append("h4").text("Situation by Region, Country, Territory & Area").style("color","white").attr("class","display-6");

	d3.csv("data/table.csv", function (error, data) {
		if (error) throw error;	

		var sortAscending = true;
		var table = d3.select('.table').append('table').attr("class", "table table-dark table-striped table-bordered");
		var titles = d3.keys(data[0]);
		var headers = table.append('thead').append('tr').style("color","#0dcaf0")
			.selectAll('th')
			.data(titles).enter()
			.append('th')
			.text(function (d) {
				return d + "⮁";
			})
			.on('click', function (d) {
				//headers.attr('class', 'header');

				if(d == "Country"){

					if (sortAscending) {
						rows.sort(function(a, b) {return d3.ascending(b[d], a[d]);  });
						sortAscending = false;
						this.className = 'aes';
						} 
					else {
						rows.sort(function(a, b) { return d3.descending(b[d], a[d]); });
						sortAscending = true;
						this.className = 'des';
						}

				}
				else{
					if (sortAscending) {
						rows.sort(function(a, b) {return d3.ascending(Number(b[d]), Number(a[d]));  });
						sortAscending = false;
						this.className = 'aes';
						} 
					else {
						rows.sort(function(a, b) { return d3.descending(Number(b[d]), Number(a[d])); });
						sortAscending = true;
						this.className = 'des';
						}
				}


				

			});

		var rows = table.append('tbody')
			.selectAll('tr')
			.data(data).enter()
			.append('tr');

		rows.selectAll('td')
			.data(function (d) {
				return titles.map(function (k) {
					return { 'value': d[k], 'name': k };
				});
			}).enter()
			.append('td')
			.attr('data-th', function (d) {
				return d.name;
			})
			.text(function (d) {
				if(d.name == "% Relative to Max Cases"){
					return ""+d.value+"%";
				}
				if(d.name == "% Relative to Max Deaths"){
					return ""+d.value+"%";
				}
				else{
					return d.value;
				}			
			})
			.filter(function (d){
				if(d.name == "% Relative to Max Cases"){
					return d;
				}
				
			})
			.append("div").attr("class","progress")
			.append("div").attr("class","progress-bar bg-warning progress-bar-striped progress-bar-animated").attr("role","progressbar")
			.style("width",function (d){
				return ""+d.value+"%";
			}).attr("aria-valuenow","25").attr("aria-valuemin","0").attr("aria-valuemax","100");

			// Add Progress Bar to % Relative to Max Deaths

			rows.selectAll('td')
			.filter(function (d){
				if(d.name == "% Relative to Max Deaths"){
					return d;
				}
				
			})
			.append("div").attr("class","progress")
			.append("div").attr("class","progress-bar bg-danger progress-bar-striped progress-bar-animated").attr("role","progressbar")
			.style("width",function (d){
				return ""+d.value+"%";
			}).attr("aria-valuenow","25").attr("aria-valuemin","0").attr("aria-valuemax","100");
	});

	


}