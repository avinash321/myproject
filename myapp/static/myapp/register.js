$(document).ready(function() {
	var table;
	var myVariable;
	var myjsondata;
	loadTableData()	// This will load the 
	$("#myForm").submit(function(e){
		e.preventDefault();
		var name=$.trim($("#name").val());
		if(!name.length) {
			$("#span1").text("Please enter the Name");   
        	$("#name").focus();
			return false;
		} else {
			$("#span1").text("");  	
		}
		var dob=$.trim($("#dob").val());
		if(!dob.length) {
			$("#span2").text("Please enter the DOB");   
        	$("#dob").focus();
			return false;
		} else {
			$("#span2").text("");  	
		}
		var skills = $("input[name='skill']").serializeArray();
        if (!skills.length) {
			$("#span3").text("Please select the skills");  
			return false;
		} else {
			$("#span3").text("");
		}
		if ($('#hobbieselect').val() == "") {
			$("#span4").text("Please select the Hobbies");  
			return false;
		} else {
			$("#span4").text("");
		}	
		if(!$('input:radio[name=gender]').is(':checked')) {
			$("#span5").text("Please select the gender");  
			return false;
		} else {
			$("#span5").text("");
		}
		if($("#mybutton").val() == "Update") {
			editRow();
		} else {
			appendRow();
		}
		return true;

	});

	//Jquerry Quick handlers
	
	$("#myTable").on("click", '#delete', function(){
    	myDelete(this);
	});

	$("#myTable").on("click", '#edit', function(){
    	myUpdate(this);
	});
});



