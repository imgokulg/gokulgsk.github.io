$(document).ready(function() {
	productLoad();
	isAdmin();
	$("#product_list").change(function(){
		var product = document.getElementById("product_list");
		var id = $(this).children(":selected").attr("id");
		try {
			var activeCategory = $(".tablinks.active")[0].innerHTML;
		}
		catch(e){}
		categoryLoad(id);
	});

	$("#addFile").click(function() {
		window.location = "addFile.html";	
	});	
	$("#EditDocument").click(function() {
		window.location = "../Edit/EditDocument.html";	
	});
	$("#send").click(function() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
			}
		};
		xhttp.open("POST", "../RequestDocumentMail", true);
		xhttp.send();	
	});	
});
function productLoad() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var productList = JSON.parse(this.responseText);
			for(var i=0;i<productList.id.length;i++) {
				$("#product_list").append("<option id="+productList.id[i]+">"+productList.name[i]+"</option>");
			}
			categoryLoad(productList.id[0]);
		}
	};
	xhttp.open("GET", "../GetProductList", true);
	xhttp.send();
}

function categoryLoad(product_id){
	var category = document.getElementById("category");
	category.innerHTML ='';
	var categoryDocs = document.getElementById("category_documents");
	categoryDocs.innerHTML ='';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var categoryList = JSON.parse(this.responseText);
			for(var i=0;i<categoryList.name.length;i++) {
				if(i == 0) {
					$("#category").append("<input type=button value="+categoryList.name[i]+" id=\"defaultOpen\" class='tablinks' onclick=\"selectTab(event,'"+categoryList.name[i]+"')\">");
				}
				else {
					$("#category").append("<input type=button value="+categoryList.name[i]+" class='tablinks' onclick=\"selectTab(event,'"+categoryList.name[i]+"')\">");		
				}
				$("#category_documents").append("<div id='"+categoryList.name[i]+"' class='tabcontent'></div>");
				addDocuments(product_id,categoryList.id[i],categoryList.name[i],categoryList.name[i]);
				$("#"+categoryList.name[i]+"").hide();
			}
			if(categoryList.name.length > 0) {
				document.getElementById("defaultOpen").click();
			}
		}
	};
	xhttp.open("GET", "../GetCategoryList?product_id="+product_id, true);
	xhttp.send();
}	
function addDocuments(product_id,category_id,div_id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var documentList = JSON.parse(this.responseText);
			for(var i=0;i<documentList.name.length;i++) {
				$("#"+div_id+"").append("<a href=\"../product/"+documentList.product+"/"+documentList.category+"/"+documentList.name[i]+"\" ><img src=\"../product/"+documentList.product+"/"+documentList.category+"/"+documentList.id[i]+".jpg\" alt=\"document\" width=\"100px\" height=\"100px\"></a>");
			}
		}	
	};
	xhttp.open("GET", "../GetDocumentList?product_id="+product_id+"&category_id="+category_id, true);
	xhttp.send();
}
function selectTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
	var product = $("#product_list").children(":selected").attr("id");
}

function isAdmin() {
	try {
		 $.ajax({
		 	url: "../isAdmin.jsp", 
		 	type: 'GET',
		 	data: {
			},
   			headers: {
    		},
		 	success: function(result){
		 		if(result.localeCompare("yes") == true) {
		 			document.getElementById("edit").style.display = "block";	
		 		}
		 		else {
		 			document.getElementById("edit").style.display = "none";
		 		}
    		}, 
    		error: function(XMLHttpRequest, textStatus, errorThrown) {
    		}
    	});
	}
	catch(err) {}
	
}



