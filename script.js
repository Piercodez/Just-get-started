
document.addEventListener('DOMContentLoaded', function () {
  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    // Get form values
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var message = document.getElementById('message').value;

    // Display a message on the page
    var messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = `
      <p>Thank you, ${firstName} ${lastName}, for your submission!</p>
      <p>${message}</p>
    `;
  }

  // Add event listener to the form
  var formContainer = document.getElementById('myFormContainer');
  console.log(formContainer)
  formContainer.addEventListener('submit', handleSubmit);
});