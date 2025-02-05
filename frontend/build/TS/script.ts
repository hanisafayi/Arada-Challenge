function storeToken(token: string) {
  localStorage.setItem('token', token);
}

// Function to retrieve the token from local storage
function getToken(): string | null {
  return localStorage.getItem('token');
}
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission
    const emailElement = document.getElementById('email') as HTMLInputElement | null;
    const passwordElement = document.getElementById('password') as HTMLInputElement | null;
    const confirmPasswordElement = document.getElementById('confirm_password') as HTMLInputElement | null;

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
        const response = await fetch('http://localhost:3000/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createUserDto),
        });

        if (response.ok) {
          const data = await response.json();
          const token: string = data.token; // Assuming the token is returned as 'token' property in the response

        // Store the token in local storage
        storeToken(token);
          console.log('Signup successful:', data);
          window.location.href = 'load.html';

        } else if (response.status === 409) {
          // Email already exists
          const data = await response.json();
          console.error('Signup failed:', data.error);
          const errormsg = document.getElementById('error-message') as HTMLElement;
          const errorMessageElement = document.createElement('p');
          errorMessageElement.innerText = 'Email already exists. Please login instead.';
          errorMessageElement.style.color = 'red';
          errormsg.appendChild(errorMessageElement);
          console.error('Signup failed:', response.json());
          // Create and display an error message element
         
        } else {
          // Handle signup failure
          // const errormsg = document.getElementById('error-message') as HTMLElement;
          // const errorMessageElement = document.createElement('p');
          // errorMessageElement.innerText = 'Email already exists. Please login instead.';
          // errorMessageElement.style.color = 'red';
          // errormsg.appendChild(errorMessageElement);
          console.error('Signup failed:', response.json());
        }
      } catch (error) {
        // Handle network error
        console.error('Error occurred during signup:', error);
      }
    }
  });
}
// login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const emailElement = document.getElementById('email') as HTMLInputElement | null;
    const passwordElement = document.getElementById('password') as HTMLInputElement | null;

    if (emailElement && passwordElement) {
      const email = emailElement.value;
      const password = passwordElement.value;

      const signInDto = {
        email,
        password
      };

      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signInDto),
        });

        if (response.ok) {
          const data = await response.json();
          const token: string = data.token; // Assuming the token is returned as 'token' property in the response

        // Store the token in local storage
        storeToken(token);
          console.log('login successful:', data);
          window.location.href = 'load.html';

        } else {
          // Handle login failure
          const data = await response.json();
          console.error('Login failed:', data.error);
          // Create and display an error message element
          const errormessage = document.getElementById("error-message") as HTMLElement;
          errormessage.innerText = '';
          const errorMessageElement = document.createElement('p');
          errorMessageElement.innerText = 'Invalid username or password.';
          errorMessageElement.style.color = 'red';
          errormessage.appendChild(errorMessageElement);
        }
      } catch (error) {
        // Handle network error
        console.error('Error occurred during login:', error);
      }
    }
  });
}

// Function to send the PATCH request
async function sendPatchRequest(token: string | null, id: string) {
  try {
    console.log('Sending PATCH request...');
    
    // Get the form data from the HTML form
    const form = document.getElementById('fillProfile') as HTMLFormElement;
    const formData = new FormData(form);

    // Convert the form data to JSON
    const profileData: { [key: string]: any } = {};

    for (const [key, value] of formData.entries()) {
      profileData[key] = value;
    }

    // Create the PATCH request configuration
    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    };

    // Send the PATCH request to update the profile
    const response = await fetch(`http://localhost:3000/users/${id}`, requestOptions);
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to extract the user ID
async function extractTokenAndSendPatchRequest() {
  try {
    const token: string | null = getToken();
    if (token) {
      console.log('Extracting token and sending PATCH request...');
      
      // Send a GET request to extract the user ID
      const extractResponse = await fetch('http://localhost:3000/users/extractToken', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the authorization header
        }
      });
      console.log('Response:', extractResponse);
      const extractData = await extractResponse.json();
      console.log('Data:', extractData);
      const id = extractData._id;
      console.log('Extracted ID:', id);
      await sendPatchRequest(token, id);
    }

    // Use the extracted token and ID to send the PATCH request
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get the continue button element
const continueButton = document.getElementById('continuebtn') as HTMLButtonElement;

// Add event listener to the continue button
continueButton.addEventListener('click', async (event) => {
  event.preventDefault();
  console.log('Continue button clicked...');
  await extractTokenAndSendPatchRequest();
  console.log('Clicked event processed.');
});