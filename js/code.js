const urlBase = 'http://cloud-contacts.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login, password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if (userId < 1)
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister()
{
	let url = urlBase + '/AddLogin.' + extension;

	let firstNameVal    = document.getElementById("firstName").value;
	let lastNameVal     = document.getElementById("lastName").value;
	let login           = document.getElementById("username").value;
	let password        = document.getElementById("password").value;
	let confirmPassword = document.getElementById("confirmPassword").value;

	let registerResult = document.getElementById("registerResult");

	if (registerResult)
	{
		registerResult.innerHTML = "";
	}

	if (password !== confirmPassword)
	{
		if (registerResult)
		{
			registerResult.innerHTML = "Passwords do not match";
		}
		return;
	}

	let info = 
	{
		FirstName: firstNameVal,
		LastName:  lastNameVal,
		Login:     login,
		Password:  password
	};

	let xhr = new XMLHttpRequest();
	let jsonPayload = JSON.stringify(info);

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					if (registerResult)
					{
						registerResult.innerHTML = jsonObject.error;
					}
					return;
				}

				window.location.href = "login.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		if (registerResult)
		{
			registerResult.innerHTML = err.message;
		}
	}
}

function addContact()
{
	let url = urlBase + "/AddContact." + extension;

	let firstNameVal = document.getElementById("first-name").value;
	let lastNameVal  = document.getElementById("last-name").value;
	let email        = document.getElementById("user-email").value;
	let phone        = document.getElementById("phone-num").value;

	let info = 
	{
		userId:    userId,
		FirstName: firstNameVal,
		LastName:  lastNameVal,
		Email:     email,
		Phone:     phone
	};

	let xhr = new XMLHttpRequest();
	let jsonPayload = JSON.stringify(info);

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					alert(jsonObject.error);
					return;
				}

				// reset form and close modal
				document.getElementById("addContactForm").reset();
				let modalElement = document.getElementById("addContactModal");
				let modal = bootstrap.Modal.getInstance(modalElement);
				if (modal)
				{
					modal.hide();
				}

				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}
}

function editContact(contact)
{
	
	// current info
	document.getElementById("edit-contact-id").value  = contact.ID;
	document.getElementById("edit-first-name").value  = contact.FirstName;
	document.getElementById("edit-last-name").value   = contact.LastName;
	document.getElementById("edit-phone-num").value   = contact.Phone;
	document.getElementById("edit-user-email").value  = contact.Email;

	let modal = new bootstrap.Modal(document.getElementById("editContactModal"));
	modal.show();
}

function updateContact()
{
	// update info
	let contactId    = document.getElementById("edit-contact-id").value;
	let firstNameVal = document.getElementById("edit-first-name").value;
	let lastNameVal  = document.getElementById("edit-last-name").value;
	let phone        = document.getElementById("edit-phone-num").value;
	let email        = document.getElementById("edit-user-email").value;

	let info =
	{
		ID:        contactId,
		userId:    userId,
		FirstName: firstNameVal,
		LastName:  lastNameVal,
		Phone:     phone,
		Email:     email
	};

	let xhr = new XMLHttpRequest();
	let jsonPayload = JSON.stringify(info);
	let url = urlBase + "/UpdateContact." + extension;

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					alert(jsonObject.error);
					return;
				}

				let modalElement = document.getElementById("editContactModal");
				let modal = bootstrap.Modal.getInstance(modalElement);
				if (modal)
				{
					modal.hide();
				}

				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}
}

function deleteContact(contactId)
{

	if (!confirm("Are you sure you want to delete this contact?"))
	{
		return;
	}

	let url = urlBase + "/DeleteContact." + extension;


	let info =
	{
		ID:     contactId,
		userId: userId
	};

	let xhr = new XMLHttpRequest();
	let jsonPayload = JSON.stringify(info);

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error.length > 0)
				{
					alert(jsonObject.error);
					return;
				}

				searchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}
}

function searchContacts()
{
	let searchInput = document.getElementById("searchInput");

	if (!searchInput)
	{
		return;
	}

	let url = urlBase + "/SearchContacts." + extension;

	let info =
	{
		search: searchInput.value,
		userId: userId
	};

	let xhr = new XMLHttpRequest();
	let jsonPayload = JSON.stringify(info);

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				let table = document.getElementById("contactTable");

				table.innerHTML = "";

			
				if (!jsonObject.results || jsonObject.results.length === 0)
				{
					let emptyRow = table.insertRow();
					let cell = emptyRow.insertCell();
					cell.colSpan = 4;
					cell.className = "text-center text-muted py-4";
					cell.textContent = "No contacts found. Add one to get started!";
					return;
				}

				for (let i = 0; i < jsonObject.results.length; i++)
				{
					let contact = jsonObject.results[i];
					let row = table.insertRow();

					let nameCell   = row.insertCell();
					let phoneCell  = row.insertCell();
					let emailCell  = row.insertCell();
					let actionCell = row.insertCell();

					nameCell.textContent  = contact.FirstName + " " + contact.LastName;
					phoneCell.textContent = contact.Phone;
					emailCell.textContent = contact.Email;
					actionCell.className  = "text-end";


					let editBtn = document.createElement("button");
					editBtn.className = "btn btn-primary btn-sm me-1";
					editBtn.textContent = "Edit";
					editBtn.addEventListener("click", function()
					{
						editContact(contact);
					});

					let deleteBtn = document.createElement("button");
					deleteBtn.className = "btn btn-danger btn-sm";
					deleteBtn.textContent = "Delete";
					deleteBtn.addEventListener("click", function()
					{
						deleteContact(contact.ID);
					});

					actionCell.appendChild(editBtn);
					actionCell.appendChild(deleteBtn);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));


	document.cookie = "firstName=" + encodeURIComponent(firstName) + ";expires=" + date.toGMTString() + ";path=/";
	document.cookie = "lastName="  + encodeURIComponent(lastName)  + ";expires=" + date.toGMTString() + ";path=/";
	document.cookie = "userId="    + userId                        + ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie()
{
	userId = -1;
	let cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++)
	{
		let eqIdx = cookies[i].indexOf("=");
		let key   = cookies[i].substring(0, eqIdx).trim();
		let value = cookies[i].substring(eqIdx + 1).trim();

		if (key === "firstName")
		{
			firstName = decodeURIComponent(value);
		}
		else if (key === "lastName")
		{
			lastName = decodeURIComponent(value);
		}
		else if (key === "userId")
		{
			userId = parseInt(value);
		}
	}
	
	if (userId < 0)
	{
		window.location.href = "login.html";
	}
	else
	{
		let userNameEl = document.getElementById("userName");
		if (userNameEl)
		{
			userNameEl.innerHTML = "Logged in as " + firstName + " " + lastName;
		}
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let expired = "expires=Mon, 01 Jan 2000 00:00:00 GMT;path=/";
	document.cookie = "firstName=;" + expired;
	document.cookie = "lastName=;"  + expired;
	document.cookie = "userId=;"    + expired;

	window.location.href = "login.html";
}

function logout()
{
	doLogout();
}

// hook up forms on page load
document.addEventListener("DOMContentLoaded", function()
{
	let loginForm      = document.getElementById("loginForm");
	let signupForm     = document.getElementById("signupForm");
	let addContactForm = document.getElementById("addContactForm");
	let editContactForm = document.getElementById("editContactForm");
	let searchForm     = document.getElementById("searchForm");

	if (loginForm)
	{
		loginForm.addEventListener("submit", function(event)
		{
			event.preventDefault();
			doLogin();
		});
	}

	if (signupForm)
	{
		signupForm.addEventListener("submit", function(event)
		{
			event.preventDefault();
			doRegister();
		});
	}
	if (addContactForm)
	{
		addContactForm.addEventListener("submit", function(event)
		{
			event.preventDefault();
			addContact();
		});
	}
	if (editContactForm)
	{
    editContactForm.addEventListener("submit", function(event)
    {
        event.preventDefault();
        updateContact();
    });
	}

	if (searchForm)
	{
		searchForm.addEventListener("submit", function(event)
		{
			event.preventDefault();
			searchContacts();
		});
	}

	if (document.getElementById("contactTable"))
	{
		readCookie();
		searchContacts();
	}
});

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch, userId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);
				
				for (let i = 0; i < jsonObject.results.length; i++)
				{
					colorList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1)
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}