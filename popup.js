document.addEventListener('DOMContentLoaded', function() {
    
    var button = document.getElementById('searchButton');
    var usernameInput = document.getElementById('username');
    var errorMessage = document.createElement('p'); // Create element for error message
    errorMessage.classList.add('error-message'); // Add class for styling

    var loadingAnimation = document.getElementById('loadingAnimation');
  
    var isValidUsername = function(username) {
        var usernameRegex = /^[a-zA-Z0-9-_]+$/;
        return usernameRegex.test(username);
    };

    var searchFunction = function() {
        var rawUsername = usernameInput.value.trim();
        var sanitizedUsername = rawUsername.replace(/[^a-zA-Z0-9-_]/g, ''); // Remove non-alphanumeric characters
        usernameInput.value = sanitizedUsername; // Update the input field with sanitized value

        if (sanitizedUsername === '') {
            collapseRepoList();
            removeProfileLinkButton();
            errorMessage.textContent = ''; // Clear error message
            var profilePicture = document.getElementById('profilePicture');
            profilePicture.src = '25231.png';
        } else if (!isValidUsername(sanitizedUsername)) {
            errorMessage.textContent = 'Please enter a valid username with only alphanumeric characters, hyphens, and underscores.';
            var container = document.querySelector('.container');
            container.appendChild(errorMessage); // Append error message to container
            collapseRepoList();
            removeProfileLinkButton();
            var profilePicture = document.getElementById('profilePicture');
            profilePicture.src = '25231.png';
        } else {
            errorMessage.textContent = ''; // Clear error message
            removeErrorMessage(); // Remove error message if exists
            showLoadingAnimation(); // Show loading animation
            getRepositories(sanitizedUsername);
            getProfilePicture(sanitizedUsername);
            createProfileLinkButton(sanitizedUsername);
        }
    };

    button.addEventListener('click', searchFunction);

    usernameInput.addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
            searchFunction();
        }
    });

    var profileLinkButton = document.getElementById('profileLinkButton');
    profileLinkButton.addEventListener('click', function() {
        var username = document.getElementById('username').value.trim();
        if (username !== '' && isValidUsername(username)) {
            var profileUrl = 'https://github.com/' + username;
            window.open(profileUrl, '_blank');
        }
    });

    function showLoadingAnimation() {
        var profilePicture = document.getElementById('profilePicture');
        profilePicture.style.display = 'none'; // Hide the profile picture
        loadingAnimation.style.display = 'block'; // Show the loading animation
    }
    
    function hideLoadingAnimation() {
        var profilePicture = document.getElementById('profilePicture');
        profilePicture.style.display = 'block'; // Show the profile picture
        loadingAnimation.style.display = 'none'; // Hide the loading animation
    }
    

    function collapseRepoList() {
        var repoList = document.getElementById('repoList');
        repoList.innerHTML = '';
        repoList.classList.remove('show');
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
        repoList.innerHTML = '';

        var totalRepoCount = document.createElement('p');
        totalRepoCount.textContent = "Total repositories: " + repos.length;
        totalRepoCount.classList.add('total-repositories');
        repoList.appendChild(totalRepoCount);

        var numToShow = Math.min(repos.length, 5);
        for (var i = 0; i < numToShow; i++) {
            var firstFiveRepo = document.createElement('li');
            firstFiveRepo.textContent = repos[i].name;
            repoList.appendChild(firstFiveRepo);
        }

        var remainingRepos = document.createElement('ul');
        for (var i = numToShow; i < repos.length; i++) {
            var listItem = document.createElement('li');
            listItem.textContent = repos[i].name;
            remainingRepos.appendChild(listItem);
        }
        repoList.appendChild(remainingRepos);

        if (repos.length > 0) {
            var dropdownButton = document.createElement('button');
            dropdownButton.textContent = 'Show All';
            dropdownButton.id = 'dropdownButton';
            repoList.appendChild(dropdownButton);

            var showAll = true;
            repoList.classList.remove('show');
            dropdownButton.textContent = 'Show All';
            dropdownButton.addEventListener('click', function() {
                if (showAll) {
                    repoList.classList.add('show');
                    dropdownButton.textContent = 'Show Less';
                } else {
                    repoList.classList.remove('show');
                    dropdownButton.textContent = 'Show All';
                }
                showAll = !showAll;
            });
        }

        hideLoadingAnimation(); // Hide loading animation after displaying repositories
    }

    function getProfilePicture(username) {
        console.log("getProfilePicture function called with username:", username);
        if (username === '') {
            console.log("Username is empty, setting default profile picture.");
            var profilePicture = document.getElementById('profilePicture');
            profilePicture.src = '25231.png';
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.github.com/users/' + username, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("User found, setting profile picture.");
                    var userData = JSON.parse(xhr.responseText);
                    var profilePicture = document.getElementById('profilePicture');
                    profilePicture.src = userData.avatar_url || '25231.png';
                } else {
                    console.log("User not found, setting default profile picture and displaying error message.");
                    var profilePicture = document.getElementById('profilePicture');
                    profilePicture.src = '25231.png';
                    displayErrorMessage("User not found."); // Call function to display error message
                    collapseRepoList();
                    removeProfileLinkButton();
                }
            }
        };
        xhr.send();
    }

    function createProfileLinkButton(username) {
        var profileLinkButton = document.getElementById('profileLinkButton');
        if (!profileLinkButton) {
            profileLinkButton = document.createElement('button');
            profileLinkButton.textContent = 'View Profile';
            profileLinkButton.id = 'profileLinkButton';
            profileLinkButton.addEventListener('click', function() {
                var profileUrl = 'https://github.com/' + username;
                window.open(profileUrl, '_blank');
            });
            var container = document.querySelector('.container');
            container.appendChild(profileLinkButton);
        }
    }

    function removeProfileLinkButton() {
        var profileLinkButton = document.getElementById('profileLinkButton');
        if (profileLinkButton) {
            profileLinkButton.remove();
        }
    }

    function displayErrorMessage(message) {
        var container = document.querySelector('.container');
        var existingErrorMessage = container.querySelector('.error-message');

        if (existingErrorMessage) {
            existingErrorMessage.textContent = message; // Update existing error message
        } else {
            var errorMessage = document.createElement('p');
            errorMessage.textContent = message;
            errorMessage.classList.add('error-message');
            container.appendChild(errorMessage); // Append error message to container
        }
    }

    function removeErrorMessage() {
        var container = document.querySelector('.container');
        var existingErrorMessage = container.querySelector('.error-message');
        if (existingErrorMessage) {
            existingErrorMessage.remove(); // Remove error message if exists
        }
    }
});
