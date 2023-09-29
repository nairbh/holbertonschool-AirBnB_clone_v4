let amenities = {};

$(document).ready(function () {
  $('div.amenities input[type=checkbox]').click(function () {
    let amenity = $(this)[0];
    console.log($('this'));
    console.log(amenity);
    if (amenity['checked'] === true) {
      amenities[amenity.attributes[0].nodeValue] = amenity.attributes[1].nodeValue;
      console.log(amenity.attributes[0]);
      console.log(amenity.attributes[1]);
      console.log(Object.values(amenities));
    } else {
      delete amenities[amenity.attributes[0].nodeValue];
    }
    $('div.amenities h4').text(Object.values(amenities).sort().toString() + '\xa0');
    console.log(amenities);
    console.log($('div.amenities h4').text());
    $('div.amenities h4').css({'max-height': '1.25em', 'overflow-y': 'scroll'});
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', 'a string', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'post',
    contentType: 'application/json',
    data: '{}',
    dataType: 'json',
    headers: {'Content-Type': 'application/json'}
  }).done(function (data) {
    data.sort(function (a, b) { return a.name.localeCompare(b.name); });
    for (let place of data) {
      $('<article>').append(
        $('<div>', {'class': 'title'}).append(
          $('<h2>').text(place.name),
          $('<div>', {'class': 'price_by_night'}).html(place.price_by_night)
        ),
        $('<div>', {'class': 'information'}).append(
          $('<div>', {'class': 'max_guest'}).append(
            $('<i>', {'class': 'fa fa-users fa-3x', 'aria-hidden': 'true'}),
            $('<br />'),
            place.max_guest + ' Guests'
          ),
          $('<div>', {'class': 'number_rooms'}).append(
            $('<i>', {'class': 'fa fa-bed fa-3x', 'aria-hidden': 'true'}),
            $('<br />'),
            place.number_rooms + ' Bedrooms'
          ),
          $('<div>', {'class': 'number_bathrooms'}).append(
            $('<i>', {'class': 'fa fa-bath fa-3x', 'aria-hidden': 'true'}),
            $('<br />'),
            place.number_bathrooms + ' Bathroom'
          )
        ),
        $('<div>', {'class': 'description'}).html(place.description)
      ).appendTo($('.places'));
    }
    console.log($('.places').children().last().html());
  });

  $('section.filters > button').click(function () {
    let dataobj = {};
    dataobj.amenities = amenities;
    console.log('dataobj', dataobj);
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(dataobj),
      dataType: 'json',
      headers: {'Content-Type': 'application/json'}
    }).done(function (data) {
      $('.places').empty();
      data.sort(function (a, b) { return a.name.localeCompare(b.name); });
      for (let place of data) {
        $('<article>').append(
          $('<div>', {'class': 'title'}).append(
            $('<h2>').text(place.name),
            $('<div>', {'class': 'price_by_night'}).html(place.price_by_night)
          ),
          $('<div>', {'class': 'information'}).append(
            $('<div>', {'class': 'max_guest'}).append(
              $('<i>', {'class': 'fa fa-users fa-3x', 'aria-hidden': 'true'}),
              $('<br />'),
              place.max_guest + ' Guests'
            ),
            $('<div>', {'class': 'number_rooms'}).append(
              $('<i>', {'class': 'fa fa-bed fa-3x', 'aria-hidden': 'true'}),
              $('<br />'),
              place.number_rooms + ' Bedrooms'
            ),
            $('<div>', {'class': 'number_bathrooms'}).append(
              $('<i>', {'class': 'fa fa-bath fa-3x', 'aria-hidden': 'true'}),
              $('<br />'),
              place.number_bathrooms + ' Bathroom'
            )
          ),
          $('<div>', {'class': 'description'}).html(place.description)
        ).appendTo($('.places'));
      }
      console.log($('.places').children().last().html());
    });
  });
});
