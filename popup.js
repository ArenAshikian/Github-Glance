document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('searchButton');
    button.addEventListener('click', function() {
        var username = document.getElementById('username').value;
        if (username.trim() === '') {
            collapseRepoList();
            removeProfileLinkButton(); // Remove the profile link button if username is empty
            var profilePicture = document.getElementById('profilePicture');
            profilePicture.src = 'github.png'; // Use GitHub logo as alternate image
            
        } else {
            getRepositories(username);
            getProfilePicture(username); // Fetch profile picture when search button is clicked
            createProfileLinkButton(username); // Create the profile link button
        }
    });

    // Event listener for the profile link button
    var profileLinkButton = document.getElementById('profileLinkButton');
    profileLinkButton.addEventListener('click', function() {
        var username = document.getElementById('username').value;
        if (username.trim() !== '') {
            // Construct the URL of the user's GitHub profile
            var profileUrl = 'https://github.com/' + username;
            // Open the user's GitHub profile in a new tab
            window.open(profileUrl, '_blank');
        }
    });
});




function collapseRepoList() {
    var repoList = document.getElementById('repoList');
    repoList.innerHTML = ''; // Clear previous results
    repoList.classList.remove('show'); // Hide repoList
}

function getRepositories(username) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/users/' + username + '/repos', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var repos = JSON.parse(xhr.responseText);
            displayRepositories(repos);
        }
    };
    xhr.send();
}

function displayRepositories(repos) {
    var repoList = document.getElementById('repoList');
    repoList.innerHTML = ''; // Clear previous results
    
    // Display the total number of repositories
    var totalRepoCount = document.createElement('p');
    totalRepoCount.textContent = "Total repositories: " + repos.length;
    totalRepoCount.classList.add('total-repositories'); // Add class for styling
    repoList.appendChild(totalRepoCount);

    // Display the first five repositories separately
    var numToShow = Math.min(repos.length, 5); // Change 0 to 5
    for (var i = 0; i < numToShow; i++) {
        var firstFiveRepo = document.createElement('li');
        firstFiveRepo.textContent = repos[i].name;
        repoList.appendChild(firstFiveRepo);
    }

    // List the remaining repositories as list items
    var remainingRepos = document.createElement('ul');
    for (var i = numToShow; i < repos.length; i++) {
        var listItem = document.createElement('li');
        listItem.textContent = repos[i].name;
        remainingRepos.appendChild(listItem);
    }
    repoList.appendChild(remainingRepos);

    // Display "Show All" button if there are more than 5 repositories
    if (repos.length > 0) { // Change 0 to 5
        var dropdownButton = document.createElement('button');
        dropdownButton.textContent = 'Show All';
        dropdownButton.id = 'dropdownButton';
        repoList.appendChild(dropdownButton);

        var showAll = true; // Track the current state of the button

        dropdownButton.addEventListener('click', function() {
            if (showAll) {
                repoList.classList.add('show');
                dropdownButton.textContent = 'Show Less'; // Change button text to 'Show Less'
            } else {
                repoList.classList.remove('show');
                dropdownButton.textContent = 'Show All'; // Change button text to 'Show All'
            }
            showAll = !showAll; // Toggle the state
        });
    }
}

function getProfilePicture(username) {
    console.log("getProfilePicture function called with username:", username);
    if (username.trim() === '') {
        console.log("Username is empty, setting default profile picture.");
        var profilePicture = document.getElementById('profilePicture');
        profilePicture.src = 'github.png'; // Use GitHub logo as alternate image
        return; // Exit function early
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/users/' + username, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("User found, setting profile picture.");
                var userData = JSON.parse(xhr.responseText);
                var profilePicture = document.getElementById('profilePicture');
                profilePicture.src = userData.avatar_url || 'github.png'; // Use user's avatar or GitHub logo as alternate image
            } else {
                console.log("User not found, setting default profile picture.");
                // Request failed or user not found, set alternate image
                var profilePicture = document.getElementById('profilePicture');
                profilePicture.src = 'github.png'; // Use GitHub logo as alternate image
            }
        }
    };
    xhr.send();
}
// Function to create the profile link button
function createProfileLinkButton(username) {
    var profileLinkButton = document.getElementById('profileLinkButton');
    if (!profileLinkButton) { // Check if button already exists
        profileLinkButton = document.createElement('button');
        profileLinkButton.textContent = 'View Profile';
        profileLinkButton.id = 'profileLinkButton';
        profileLinkButton.addEventListener('click', function() {
            // Construct the URL of the user's GitHub profile
            var profileUrl = 'https://github.com/' + username;
            // Open the user's GitHub profile in a new tab
            window.open(profileUrl, '_blank');
        });
        // Append the button to the container
        var container = document.querySelector('.container');
        container.appendChild(profileLinkButton);
    }
}

function removeProfileLinkButton() {
    var profileLinkButton = document.getElementById('profileLinkButton');
    if (profileLinkButton) { // Check if button exists
        profileLinkButton.remove();
    }
}
