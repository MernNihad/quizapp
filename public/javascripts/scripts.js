function viewImageCategory(event) {
  document.getElementById("imgViewCat").src = URL.createObjectURL(
    event.target.files[0]
  );
}
function viewImageSubCategory(event) {
  document.getElementById("imgViewSubCat").src = URL.createObjectURL(
    event.target.files[0]
  );
}
$(document).ready(function () {
  $("#filter").keyup(function () {
    var filter = $(this).val(),
      count = 0;
    $("#results div").each(function () {
      if ($(this).text().search(new RegExp(filter, "i")) < 0) {
        $(this).hide();
      } else {
        $(this).show();
        count++;
      }
    });
  });
  
  
  $("#addCategories").validate({
    rules: {
      name: {
        required: true,
      },
      image: {
        required: true,
      },
    },
  });
  $("#signupForm").validate({
    rules: {
      name: {
        required: true,
        minlength: 4, //for length of name,
        maxlength: 36,
      },
      password: {
        required: true,
        minlength: 6,
      },
      //   confirm_password: {
      //       required: true,
      //       minlength: 6,
      //       equalTo: "#password"
      //   },
      email: {
        required: true,
        email: true,
      },
      // agree: {
      //   required: true,
      // },
    },
    messages: {
      name: {
        required: "Enter your Full Name",
        minlength: "Minimum 4 characters",
        maxlength: "Please enter no more than 36 characters.",
      },
      password: {
        required: "Please enter a password",
        minlength: "Password minimum 6 character.",
        maxlength: "Please enter no more than 16 characters.",
      },
      //   confirm_password: {
      //       required: "Please enter a password",
      //       minlength: "Password minimum 6 characters",
      //       equalTo: "Please enter the same password as above."
      //   },
      email: {
        required: "Enter your Email",
      },
      // agree: {
      //   required: "You must agree with our Terms and Conditions",
      // },
    },
  });
  $("#editProfile").validate({
    rules: {
      name: {
        required: true,
      },
      password: {
        // required: true,
        minlength: 6,
        maxlength: 16,
      },

      //   confirm_password: {
      //       required: true,
      //       minlength: 6,
      //       equalTo: "#password"
      //   },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      name: {
        required: " Name null",
        // minlength: "",
        // maxlength: "Please enter no more than 16 characters.",
      },
      password: {
        // required: "Password null",
        minlength: "Minimum 6 characters.",
        maxlength: "Please enter no more than 16 characters.",
      },
      //   confirm_password: {
      //       required: "Please enter a password",
      //       minlength: "Password minimum 6 characters",
      //       equalTo: "Please enter the same password as above."
      //   },
      email: {
        required: "E-mail",
      },
    },
  });
  $("#search").keyup(function () {
    search_table($(this).val());
  });
  function search_table(value) {
    $("#employee_table tr").each(function () {
      var found = "false";
      $(this).each(function () {
        if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          found = "true";
        }
      });
      if (found == "true") {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  $("#LoginForm").validate({
    // in 'rules' user have to specify all the constraints for respective fields
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
      email: {
        required: true,
        email: true,
      },
    },
    messages: {
      password: {
        required: "Please enter a password",
        minlength: "Password minimum 6 character",
        maxlength: "Please enter no more than 16 characters",
      },
      email: {
        required: "Enter your E-mail",
      },
    },
  });
  $("#TableFoRfillter").DataTable();
  $("#allUsers").DataTable();
  $("#subcategory").DataTable();
  
});

function deleteCat(id, name) {
  let cfm = confirm("Are you want to delete " + name);
  if (cfm) {
    $.ajax({
      url: "/admin/delete-category/",
      method: "post",
      data: {
        id: id,
      },
      success: (response) => {
        if (response.status) {
          location.reload();
        } else {
          location.reload();
        }
      },
    });
  } else {
  }
}


function deleteteacher(id, name) {
  let cfm = confirm("Are you want to delete " + name);
  if (cfm) {
    $.ajax({
      url: "/admin/delete-teacher/",
      method: "post",
      data: {
        id: id,
      },
      success: (response) => {
        if (response.status) {
          location.reload();
        } else {
          location.reload();
        }
      },
    });
  } else {
  }
}



function deleteQstn(id, name) {
  let cfm = confirm("Are you want to delete " + name);
  if (cfm) {
    $.ajax({
      url: "/admin/delete-question/",
      method: "post",
      data: {
        id: id,
      },
      success: (response) => {
        if (response.status) {
            location.reload();
        } else {
          alert('occurs  error, try again')
          location.reload();
          // location.reload();
        }
      },
    });
  }
}





const get =(route)=>{
  window.location.href=route
}
const link_url=(url)=>{
  window.location.href=url
}

const viewDisplay=(url)=>{
  window.location.href=url
}



function myFunction(x) {
  if (x.matches) { // If media query matches
    
    $(window).scroll(function() {
      if ($(this).scrollTop() > 0) {
        $('.search-scroll-hide').fadeOut();
      } else {
        $('.search-scroll-hide').fadeIn();
      }
    });

  }
}

var x = window.matchMedia("(max-width: 500px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes