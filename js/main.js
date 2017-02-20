$(function() {
    $('select, input[type="checkbox"], input[type="radio"]').styler({
        selectSmartPositioning: false
    });


    $('.datepicker').datepicker({
        dateFormat: 'dd M yy'
    });



    $(document).click(function(event) {
        if (!$(event.target).closest(".btn.dropdown.active").length) {
            $('.btn.dropdown').removeClass('active');
        }
    });

    $(document).on('click', '.btn.dropdown li', function () {
        $(this).closest('.dropdown').removeClass('active');
    });

    $('.btn.dropdown').click(function(){
        $('.btn.dropdown.active').removeClass('active');

        $(this).addClass('active')
    })

    filterSelectInit();
});


function filterSelectInit() {
    $('.filter-select-value, .filter-select-trigger').click(function () {
        $(this).closest('.filter-select').addClass('collapsed');
    });

    $(document).on('click', '.filter-select .dropdown .filter-list li', function () {
        var value = $(this).clone().children().remove().end().text();

        $(this).closest('.filter-list').find('li').removeClass('selected');
        $(this).addClass('selected');
        $(this).closest('.filter-select').find('.filter-select-value').text(value);
        $(this).closest('.filter-select').removeClass('collapsed');
    });

    $('.filter-select .add-filter').click(function () {
        var value = $(this).parent().clone().children().remove().end().text();

        $(this).closest('.dropdown').find('.filter-list').append('<li><span>Filter</span>' + value +'</li>');
        $(this).closest('li').remove();

        return false;
    });

    $(document).click(function(event) {
        if (!$(event.target).closest(".filter-select.collapsed").length) {
            $('.filter-select').removeClass('collapsed');
        }
    });

}

$(document).ready(function(){

  $('.dashboard-left li.collapse').on('click', function(e){
    $(this).closest('.dashboard-left').toggleClass('collapsed');
    e.stopPropagation();
  });

  $('.dashboard-left').on('click', function(e){
    if ($(this).is('.collapsed')){
      $('.dashboard-left').removeClass('collapsed');
    }
  });

});
