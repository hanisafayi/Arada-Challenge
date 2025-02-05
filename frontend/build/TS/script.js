"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function storeToken(token) {
    localStorage.setItem('token', token);
}
// Function to retrieve the token from local storage
function getToken() {
    return localStorage.getItem('token');
}
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault(); // Prevent form submission
            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');
            const confirmPasswordElement = document.getElementById('confirm_password');
            if (confirmPasswordElement && emailElement && passwordElement) {
                const email = emailElement.value;
                const password = passwordElement.value;
                const confirm_password = confirmPasswordElement.value;
                const createUserDto = {
                    email,
                    password,
                    confirm_password
                };
                try {
                    const response = yield fetch('http://localhost:3000/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(createUserDto),
                    });
                    if (response.ok) {
                        const data = yield response.json();
                        const token = data.token; // Assuming the token is returned as 'token' property in the response
                        // Store the token in local storage
                        storeToken(token);
                        console.log('Signup successful:', data);
                        window.location.href = 'load.html';
                    }
                    else if (response.status === 409) {
                        // Email already exists
                        const data = yield response.json();
                        console.error('Signup failed:', data.error);
                        const errormsg = document.getElementById('error-message');
                        const errorMessageElement = document.createElement('p');
                        errorMessageElement.innerText = 'Email already exists. Please login instead.';
                        errorMessageElement.style.color = 'red';
                        errormsg.appendChild(errorMessageElement);
                        console.error('Signup failed:', response.json());
                        // Create and display an error message element
                    }
                    else {
                        // Handle signup failure
                        // const errormsg = document.getElementById('error-message') as HTMLElement;
                        // const errorMessageElement = document.createElement('p');
                        // errorMessageElement.innerText = 'Email already exists. Please login instead.';
                        // errorMessageElement.style.color = 'red';
                        // errormsg.appendChild(errorMessageElement);
                        console.error('Signup failed:', response.json());
                    }
                }
                catch (error) {
                    // Handle network error
                    console.error('Error occurred during signup:', error);
                }
            }
        });
    });
}
// login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault(); // Prevent form submission
            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');
            if (emailElement && passwordElement) {
                const email = emailElement.value;
                const password = passwordElement.value;
                const signInDto = {
                    email,
                    password
                };
                try {
                    const response = yield fetch('http://localhost:3000/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(signInDto),
                    });
                    if (response.ok) {
                        const data = yield response.json();
                        const token = data.token; // Assuming the token is returned as 'token' property in the response
                        // Store the token in local storage
                        storeToken(token);
                        console.log('login successful:', data);
                        window.location.href = 'load.html';
                    }
                    else {
                        // Handle login failure
                        const data = yield response.json();
                        console.error('Login failed:', data.error);
                        // Create and display an error message element
                        const errormessage = document.getElementById("error-message");
                        errormessage.innerText = '';
                        const errorMessageElement = document.createElement('p');
                        errorMessageElement.innerText = 'Invalid username or password.';
                        errorMessageElement.style.color = 'red';
                        errormessage.appendChild(errorMessageElement);
                    }
                }
                catch (error) {
                    // Handle network error
                    console.error('Error occurred during login:', error);
                }
            }
        });
    });
}
// Function to send the PATCH request
function sendPatchRequest(token, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Sending PATCH request...');
            // Get the form data from the HTML form
            const form = document.getElementById('fillProfile');
            const formData = new FormData(form);
            // Convert the form data to JSON
            const profileData = {};
            for (const [key, value] of formData.entries()) {
                profileData[key] = value;
            }
            // Create the PATCH request configuration
            const requestOptions = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            };
            // Send the PATCH request to update the profile
            const response = yield fetch(`http://localhost:3000/users/${id}`, requestOptions);
            const data = yield response.json();
            console.log('Response:', data);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
// Function to extract the user ID
function extractTokenAndSendPatchRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = getToken();
            if (token) {
                console.log('Extracting token and sending PATCH request...');
                // Send a GET request to extract the user ID
                const extractResponse = yield fetch('http://localhost:3000/users/extractToken', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include the token in the authorization header
                    }
                });
                console.log('Response:', extractResponse);
                const extractData = yield extractResponse.json();
                console.log('Data:', extractData);
                const id = extractData._id;
                console.log('Extracted ID:', id);
                yield sendPatchRequest(token, id);
            }
            // Use the extracted token and ID to send the PATCH request
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
// Get the continue button element
const continueButton = document.getElementById('continuebtn');
// Add event listener to the continue button
continueButton.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    console.log('Continue button clicked...');
    yield extractTokenAndSendPatchRequest();
    console.log('Clicked event processed.');
}));
