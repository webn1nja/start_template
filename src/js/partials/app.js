$(function() {


  $("#my-menu").mmenu({
    extensions:["widescreen", "theme-black", "effect-menu-slide", "pagedim-black"],
    navbar:{
      title:'<img src="/img/my-logo1.png" alt="Тестовый проект">'
    },
    offCanvas: {
      position: "right"
    }
  });

  var api = $("#my-menu").data("mmenu");
  api.bind("opened", function(){
    $(".hamburger").addClass("is-active");
  }).bind("closed",function(){
    $(".hamburger").removeClass("is-active");
  })
});
