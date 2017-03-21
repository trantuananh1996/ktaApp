
var map;
var journey;
var markers=[];
// var defaultAdress = 'http://192.168.1.90/gpsv2/';
var defaultAdress = 'http://haynhuthe.com/';
function clearMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function getDeviantTime(deviantMinutes){
  var now = new Date();
  var past = new Date(now.getTime() - deviantMinutes*60000);
  post_getJourney(getTimeStamp(past),getTimeStamp(now));
}

function post_getJourney(timeStart,timeEnd){
    var url = defaultAdress+'getToken';    
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
                getJourney(timeStart,timeEnd);
            },
        error:function(){
            alert("Không lấy được token ở getlist!");
        }
    });
}
function getJourney(timeStart,timeEnd){
    var url = defaultAdress+'getJourney';
    var user_id = 0;
    if(localStorage.user_id!=undefined)
            user_id = localStorage.user_id;
    setTimeout(function(){
            $.ajax({
                    url: url,
                    type:'POST',
                    dataType:'text',
                    data:{
                      '_token': $('#_token').val(),
                      'uuid': device.uuid,
                      'user_id': user_id,
                      'timeStart': timeStart,
                      'timeEnd': timeEnd
                    },
                    success: function(result){
                        journey = jQuery.parseJSON(result);
                        drawJourney();
                    },
                    error: function(){
                        alert('Lỗi ajax');
                    }
                });
            },
        500
    );

}

function drawJourney(){
  clearMarkers();
  var image = {
    url: 'asset/icon/point.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(10, 10),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(5, 5)
  };
  for(i=0;i<journey.length;i++)
    {
      loca = journey[i];
        var marker = new google.maps.Marker({
        position: {lat: Number(loca.latitude), lng: Number(loca.longitude)},
        map: map,
        icon: image,
        height: '10px',
        title: loca.checkTime,
      });
      markers.push(marker);
    }
  // var center = {
  //   lat: journey[journey.length/2].latitude+0,
  //   lng: journey[journey.length/2].longitude+0,
  // }
  // map.setCenter(center);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15
  });
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $('#timeStart').val(getTimeStamp(position.timestamp));
      $('#timeEnd').val(getTimeStamp(position.timestamp));
      var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
      localStorage.longitude = position.coords.longitude;
      localStorage.latitude = position.coords.latitude;
      var image = {
        url: 'asset/icon/point-red.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(10, 10),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(5, 5)
      };
      var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: image,
            title: 'Vị trí hiện tại',
            height: '200px',
            infoWindow: {
                  content: '<p>Vị trí hiện tại</p>'
              }  
          });
      markers.push(marker);
      map.setCenter(pos);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }  

// Try HTML5 geolocation.

}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Lỗi: hệ thống định vị bị trục trặc.' :
                        'Lỗi: Trình duyệt của bạn không hỗ trợ định vị.');
}