function loadTableData() {
    $.ajax({
        url : "api/tabledata/", // the endpoint
        type : "GET", // http method
        // handle a successful response
        success : function(json) {
        	myjsondata = json; 
        	dataLoad(json)
        },
        // handle a non-successful response
        error : function(xhr,errmsg,err) {
        	alert("Error occured");
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};

function dataLoad(dataArray) {
	//var serverData = $("#myjson").val();
	//var dataArray = JSON.parse(serverData);		// It will Convert the Json data to Object type of data
	loadCreateTable();
	for (var i in dataArray) {
  		jsonObj = dataArray[i];
  		dataObj = jsonObj;
  		// Reading Individual record from the database and appending it while page is loading
  		name = dataObj.name;
  		dob = dataObj.dob;
  		age = ageCaliculator(dob);
  		skills = dataObj.skills;
  		hobbies = dataObj.hobbies;
  		gender = dataObj.gender;
  		loadAppendRow(name,age,skills,hobbies,gender);
	}
}

function loadCreateTable() {
    var table = $("<table> </table>").attr({ id: "data" });
    table[0].border = "1";
    $("#myTable").append(table);    // This will append the row to the specified div
    var columnsHeader = ["Name", "Age", "Skills", "Hobbies", "gender", "Option1","Option2"];
    var columnsCount = columnsHeader.length;
    //Add the header row.
    var row = $(table[0].insertRow(-1));
/*    var row_index = $(this).parent('table').index(); 
    alert(row_index )*/
    for (var i = 0; i < columnsCount; i++) {
        var headerCell = $("<th> </th>");
        headerCell.html(columnsHeader[i]);
        row.append(headerCell);
    }
}
function loadAppendRow(name, dob,skills, hobbies, gender) {
	var update = $('<input/>').attr({ type: 'button', id: 'edit', 
		value: 'Edit'});
	var del = $('<input/>').attr({ type: 'button', id: 'delete', 
		value: 'Delete' });
	table = $("#data");
	columnsCount = 7;
	var mydata = [name, dob, skills, hobbies, gender,update, del];
        //Add the data rows.
    row = $(table[0].insertRow(-1));
    for (var j = 0; j < columnsCount; j++) {
        var cell = $("<td> </td>");
        cell.html(mydata[j]);
        row.append(cell);
    }
}

//It will take DOB as parameter and returns the Present AGE  (Age Caliculator)
function ageCaliculator(dob) {
	var presentDate= new Date();
	var presentYear = presentDate.getFullYear();
	var birthDate = new Date(dob);
	var age = presentYear - birthDate.getFullYear()
	return age;
}

function getSkills() {
	var mySkills = $('input:checkbox:checked').map(function() {
        return this.value;
	}).get();
	return mySkills;
}
function getHobbies() {
	var myHobbies = $('option:selected:selected').map(function() {
        return this.value;
	}).get();
	return myHobbies;
}

function getGender() {
	var myGender = $('input:radio:checked').map(function() {
        return this.value;
	}).get();
	return myGender;
}

function appendRow() {
    var name = $("#name").val();
    var dob = $("#dob").val();
	var age = ageCaliculator(dob);
    var skills =getSkills();
	var hobbies = getHobbies();
	var gender = getGender();
	var mytype = "addrow"

	var mydata_obj = {"name":name, "dob":dob, "skills":skills,"hobbies":hobbies, "gender":gender,"mytype":mytype};
	var myjson_obj = JSON.stringify(mydata_obj);
	//POST - send JSON data to Python/Django server
	$.post({
	  url: "/register",
	  type: "POST",
	  datatype: 'json',
	  data: myjson_obj,
	  async: true,
      processData: true,

	  success: function() {
	    alert('Your data is saved - New Row Added');
		var update = $('<input/>').attr({ type: 'button', id: 'edit', 
			value: 'Edit' });
		var del = $('<input/>').attr({ type: 'button', id: 'delete', 
			value: 'Delete' });
		table = $("#data");
		columnsCount = 7;
		var mydata = [name, age, skills, hobbies, gender,update, del];
	        //Add the data rows.
	    row = $(table[0].insertRow(-1));
	    for (var j = 0; j < columnsCount; j++) {
	        var cell = $("<td> </td>");
	        cell.html(mydata[j]);	
	        row.append(cell);
	    }
	    clearForm();
	  },
	  error: function() {
	    alert('Error occured while appending New ROW');
	  }
	});
}
function myDelete(session){
    table = $("#data");
    var myname = $(session).parent().parent().find('td:first').text();
    //k1 = $(session).parent().parent().children("td:nth-child(1)").text();
	var mytype = "delrow";
	var mydata_del = {"myname":myname, "mytype":mytype};
	var myjson_del = JSON.stringify(mydata_del);

	$.post({
	  url: "/register",
	  type: "POST",
	  datatype: 'json',
	  data: myjson_del,
	  async: true,
      processData: true,
	  success: function() {
	    alert('Your Row is Deleted');
	    $(session).closest('tr').remove();	
		clearForm();
	  },
	  error: function() {
	    alert('Error occured While Deleting');
	  }
	});
}

function myUpdate(session){
	var row = $(session).parent().parent(); 
	var name = row.children("td:nth-child(1)").text();
	var age = row.children("td:nth-child(2)").text();
	var skills = row.children("td:nth-child(3)").text();
	var hobbies = row.children("td:nth-child(4)").text();
	var gender = row.children("td:nth-child(5)").text();
	clearForm();
	$("#mybutton").val("Update");
	myVariable = session;
	$("#name").val(name);
	var dataArray = myjsondata;
	for (var i in dataArray) {
  		dataObj = dataArray[i];
  		// Reading Individual record from the database and appending it while page is loading
  		if(name == dataObj.name) {
  			//document.myForm.dob.value  = dataObj.dob;
  			$("#dob").val(dataObj.dob);
  		}
	}
	var skillSet = skills;
	var mySkills = skillSet.split(',');
	$.each(mySkills, function(i, skill){
   		$("input[value='" + skill + "']").prop('checked', true);
	});
	var hobbiesSet = hobbies;
	var myHobbies = hobbiesSet.split(',');
	$.each(myHobbies, function(i, hobbies){
   		$("option[value='" + hobbies + "']").prop('selected', true);
	});
	var myGender = gender;			
	$("input[value='" + myGender + "']").prop('checked', true);	
}

function editRow() {
    var name = $("#name").val();
    var dob = $("#dob").val();
	var age = ageCaliculator(dob);
    var skills =getSkills();
	var hobbies = getHobbies();
	var gender = getGender();
	var mytype = "editrow";

	var mydata_obj = {"name":name, "dob":dob, "skills":skills,"hobbies":hobbies, "gender":gender, "mytype":mytype};
	var myjson_obj = JSON.stringify(mydata_obj);
	$.post({
	  url: "/register",
	  type: "POST",
	  datatype: 'json',
	  data: myjson_obj,
	  async: true,
      processData: true,
	  success: function() {
	    alert('Your data is saved - Row Edited Successfully');
		table = $("#data");
		row = $(myVariable).closest('tr');
		row.children("td:nth-child(1)").html(name);
		row.children("td:nth-child(2)").html(age);
		row.children("td:nth-child(3)").html(skills);
		row.children("td:nth-child(4)").html(hobbies);
		row.children("td:nth-child(5)").html(gender);
		$("#mybutton").val("Submit");
	  },
	  error: function() {
	    alert('Error occured while Editing the ROW');
	  }
	});
	clearForm();
}

function clearForm() {
    $("#name").val("");
    $("#dob").val("");
	$('input:checkbox').prop('checked',false);
	$("option:selected").prop("selected", false);
	$('input:radio').prop('checked',false);
}