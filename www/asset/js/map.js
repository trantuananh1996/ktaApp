var map;
var users;
var pharmacies;
var pharmacyMarkers=[];
var markers=[];
// var defaultAdress = 'http://192.168.1.91/gpsv2/';
var defaultAdress = 'http://haynhuthe.com/';
// var defaultAdress = 'http://localhost/gpsv2/';
function clearMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function calculateDistance(location1,location2)
{
    try
    {
        var miledistance = location1.distanceFrom(location2, 3959).toFixed(1);
        var kmdistance = (miledistance * 1.609344).toFixed(1);
        return kmdistance;
    }
    catch (error)
    {
        alert(error);
    }
}
function getListOnlines(map){
    var url = defaultAdress + 'listOnlines';
    setTimeout(function(){
            $.ajax({
                    url: url,
                    type:'get',
                    dataType:'text',
                    data:{
                    },
                    success: function(result){
                        users = jQuery.parseJSON(result);
                        drawListUser(map);
                    },
                    error: function(){
                    }
                });
            },
        500
    );

}

function drawListUser(map){
  clearMarkers();
  var image = {
    url: 'asset/icon/user.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(10, 10),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(5, 5)
  };
  for(i=0;i<users.length;i++)
  {
      user = users[i];
      if(user.user_id != localStorage.user_id){
        var marker = new google.maps.Marker({
          position: {lat: user.latitude+0, lng: user.longitude+0},
          map: map,
          icon: image,
          height: '10px',
          title: "người dùng " + i,
        });  
        
      }
      else{
        var marker = new google.maps.Marker({
            position: {lat: user.latitude+0, lng: user.longitude+0},
            map: map,
            title: 'Vị trí hiện tại',
            height: '200px',
            infoWindow: {
                  content: '<p>Vị trí hiện tại</p>'
              }  
          });
      }
      markers.push(marker);
  }
}
// draw list pharmacy 
function post_getListPharmacies(map){
    var url = defaultAdress+'getToken';    
    var token='';
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
                getListPharmacies(map);
            },
        error:function(){
            alert("Không lấy được token ở đây!");
        }
    });
}
function getListPharmacies(map){
    var url = defaultAdress + 'listPharmacies';
    $.ajax({
            url: url,
            type:"POST",
            dataType:'text',
            data:{
              '_token': $('#_token').val(),
              'lat': localStorage.latitude,
              'long': localStorage.longitude,
              'km': 5,
            },
            success: function(result){
                pharmacies = jQuery.parseJSON(result);
                drawListPharmacies(map);
            },
            error: function(xhr, status, error) {
              var err = eval("(" + xhr.responseText + ")");
              alert(err.Message);
            }
        });
            
}

function drawListPharmacies(map){
  var image = {
    url: 'asset/icon/place.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(15, 21),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(7.5, 21)
  };
  for(i=0;i<pharmacies.length;i++)
    {
      pharmacy = pharmacies[i];
      var pos = {
        lat: Number(pharmacy.latitude), 
        lng: Number(pharmacy.longitude)
      };
        var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: image,
        height: '10px',
        title: pharmacy.name,
      });
      pharmacyMarkers.push(marker);
      map.setCenter(pos)
    }
}

//draw your location
//draw your location
function drawMe(map){
  if(localStorage.longitude!=undefined && localStorage.latitude!=undefined){
      var pos = {
            lat: Number(localStorage.latitude),
            lng: Number(localStorage.longitude)
          };
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
            height: '10px',
            infoWindow: {
                  content: '<p>Vị trí hiện tại</p>'
              }  
          });
      markers.push(marker);
      map.setCenter(pos);
  }
  else {
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
      localStorage.longitude = position.coords.longitude;
      localStorage.latitude = position.coords.latitude;
      var image = {
        url: 'dist/point-red.png',
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
            height: '10px',
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
  }
  
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15
  });
  post_getListPharmacies(map);
  drawMe(map);
  setInterval(function(){
    clearMarkers();
    drawMe(map);
  },30000);

  //draw users Online

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Lỗi: hệ thống định vị bị trục trặc.' :
                        'Lỗi: Trình duyệt của bạn không hỗ trợ định vị.');
}
