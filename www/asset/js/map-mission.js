
	var map;

	var pharmacies;
	var pharmaciesMarkers=[];

	var pharmaciesChosen;
	var pharmaciesChosenMarkers=[];

function clearMarkers(markers){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function initMap() {
      window.map = new google.maps.Map(document.getElementById('map-places'), {
        zoom: 15
      });
      // var infoWindow = new google.maps.InfoWindow({map: map});
      var pos = {
                lat: 21.0341227,
                lng: 105.7840481
              };

      map.setCenter(pos);
      var image = {
        url: 'asset/icon/place.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(15, 21),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(7.5, 21)
      };
      $("[id^='diary']").each(function() {
          var image = {
            url: 'asset/icon/point-red.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(15, 21),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(7.5, 21)
        };
        var marker = new google.maps.Marker({
              position: {lat: Number($(this).attr('lat')), lng: Number($(this).attr('long'))},
              map: map,
              icon: image,
              height: '10px',
              title: $(this).attr('time'),
            }); 
        pharmaciesMarkers.push(marker);
      });

      $("#placesMap option").each(function() {
          var pos = {
            lat: Number($(this).attr('lat')),
            lng: Number($(this).attr('long'))
          };
          if($(this).attr('status')==0)
          var marker = new google.maps.Marker({
              position: {lat: Number($(this).attr('lat')), lng: Number($(this).attr('long'))},
              map: map,
              icon: image,
              height: '10px',
              title: $(this).html(),
            });  
          else if($(this).attr('status')==1)
            var marker = new google.maps.Marker({
              position: {lat: Number($(this).attr('lat')), lng: Number($(this).attr('long'))},
              map: map,
              height: '10px',
              title: $(this).html(),
            }); 
          pharmaciesMarkers.push(marker);
          $(this).attr('selected','');
          showInfor($(this));
          map.setCenter(pos);
        });

}
$(document).ready(function(){
  $("#placesMap").change(function() {
    $('#placesMap option:selected').each(function() {
      var pos = {
          lat: Number($(this).attr('lat')),
          lng: Number($(this).attr('long'))
        };
      map.setCenter(pos);
      showInfor($(this));
    });
  });
});

function getMission(){
    var url = defaultAdress+'getMission';  
    if($('#_token').val()!=''){
        if($('#time').val()!=''){
          data = {
             '_token':  $('#_token').val(),
             'timeActive': $('#time').val()
          };
        }
        else
          data = {
             '_token':  $('#_token').val()
          };
        $.ajax({
            url      : url,
            type     : "POST",
            data     : data,
            success  : function (data){
                    if(data.code==200){
                        newdata = data.data;
                        createDiary(newdata.diaries)
                        createChecks(newdata.checks);
                    }else{
                      $('#map-places').attr("style","height: 280px");
                      $('#map-places').html('<br/><br/><br/><h4 align="center">'+data.message+'</h4>');
                    }
                },
            error:function(){ 
                alert("Lỗi, vui lòng kiểm tra.");
            }
        });
    }
}

function post_login_mission(){
    var url = defaultAdress+'getToken';   
    var token='';
    $.ajax({
        url      : url,
        type     : "GET",
        data     : {
                    },
        success  : function (data){
                $('#_token').val(data);
                getMission();
            },
        error:function(){
            alert("Lỗi kết nối !");
        }
    }); 
}



function createChecks(checks){
    $('#placesMap').html('');
    for(i=0;i<checks.length;i++){
        html = '<option offset="'+i+'" id="check'+checks[i].id+'" lat="'+checks[i].latitude+'" long="'+checks[i].longitude+'" status="'+checks[i].status+'" name="'+checks[i].name+'" telephone="'+checks[i].telephone+'" address="'+checks[i].address+'" complete="'+checks[i].complete+'">'+checks[i].name + checks[i].complete+'</option>';
        cur_html = $('#placesMap').html();
        $('#placesMap').html(cur_html+html);
    }
    initMap();
}

function createDiary(diaries){
    $('#diaries').html('');
    for(i=0;i<diaries.length;i++){
        html = '<div id="diary'+diaries[i].id+'" lat="'+diaries[i].latitude+'" long="'+diaries[i].longitude+'" time="'+diaries[i].time+'" style="display:none;">'+'</div>';
        cur_html = $('#diaries').html();
        $('#diaries').html(cur_html+html);
    }
}

function showInfor(tag){
  $('#placeName').html('<b>Tên : </b>'+tag.attr('name'));
  $('#placeAddress').html('<b>Địa chỉ : </b>'+tag.attr('address'));
  $('#placePhone').html('<b>Số điện thoại : </b>'+tag.attr('telephone'));
  $('#placeStatus').html('<b>Trạng thái : </b>'+tag.attr('complete'));
}