$(document).ready(function(){

	var uri = "http://825a10d2.ngrok.io";

	function parseURLParams(url) {
	    var queryStart = url.indexOf("?") + 1,
	        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
	        query = url.slice(queryStart, queryEnd - 1),
	        pairs = query.replace(/\+/g, " ").split("&"),
	        parms = {}, i, n, v, nv;

	    if (query === url || query === "") return;

	    for (i = 0; i < pairs.length; i++) {
	        nv = pairs[i].split("=", 2);
	        n = decodeURIComponent(nv[0]);
	        v = decodeURIComponent(nv[1]);

	        if (!parms.hasOwnProperty(n)) parms[n] = [];
	        parms[n].push(nv.length === 2 ? v : null);
	    }
	    return parms;
	}


	var urlString = window.location.href;
    urlParams = parseURLParams(urlString);
    console.log(urlParams.email[0])


    var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": uri+"/getData",
	  "method": "POST",
	  "headers": {
	    "content-type": "application/json"
	  },
	  "processData": false,
	  "data": "{\n\t\"email\":\""+urlParams.email[0]+"\"\n}"
	}

	Materialize.toast("Searching Database!", 6000, 'rounded')

	$.ajax(settings).done(function (response) {
		var res = JSON.parse(response)

		if(res.flag==1){
			console.log(res)

			function toTitleCase(str)
			{
			    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			}



			var basicInfo = '<div class="col s12 l3"><div class="col s12"> <div class="card"> <div class="card-image"> <img src="'+res.profilePic+'"> <span class="card-title">'+toTitleCase(res.name)+'</span> <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a> </div> <div class="card-content black-text"> <p><i class="material-icons circle pp">face</i>'+toTitleCase(res.name)+'<br> <i class="material-icons circle pp">work</i> '+toTitleCase(res.works)+'<br> <i class="material-icons circle pp">library_books</i>'+toTitleCase(res.studied)+', '+toTitleCase(res.studies)+'<br> <i class="material-icons circle pp">perm_contact_calendar</i> '+toTitleCase(res.birthday)+'<br> <i class="material-icons circle pp">email</i> '+res.email+'<br> <i class="material-icons circle pp">local_phone</i> '+res.number+'<br> <i class="material-icons circle pp">toys</i>'+toTitleCase(res.lives)+'</p> </div> </div> </div><div class="col s12"> <div class="card-panel" id="map" style="height: 250px"> </div> </div><div class="col s12"> <div class="card-panel"><canvas id="myChart2" width="200" height="200"></canvas> </div> </div></div>'

			document.getElementById('renderData').innerHTML += basicInfo;

			var link ='';
			if(res.linkedin_url.length>0)
			{
				link = res.linkedin_url[0]
			} 

			var tweet ='';
			if(res.twitterId.length>0)
			{
				tweet = res.twitterId[0]
			} 

			var totalLikes;
			if(res.interest.likes_all.length>0)
			{
				totalLikes = res.interest.likes_all.length
			}

			var about = '<div class="col s12 m7 l3"><div class="col s12"> <div class="card-panel"> <div class="card-title black-text">INSIGHTS</div> <hr> <span class="black-text"> <p><i class="material-icons circle pp">directions_car</i> Auto Enthusiast - '+ (res.count_auto*100)/totalLikes+'%<br> <i class="material-icons circle pp">shopping_cart</i> E-Commerce - '+ (res.count_shop*100)/totalLikes+'%<br> <i class="material-icons circle pp">person_outline</i> Politicaly Active - '+ (res.count_politics*100)/totalLikes+'%<br> <i class="material-icons circle pp">card_travel</i> Travelling Enthusiast - '+ (res.count_travel*100)/totalLikes+'%<br> <i class="material-icons circle pp">camera</i> Klout ID - '+res.kloutId+'<br> <i class="material-icons circle pp">location_city</i> City - '+res.city_tier+'<br> </p> </span> <div class="card-action"> <a href="'+res.fb_url+'" class="btn-floating btn-large waves-effect waves-light blue darken-2">FB</a> <a href="'+link+'" class="btn-floating btn-large waves-effect waves-light blue ">IN</a> <a href="https://twitter.com/'+tweet+'" class="btn-floating btn-large waves-effect waves-light blue lighten-3">Tw</a> </div> </div> </div><div class="col s12"><div class="card-panel"><canvas id="myChart" width="200" height="200"></canvas></div><div class="col s12"> <div class="card-panel transparent" style="height: 250px;padding-top: 0px;padding-left: 0px;padding-bottom: 0px;padding-right: 0px;" id="work"> </div> </div></div></div>'

			document.getElementById('renderData').innerHTML += about;
			

			var friends = '<div class="col l3 m7 s12"> <div class="col s12"> <div class="card-panel"> <div class="card-title black-text">TOP LIKES</div> <hr> <span class="black-text" id="likings"></span> </div> </div> <div class="col s12"> <div class="card-panel"> <div class="card-title black-text">TOP FRIENDS</div> <hr> <span class="black-text" id="topFriends"></span> </div> </div><div class="col s12"> <div class="card-panel"> <div class="card-title black-text">KNOWS ABOUT</div> <hr> <span class="black-text" id="knows"> </span> </div> </div></div>'

			document.getElementById('renderData').innerHTML += friends;

			var minFlist = res.friends.length>5?5:res.friends.length;
			var minInterest = res.interest.likes_all.length>5?5:res.interest.likes_all.length;
			var knows = res.topics.length>5?5:res.topics.length;

			for(i=0;i<minInterest;i++)
			{
				document.getElementById('likings').innerHTML += '<div class="chip transparent black-text"> <img src="css/star.png" alt="Contact Person"> '+ toTitleCase(res.interest.likes_all[i])+' </div><br>';
			}

			for(i=0;i<minFlist;i++)
			{
				document.getElementById('topFriends').innerHTML += '<div class="chip transparent black-text"> <img src="css/user.png" alt="Contact Person"> '+ toTitleCase(res.friends[i])+' </div><br>';
			}

			for(i=0;i<knows;i++)
			{
				document.getElementById('knows').innerHTML += '<div class="chip transparent black-text"> <img src="css/bulb.png" alt="Contact Person"> '+ toTitleCase(res.topics[i])+' </div><br>';
			}


			document.getElementById('renderData').innerHTML+='<div class="col l3 m6 s12"> <div class="card-panel"> <canvas id="horizontal" width="200" height="600"></canvas> </div> </div>';

			var ctx = document.getElementById("myChart");
			var ctx1 = document.getElementById("horizontal");
			
			var dat =10;
			if(res.score>0)
			{
				dat = res.score;
			}

			data = {
			    datasets: [{
			        data: [dat, 100-dat],
			        backgroundColor: [
		                'rgba(255, 99, 132, 0.8)',
		                'rgba(54, 162, 235, 0.8)'
		            ]
			    }],

			    
			    
			    labels: [
			        'Socially Active',
			        'Un-Active'
			    ]
			};


			var myDoughnutChart = new Chart(ctx, {
			    type: 'doughnut',
			    data: data
			});


			hori_data = {
			    datasets: [{
			    	label:'Movie Categories',
			        data: [res.genre.Romance,res.genre.Drama,res.genre.Music,res.genre.Horror,res.genre.Adventure,res.genre.Action,res.genre.Crime,res.genre.Documentry,res.genre.Comedy,res.genre.Thriller,res.genre.Musical,res.genre.Short,res.genre.Sport,res.genre.Animation,res.genre.Family],
			       backgroundColor: [
	                'rgba(255, 99, 132, 0.6)',
	                'rgba(54, 162, 235, 0.6)',
	                'rgba(255, 206, 86, 0.6)',
	                'rgba(75, 192, 192, 0.6)',
	                'rgba(153, 102, 255, 0.6)',
	                'rgba(255, 159, 64, 0.6)',
	                'rgba(0, 159, 64, 0.6)',
	                'rgba(255, 0, 86, 0.6)',
	                'rgba(0, 99, 0, 0.6)',
	                'rgba(54, 162, 235, 0.6)',
	                'rgba(55, 20, 86, 0.6)',
	                'rgba(7, 192, 19, 0.6)',
	                'rgba(253, 12, 255, 0.6)',
	                'rgba(130, 195, 86, 0.6)',
	                'rgba(76, 192, 143, 0.6)'
	            ]
			    }],	    
			    labels: [
			        'Romance',
			        'Drama',
			        'Music',
			        'Horror',
			        'Adventure',
			        'Action',
			        'Crime',
			        'Documentry',
			        'Comedy',
			        'Thriller',
			        'Musical',
			        'Short',
			        'Sport',
			        'Animation',
			        'Family'
			    ]
			};

			var myBarChart = new Chart(ctx1, {
			    type: 'horizontalBar',
			    data: hori_data
			});
		}
		else
		{
			Materialize.toast("Data Not Found!", 6000, 'rounded')
		}

		if(res.works!='Not Public')
		{

			var setti = {
			  "async": true,
			  "crossDomain": true,
			  "url": uri+"/glassDoor",
			  "method": "POST",
			  "headers": {
			    "content-type": "application/json"
			  },
			  "processData": false,
			  "data": "{\n\t\"company\":\""+res.works+"\"\n}"
			}

			$.ajax(setti).done(function (resp) {
			  console.log(resp);
			  resp = JSON.parse(resp)
			  if(resp.response.employers.length>0){

			  	var job = '<div class="col s12" style="padding-left: 0px;padding-right: 0px;"> <div class="card sticky-action"> <div class="card-image waves-effect waves-block waves-light"> <div class="col s12"> <img class="activator" src="'+resp.response.employers[0].squareLogo+'"> </div></div> <div class="card-content"> <span class="card-title activator grey-text text-darken-4">'+resp.response.employers[0].name+'<i class="material-icons right">more_vert</i></span> <p><a href="'+resp.response.employers[0].website+'">Company Website</a></p> </div> <div class="card-reveal"> <span class="card-title grey-text text-darken-4">Employment<hr><i class="material-icons right">close</i></span> <p id="companyDetails"></p> </div> </div> </div>'

			  document.getElementById('work').innerHTML = job;

			  document.getElementById('companyDetails').innerHTML += "<strong>Industry : </strong>"+resp.response.employers[0].industry+"<br>";
			  document.getElementById('companyDetails').innerHTML += "<strong>Rating : </strong>"+resp.response.employers[0].overallRating+"<br>";	
			  document.getElementById('companyDetails').innerHTML += "<strong>Description : </strong>"+resp.response.employers[0].ratingDescription+"<br>";	
			  document.getElementById('companyDetails').innerHTML += "<strong>Headline : </strong>"+resp.response.employers[0].featuredReview.headline+"<hr>";	

			  document.getElementById('companyDetails').innerHTML += "<strong>PROS : </strong>"+resp.response.employers[0].featuredReview.pros+"<hr>";	

			  var ctx4 = document.getElementById("myChart2");

			  data = {
			    datasets: [{
			        data: [resp.response.employers[0].cultureAndValuesRating, resp.response.employers[0].seniorLeadershipRating,resp.response.employers[0].compensationAndBenefitsRating,resp.response.employers[0].workLifeBalanceRating],
			        backgroundColor: [
		                'rgba(255, 99, 132, 0.8)',
		                'rgba(54, 162, 235, 0.8)',
		                'rgba(0, 255, 132, 0.8)',
		                'rgba(154, 62, 23, 0.8)'
		            ]
			    }],

			    
			    
			    labels: [
			        'Cultural Values',
			        'Leadership',
			        'Compensation',
			        'Work Life Balance'
			    ]
			};


			var myDoughnutChart = new Chart(ctx4, {
			    type: 'doughnut',
			    data: data
			});




			  }
			});
		}

	})
	.fail(function(){
		Materialize.toast("Failed to Fetch!", 6000, 'rounded')
	});

})