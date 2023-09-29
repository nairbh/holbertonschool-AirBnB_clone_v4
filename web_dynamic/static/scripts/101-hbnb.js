let amenities = {};
let cities = {};
let states = {};

$(document).ready(function () {
  $('div.amenities input[type=checkbox]').click(function () {
    let amenity = $(this)[0];
    if (amenity['checked'] === true) {
      amenities[amenity.attributes[0].nodeValue] = amenity.attributes[1].nodeValue;
    } else {
      delete amenities[amenity.attributes[0].nodeValue];
    }
    $('div.amenities h4').text(Object.values(amenities).sort().toString() + '\xa0');
    $('div.amenities h4').css({'max-height': '1.25em', 'overflow-y': 'scroll'});
  });

  $('div.locations h2 > input[type=checkbox]').click(function () {
    let state = $(this)[0];
    if (state['checked'] === true) {
      states[state.attributes[0].nodeValue] = state.attributes[1].nodeValue;
    } else {
      delete states[state.attributes[0].nodeValue];
    }
    $('div.locations > h4').text(Object.values(states).sort().toString() + '\xa0');
    $('div.locations > h4').css({'max-height': '1.25em', 'overflow-y': 'scroll'});
  });

  $('div.locations > ul > ul > li > input[type=checkbox]').click(function () {
    let city = $(this)[0];
    if (city['checked'] === true) {
      cities[city.attributes[0].nodeValue] = city.attributes[1].nodeValue;
    } else {
      delete cities[city.attributes[0].nodeValue];
    }
    $('div.locations > h4').text(Object.values(cities).sort().toString() + '\xa0');
    $('div.locations > h4').css({'max-height': '1.25em', 'overflow-y': 'scroll'});
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', 'a string', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  let loadPlaces = function (data) {
    $('.places').empty();
    data.sort(function (a, b) { return a.name.localeCompare(b.name); });
    for (let place of data) {
      $('<article>', {'id': place.id}).append(
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
      $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews/', function (data) {
        let list = $('<ul>');
        for (let review of data) {
          list.append(
            $('<li>').append(
              $('<h3>', {'id': review.id}).text('Loading Title...'),
              $('<p>').text(review.text)
            )
          );
          let reviewId = review.id;
          $.get('http://0.0.0.0:5001/api/v1/users/' + review.user_id, function (data) {
            let name = data.first_name + ' ' + data.last_name;
            let date = review.updated_at.substring(0, review.updated_at.indexOf(' '));
            let title = 'From ' + name + ' on ' + date;
            $('#' + reviewId).text(title);
          });
        }
        if ($('#' + place.id).children('.reviews').length === 0) {
          $('#' + place.id).append(
            $('<div>', {'class': 'reviews'}).append(
              $('<h2>').text(data.length + ' Reviews'),
              $('<span>').append('show'),
              list
            )
          );
        }
        $('#' + place.id).find('span').click(function () {
          $('#' + place.id).find('ul').toggle('display');
        });
      });
    }
  };

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'post',
    contentType: 'application/json',
    data: '{}',
    dataType: 'json',
    headers: {'Content-Type': 'application/json'}
  }).done(function (data) { loadPlaces(data); });

  $('section.filters > button').click(function () {
    let dataobj = {};
    dataobj.amenities = amenities;
    dataobj.states = states;
    dataobj.cities = cities;
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(dataobj),
      dataType: 'json',
      headers: {'Content-Type': 'application/json'}
    }).done(function (data) { loadPlaces(data); });
  });
});
