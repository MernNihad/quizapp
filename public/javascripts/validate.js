$(document).ready(function () {
    $("#mcq").validate({
        rules: {
            question: {
            required: true,
          },
          option_A: {
            required: true,
          },
          option_B: {
            required: true,
          },
          option_C: {
            required: true,
          },
          option_D: {
            required: true,
          },
          answer: {
            required: true,
          },
          
        },
      });


      $("#typeanser").validate({
        rules: {
            question: {
            required: true,
          },
        },
      });

      $("#edittype").validate({
        rules: {
            question: {
            required: true,
          },
        },
      });

      $("#edittf").validate({
        rules: {
            question: {
            required: true,
          },
          answer: {
            required: true,
          },
          
        },
      });
      $("#editmcq").validate({
        rules: {
            question: {
                required: true,
              },
              option_A: {
                required: true,
              },
              option_B: {
                required: true,
              },
              option_C: {
                required: true,
              },
              option_D: {
                required: true,
              },
              answer: {
                required: true,
              },
          
        },
      });
      $("#trueorfalse").validate({
        rules: {
            question: {
                required: true,
              },
              answer: {
                required: true,
              },
          
        },
      });
})