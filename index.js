
// Global variables
let users = [];
let selectedUsers = [];
let currentPage = 1;
let totalPages = 1;

// Fetch user data from the API
fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
  .then(response => response.json())
  .then(data => {
    users = data;
    displayUsers();
  });

// Display users on the table
function displayUsers() {
  let filteredUsers = users.filter(user => {

    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    return user.name.toLowerCase().includes(searchInput) ||
      user.email.toLowerCase().includes(searchInput) ||
      user.role.toLowerCase().includes(searchInput);
  });

  totalPages = Math.ceil(filteredUsers.length / 10);
  updatePageNumbers();

  let usersToDisplay = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10);
  let tableBody = document.getElementById('usersTable').tBodies[0];
  tableBody.innerHTML = '';

  for (let user of usersToDisplay) {
    let row = document.createElement('tr');
    row.onclick = () => toggleSelection(row);

    let checkboxCell = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedUsers.includes(user.id);
    checkbox.onchange = () => toggleSelection(user.id);

    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    let idCell = document.createElement('td');
    idCell.textContent = user.id;
    row.appendChild(idCell);

    let nameCell = document.createElement('td');
    nameCell.textContent = user.name;
    row.appendChild(nameCell);

    let emailCell = document.createElement('td');
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    let roleCell = document.createElement('td');
    roleCell.textContent = user.role;
    row.appendChild(roleCell);

    let actionsCell = document.createElement('td');

    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => editUser(user);
    actionsCell.appendChild(editButton);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteUser(user.id);
    actionsCell.appendChild(deleteButton);
    
    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  }
}

function searchUsers() {
const searchTerm = document.getElementById('searchInput').value.toLowerCase();
const filteredUsers = users.filter((user) => {
for (const property in user) {
  if (user[property].toLowerCase().includes(searchTerm)) {
    return true;
  }
}
return false;
});


displayUsers(filteredUsers);
}
function presskey(){
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keypress', (event) => {
if (event.key === 'Enter') {
searchUsers();
}
});
}

// Update page numbers based on current page and total pages
function updatePageNumbers() {
let pageNumbersHTML = '';
if (totalPages > 1) {
for (let i = 1; i <= totalPages; i++) {
  let pageNumberLink = '';
  if (currentPage === i) {
    pageNumberLink = `<b>${i}</b>`;
  } else {
    pageNumberLink = `<a href="#" onclick="goToPage(${i})">${i}</a>`;
  }

  pageNumbersHTML += ` ${pageNumberLink}`;
}
}

document.getElementById('pageNumbers').innerHTML = pageNumbersHTML;
}


// Go to a specific page
function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages) {
    return;
  }

  currentPage = pageNumber;
  displayUsers();
}

// Go to the previous page
function previousPage() {
  if (currentPage === 1) {
    return;
  }

  currentPage -= 1;
  displayUsers();
}

// Go to the next page
function nextPage() {
  if (currentPage === totalPages) {
    return;
  }

  currentPage += 1;
  displayUsers();
}

function toggleSelection(userId) {
  if (selectedUsers.includes(userId)) {
    selectedUsers.splice(selectedUsers.indexOf(userId), 1);
  } else {
    selectedUsers.push(userId);
  }

  // Update the checkbox state
  const checkbox = document.querySelector(`input[type="checkbox"][data-user-id="${userId}"]`);
  checkbox.checked = selectedUsers.includes(userId);
  const row = checkbox.parentElement.parentElement;
  if (checkbox.checked) {
    selectedUsers.push(userId);
    row.style.backgroundColor = '#ffffff'; // Add grayish background color
  } else {
    selectedUsers.splice(selectedUsers.indexOf(userId), 1);
    row.style.backgroundColor = ''; // Remove grayish background color
  }
  updateSelectAllCheckbox();
}


// Update the 'Select All' checkbox based on selected users
function updateSelectAllCheckbox() {
  let selectAllCheckbox = document.getElementById('selectAllCheckbox');
  selectAllCheckbox.checked = selectedUsers.length === users.length;
}


function selectAllUsers() {
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const tableBody = document.getElementById('usersTable').tBodies[0];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  if (selectAllCheckbox.checked) {
    selectedUsers = users.filter((user, index) => {
      return index >= (currentPage - 1) * 10 && index < currentPage * 10;
    }).map(user => user.id);

    for (let row of tableBody.rows) {
      row.style.backgroundColor = '#f2f2f2';
    }

    for (let checkbox of checkboxes) {
      checkbox.checked = true;
    }
  } else {
    // Uncheck all individual checkboxes
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }

    // Clear the selectedUsers array
    selectedUsers = [];

    // Reset background color for all rows
    for (let row of tableBody.rows) {
      row.style.backgroundColor = '';
    }
  }


}



function editUser(user) {
  // Create the modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'edit-user-modal';

  // Create the modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Create the modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = 'Edit User';
  modalHeader.appendChild(modalTitle);

  // Create the modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  // Create form elements for user information
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Name';
  nameInput.value = user.name;

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  emailInput.value = user.email;

  const roleSelect = document.createElement('select');
  roleSelect.options.add(new Option('Admin', 'admin'));
  roleSelect.options.add(new Option('Manager', 'manager'));
  roleSelect.options.add(new Option('User', 'user'));
  roleSelect.value = user.role;

  modalBody.appendChild(nameInput);
  modalBody.appendChild(emailInput);
  modalBody.appendChild(roleSelect);

  // Create the modal footer
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';

  // Create save button
  const saveButton = document.createElement('button');
  saveButton.className = 'save-button';
  saveButton.textContent = 'Save Changes';

  // Add event listener for save button
  saveButton.addEventListener('click', () => {
    // Update user information based on form input
    user.name = nameInput.value;
    user.email = emailInput.value;
    user.role = roleSelect.value;

    // Refresh the user table with updated data
    displayUsers();

    // Close the modal
    modalContainer.style.display = 'none';
  });

  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.className = 'cancel-button';
  cancelButton.textContent = 'Cancel';

  // Add event listener for cancel button
  cancelButton.addEventListener('click', () => {
    // Close the modal
    modalContainer.style.display = 'none';
  });

  // Assemble the modal content
  modalFooter.appendChild(saveButton);
  modalFooter.appendChild(cancelButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  // Add the modal content to the modal container
  modalContainer.appendChild(modalContent);

  // Display the modal
  document.body.appendChild(modalContainer);
  modalContainer.style.display = 'block';
}

function deleteUser(userId) {
  let index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    selectedUsers = selectedUsers.filter(id => id !== userId);
  }

  displayUsers();
}

// Delete selected users
// function deleteSelectedUsers() {
//   for (let userId of selectedUsers) {
//     deleteUser(userId);
//   }
// }
function deleteSelectedUsers() {
  // Create a confirmation prompt before deleting multiple users
  const confirmation = confirm('Are you sure you want to delete the selected users?');

  if (confirmation) {
    // Iterate through the selected users and delete them
    for (let userId of selectedUsers) {
      deleteUser(userId);
    }

    // Clear the selected users array after deleting them
    selectedUsers = [];

    // Refresh the user table to reflect the changes
    displayUsers();
  }
}